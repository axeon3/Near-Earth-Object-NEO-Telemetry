"""
nasa_telemetry_hardening.py
NASA Telemetry Ingestion & Input Sanitization Engine
Enforces CWE Top 25 input validation and boundary guards on incoming arrays.
"""

import sys
import json
import math

def sanitize_numeric(val, default_val=0.0, min_val=0.0, max_val=1e12) -> float:
    """Sanitizes raw input values to prevent calculation corruptions."""
    try:
        parsed = float(val)
        if math.isnan(parsed) or math.isinf(parsed):
            return default_val
        return max(min_val, min(parsed, max_val))
    except (ValueError, TypeError):
        return default_val

def validate_telemetry_payload(raw_json_str: str) -> dict:
    try:
        data = json.loads(raw_json_str)
    except json.JSONDecodeError as e:
        return {"status": "ERROR", "message": f"Malformed JSON payload: {str(e)}"}

    records = data.get("near_earth_objects", [])
    sanitized_records = []

    for item in records:
        diameter = sanitize_numeric(item.get("estimated_diameter_m"), default_val=10.0, min_val=0.1, max_val=100000.0)
        velocity_kms = sanitize_numeric(item.get("velocity_kms"), default_val=11.2, min_val=0.0, max_val=1000.0)
        miss_km = sanitize_numeric(item.get("miss_distance_km"), default_val=384400.0, min_val=0.0, max_val=1e9)

        # Kinetic energy E = 0.5 * m * v^2
        radius = max(0.5, diameter / 2.0)
        volume = (4.0 / 3.0) * math.pi * (radius ** 3)
        mass_kg = volume * 2500.0
        kinetic_energy_j = 0.5 * mass_kg * ((velocity_kms * 1000.0) ** 2)
        kinetic_energy_mt = kinetic_energy_j / 4.184e15

        sanitized_records.append({
            "id": str(item.get("id", "UNKNOWN")),
            "diameter_m": round(diameter, 2),
            "velocity_kms": round(velocity_kms, 2),
            "miss_distance_km": round(miss_km, 2),
            "kinetic_energy_mt": round(kinetic_energy_mt, 4)
        })

    return {"status": "SUCCESS", "validated_count": len(sanitized_records), "data": sanitized_records}

if __name__ == "__main__":
    if len(sys.argv) > 1:
        with open(sys.argv[1], "r") as f:
            print(json.dumps(validate_telemetry_payload(f.read()), indent=2))
    else:
        test_payload = json.dumps({
            "near_earth_objects": [
                {"id": "99942", "estimated_diameter_m": "340.0", "velocity_kms": "30.73", "miss_distance_km": "31600.0"},
                {"id": "INVALID", "estimated_diameter_m": "NaN", "velocity_kms": "inf", "miss_distance_km": "-500"}
            ]
        })
        print(json.dumps(validate_telemetry_payload(test_payload), indent=2))
