export interface NeoCloseApproachData {
  close_approach_date: string;
  close_approach_date_full: string;
  epoch_date_close_approach: number;
  relative_velocity: {
    kilometers_per_second: string;
    kilometers_per_hour: string;
    miles_per_hour: string;
  };
  miss_distance: {
    astronomical: string;
    lunar: string;
    kilometers: string;
    miles: string;
  };
  orbiting_body: string;
}

export interface RawNeoItem {
  id: string;
  neo_reference_id: string;
  name: string;
  nasa_jpl_url: string;
  absolute_magnitude_h: number;
  is_potentially_hazardous_asteroid: boolean;
  is_sentry_object?: boolean;
  estimated_diameter: {
    kilometers: { estimated_diameter_min: number; estimated_diameter_max: number };
    meters: { estimated_diameter_min: number; estimated_diameter_max: number };
    miles: { estimated_diameter_min: number; estimated_diameter_max: number };
    feet: { estimated_diameter_min: number; estimated_diameter_max: number };
  };
  close_approach_data: NeoCloseApproachData[];
}

export interface RawNeoFeedResponse {
  links: {
    next?: string;
    previous?: string;
    self: string;
  };
  element_count: number;
  near_earth_objects: Record<string, RawNeoItem[]>;
}

export type UnitSystem = 'metric' | 'imperial';

export interface TelemetryObject {
  id: string;
  name: string;
  diameterMaxM: number;
  diameterMinM: number;
  diameterMaxFt: number;
  diameterMinFt: number;
  velocityKmh: number;
  velocityKms: number;
  velocityMph: number;
  velocityMps: number;
  missDistanceKm: number;
  missDistanceMiles: number;
  missDistanceLunar: number;
  missDistanceAU: number;
  hazardous: boolean;
  closeApproachDate: string;
  closeApproachDateFull: string;
  orbitingBody: string;
  absoluteMagnitude: number;
  jplUrl: string;
  isSentry: boolean;
  kineticEnergyMt: number;
  sizeComparison: string;
}

export interface TelemetrySummary {
  totalCount: number;
  hazardousCount: number;
  peakVelocityKmh: number;
  peakVelocityMph: number;
  closestMissKm: number;
  closestMissMiles: number;
  closestMissLunar: number;
  maxDiameterM: number;
  maxDiameterFt: number;
  avgDiameterM: number;
  avgDiameterFt: number;
  startDate: string;
  endDate: string;
}
