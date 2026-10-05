import { RawNeoFeedResponse, TelemetryObject, TelemetrySummary } from '../types/nasa';
import { fallbackNeoData } from '../data/cachedNeoData';

const CACHE_PREFIX = 'nasa_neows_cache_';
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour, matches @st.cache_data(ttl=3600)

export interface FetchResult {
  data: TelemetryObject[];
  raw: RawNeoFeedResponse | null;
  error: string | null;
  isCached: boolean;
  isFallback: boolean;
  sourceLabel: string;
}

// Calculate kinetic impact energy in Megatons of TNT:
// E = 0.5 * mass * v^2
// mass = volume * density (assuming spherical asteroid with average rocky density 2500 kg/m^3)
// 1 Megaton of TNT = 4.184 x 10^15 Joules
function calculateKineticEnergyMt(diameterMeters: number, velocityKms: number): number {
  if (diameterMeters <= 0 || velocityKms <= 0) return 0;
  const radius = diameterMeters / 2;
  const volume = (4 / 3) * Math.PI * Math.pow(radius, 3);
  const density = 2500; // kg/m3 average chondrite asteroid density
  const massKg = volume * density;
  const velocityMs = velocityKms * 1000;
  const energyJoules = 0.5 * massKg * Math.pow(velocityMs, 2);
  const megatons = energyJoules / 4.184e15;
  return Number(megatons.toFixed(2));
}

// Provide relatable physical size scale
function getSizeComparison(diameterM: number): string {
  if (diameterM < 10) return 'Car / Small Bus (~5-10m)';
  if (diameterM < 30) return 'House / Chelyabinsk meteor (~20m)';
  if (diameterM < 80) return 'Commercial Airliner (~40-70m)';
  if (diameterM < 150) return 'Statue of Liberty (~93m)';
  if (diameterM < 300) return 'Pyramid of Giza / Stadium (~140-250m)';
  if (diameterM < 600) return 'Empire State Building (~443m)';
  if (diameterM < 1000) return 'Burj Khalifa (~828m)';
  return 'Mountain Peak (> 1km)';
}

export function parseRawNeoData(raw: RawNeoFeedResponse): TelemetryObject[] {
  const dates = Object.keys(raw.near_earth_objects || {});
  const neoList: TelemetryObject[] = [];

  for (const date of dates) {
    const items = raw.near_earth_objects[date] || [];
    for (const item of items) {
      const approach = item.close_approach_data?.[0];
      const velocityKmh = approach ? parseFloat(approach.relative_velocity.kilometers_per_hour) : 0;
      const velocityKms = approach ? parseFloat(approach.relative_velocity.kilometers_per_second) : 0;
      const missDistKm = approach ? parseFloat(approach.miss_distance.kilometers) : 0;
      const missDistLd = approach ? parseFloat(approach.miss_distance.lunar) : 0;
      const missDistAu = approach ? parseFloat(approach.miss_distance.astronomical) : 0;
      const diameterMax = item.estimated_diameter?.meters?.estimated_diameter_max || 0;
      const diameterMin = item.estimated_diameter?.meters?.estimated_diameter_min || 0;
      const diameterMaxFt = item.estimated_diameter?.feet?.estimated_diameter_max 
        ? Math.round(item.estimated_diameter.feet.estimated_diameter_max * 100) / 100 
        : Math.round(diameterMax * 3.28084 * 100) / 100;
      const diameterMinFt = item.estimated_diameter?.feet?.estimated_diameter_min 
        ? Math.round(item.estimated_diameter.feet.estimated_diameter_min * 100) / 100 
        : Math.round(diameterMin * 3.28084 * 100) / 100;

      const velocityMph = approach && approach.relative_velocity.miles_per_hour 
        ? Math.round(parseFloat(approach.relative_velocity.miles_per_hour) * 100) / 100 
        : Math.round(velocityKmh * 0.621371 * 100) / 100;
      const velocityMps = Math.round(velocityKms * 0.621371 * 100) / 100;

      const missDistanceMiles = approach && approach.miss_distance.miles 
        ? Math.round(parseFloat(approach.miss_distance.miles) * 100) / 100 
        : Math.round(missDistKm * 0.621371 * 100) / 100;

      const hazardous = Boolean(item.is_potentially_hazardous_asteroid);

      neoList.push({
        id: item.id,
        name: item.name,
        diameterMaxM: Math.round(diameterMax * 100) / 100,
        diameterMinM: Math.round(diameterMin * 100) / 100,
        diameterMaxFt,
        diameterMinFt,
        velocityKmh: Math.round(velocityKmh * 100) / 100,
        velocityKms: Math.round(velocityKms * 100) / 100,
        velocityMph,
        velocityMps,
        missDistanceKm: Math.round(missDistKm * 100) / 100,
        missDistanceMiles,
        missDistanceLunar: Math.round(missDistLd * 100) / 100,
        missDistanceAU: missDistAu,
        hazardous,
        closeApproachDate: approach?.close_approach_date || date,
        closeApproachDateFull: approach?.close_approach_date_full || date,
        orbitingBody: approach?.orbiting_body || 'Earth',
        absoluteMagnitude: item.absolute_magnitude_h,
        jplUrl: item.nasa_jpl_url || `https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=${item.id}`,
        isSentry: Boolean(item.is_sentry_object),
        kineticEnergyMt: calculateKineticEnergyMt(diameterMax, velocityKms),
        sizeComparison: getSizeComparison(diameterMax)
      });
    }
  }

  // Sort descending by hazardous first, then closest miss distance
  return neoList.sort((a, b) => {
    if (a.hazardous && !b.hazardous) return -1;
    if (!a.hazardous && b.hazardous) return 1;
    return a.missDistanceKm - b.missDistanceKm;
  });
}

export function computeSummaryMetrics(items: TelemetryObject[], startDate: string, endDate: string): TelemetrySummary {
  if (items.length === 0) {
    return {
      totalCount: 0,
      hazardousCount: 0,
      peakVelocityKmh: 0,
      peakVelocityMph: 0,
      closestMissKm: 0,
      closestMissMiles: 0,
      closestMissLunar: 0,
      maxDiameterM: 0,
      maxDiameterFt: 0,
      avgDiameterM: 0,
      avgDiameterFt: 0,
      startDate,
      endDate
    };
  }

  const hazardousCount = items.filter(i => i.hazardous).length;
  const peakVelocityKmh = Math.max(...items.map(i => i.velocityKmh));
  const peakVelocityMph = Math.max(...items.map(i => i.velocityMph));
  const closestMissKm = Math.min(...items.map(i => i.missDistanceKm));
  const closestMissMiles = Math.min(...items.map(i => i.missDistanceMiles));
  const closestItem = items.find(i => i.missDistanceKm === closestMissKm);
  const maxDiameterM = Math.max(...items.map(i => i.diameterMaxM));
  const maxDiameterFt = Math.max(...items.map(i => i.diameterMaxFt));
  const avgDiameterM = Math.round((items.reduce((acc, cur) => acc + cur.diameterMaxM, 0) / items.length) * 100) / 100;
  const avgDiameterFt = Math.round((items.reduce((acc, cur) => acc + cur.diameterMaxFt, 0) / items.length) * 100) / 100;

  return {
    totalCount: items.length,
    hazardousCount,
    peakVelocityKmh,
    peakVelocityMph,
    closestMissKm,
    closestMissMiles,
    closestMissLunar: closestItem ? closestItem.missDistanceLunar : 0,
    maxDiameterM,
    maxDiameterFt,
    avgDiameterM,
    avgDiameterFt,
    startDate,
    endDate
  };
}

export async function fetchNasaTelemetry(
  apiKey: string = 'DEMO_KEY',
  startDate: string,
  endDate: string,
  forceRefresh: boolean = false
): Promise<FetchResult> {
  const cleanKey = (apiKey || 'DEMO_KEY').trim();
  const cacheKey = `${CACHE_PREFIX}${cleanKey}_${startDate}_${endDate}`;

  // Check client-side session/local cache
  if (!forceRefresh) {
    try {
      const cachedItem = localStorage.getItem(cacheKey);
      if (cachedItem) {
        const parsed = JSON.parse(cachedItem);
        if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
          const telemetry = parseRawNeoData(parsed.raw);
          return {
            data: telemetry,
            raw: parsed.raw,
            error: null,
            isCached: true,
            isFallback: false,
            sourceLabel: 'Local Cache (TTL 1h)'
          };
        }
      }
    } catch {
      // Ignore localStorage read errors
    }
  }

  // NASA NeoWS Official REST Endpoint
  const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${cleanKey}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      const rawJson: RawNeoFeedResponse = await response.json();
      
      // Save to cache
      try {
        localStorage.setItem(cacheKey, JSON.stringify({
          raw: rawJson,
          timestamp: Date.now()
        }));
      } catch {
        // Cache full / quota
      }

      const telemetry = parseRawNeoData(rawJson);
      return {
        data: telemetry,
        raw: rawJson,
        error: null,
        isCached: false,
        isFallback: false,
        sourceLabel: `Live NeoWS Feed (${cleanKey === 'DEMO_KEY' ? 'DEMO_KEY' : 'Authenticated'})`
      };
    }

    if (response.status === 429) {
      // Rate limit hit
      const fallbackList = parseRawNeoData(fallbackNeoData);
      return {
        data: fallbackList,
        raw: fallbackNeoData,
        error: 'API Rate Limit Exceeded (HTTP 429). The shared DEMO_KEY reached its hourly quota. Fallback telemetry array deployed. Enter your free personal API key in Telemetry Controls to resume live streaming.',
        isCached: false,
        isFallback: true,
        sourceLabel: 'Fallback Planetary Telemetry Matrix'
      };
    }

    const errorText = await response.text();
    let errMessage = `Telemetry API Error: Status Code ${response.status}`;
    try {
      const errJson = JSON.parse(errorText);
      if (errJson.error?.message) {
        errMessage = `${errMessage} - ${errJson.error.message}`;
      }
    } catch {
      // not json
    }

    const fallbackList = parseRawNeoData(fallbackNeoData);
    return {
      data: fallbackList,
      raw: fallbackNeoData,
      error: `${errMessage}. Using vetted planetary orbital cache.`,
      isCached: false,
      isFallback: true,
      sourceLabel: 'Vetted Planetary Orbital Cache'
    };

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    const fallbackList = parseRawNeoData(fallbackNeoData);
    return {
      data: fallbackList,
      raw: fallbackNeoData,
      error: `Network Connection Notice: ${message}. Rendered cached planetary telemetry array.`,
      isCached: false,
      isFallback: true,
      sourceLabel: 'Cached Space Agency Telemetry Array'
    };
  }
}
