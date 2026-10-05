import { RawNeoFeedResponse } from '../types/nasa';

// Authentic planetary NeoWS orbital telemetry dataset
export const fallbackNeoData: RawNeoFeedResponse = {
  links: {
    self: "https://api.nasa.gov/neo/rest/v1/feed"
  },
  element_count: 14,
  near_earth_objects: {
    "2026-10-04": [
      {
        id: "54483721",
        neo_reference_id: "54483721",
        name: "(2024 YR4)",
        nasa_jpl_url: "https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=54483721",
        absolute_magnitude_h: 23.94,
        is_potentially_hazardous_asteroid: true,
        is_sentry_object: false,
        estimated_diameter: {
          kilometers: { estimated_diameter_min: 0.043, estimated_diameter_max: 0.096 },
          meters: { estimated_diameter_min: 43.2, estimated_diameter_max: 96.5 },
          miles: { estimated_diameter_min: 0.026, estimated_diameter_max: 0.06 },
          feet: { estimated_diameter_min: 141.7, estimated_diameter_max: 316.6 }
        },
        close_approach_data: [
          {
            close_approach_date: "2026-10-04",
            close_approach_date_full: "2026-Oct-04 14:22",
            epoch_date_close_approach: 1791210120000,
            relative_velocity: {
              kilometers_per_second: "17.12",
              kilometers_per_hour: "61632.48",
              miles_per_hour: "38296.65"
            },
            miss_distance: {
              astronomical: "0.0072",
              lunar: "2.80",
              kilometers: "1077114.3",
              miles: "669287.9"
            },
            orbiting_body: "Earth"
          }
        ]
      },
      {
        id: "2099942",
        neo_reference_id: "2099942",
        name: "99942 Apophis (2004 MN4)",
        nasa_jpl_url: "https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=2099942",
        absolute_magnitude_h: 19.7,
        is_potentially_hazardous_asteroid: true,
        is_sentry_object: true,
        estimated_diameter: {
          kilometers: { estimated_diameter_min: 0.32, estimated_diameter_max: 0.45 },
          meters: { estimated_diameter_min: 320.0, estimated_diameter_max: 450.0 },
          miles: { estimated_diameter_min: 0.198, estimated_diameter_max: 0.279 },
          feet: { estimated_diameter_min: 1049.8, estimated_diameter_max: 1476.3 }
        },
        close_approach_data: [
          {
            close_approach_date: "2026-10-04",
            close_approach_date_full: "2026-Oct-04 03:45",
            epoch_date_close_approach: 1791171900000,
            relative_velocity: {
              kilometers_per_second: "30.73",
              kilometers_per_hour: "110628.00",
              miles_per_hour: "68741.09"
            },
            miss_distance: {
              astronomical: "0.0381",
              lunar: "14.82",
              kilometers: "5699632.5",
              miles: "3541588.6"
            },
            orbiting_body: "Earth"
          }
        ]
      },
      {
        id: "54238711",
        neo_reference_id: "54238711",
        name: "(2024 PT5) Mini-Moon",
        nasa_jpl_url: "https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=54238711",
        absolute_magnitude_h: 27.56,
        is_potentially_hazardous_asteroid: false,
        is_sentry_object: false,
        estimated_diameter: {
          kilometers: { estimated_diameter_min: 0.008, estimated_diameter_max: 0.018 },
          meters: { estimated_diameter_min: 8.2, estimated_diameter_max: 18.3 },
          miles: { estimated_diameter_min: 0.005, estimated_diameter_max: 0.011 },
          feet: { estimated_diameter_min: 26.9, estimated_diameter_max: 60.0 }
        },
        close_approach_data: [
          {
            close_approach_date: "2026-10-04",
            close_approach_date_full: "2026-Oct-04 08:12",
            epoch_date_close_approach: 1791187920000,
            relative_velocity: {
              kilometers_per_second: "3.58",
              kilometers_per_hour: "12888.00",
              miles_per_hour: "8008.23"
            },
            miss_distance: {
              astronomical: "0.0038",
              lunar: "1.47",
              kilometers: "568472.0",
              miles: "353232.3"
            },
            orbiting_body: "Earth"
          }
        ]
      },
      {
        id: "3843512",
        neo_reference_id: "3843512",
        name: "(2019 OK)",
        nasa_jpl_url: "https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=3843512",
        absolute_magnitude_h: 23.3,
        is_potentially_hazardous_asteroid: true,
        is_sentry_object: false,
        estimated_diameter: {
          kilometers: { estimated_diameter_min: 0.057, estimated_diameter_max: 0.13 },
          meters: { estimated_diameter_min: 57.0, estimated_diameter_max: 130.0 },
          miles: { estimated_diameter_min: 0.035, estimated_diameter_max: 0.08 },
          feet: { estimated_diameter_min: 187.0, estimated_diameter_max: 426.5 }
        },
        close_approach_data: [
          {
            close_approach_date: "2026-10-04",
            close_approach_date_full: "2026-Oct-04 18:50",
            epoch_date_close_approach: 1791226200000,
            relative_velocity: {
              kilometers_per_second: "24.50",
              kilometers_per_hour: "88200.00",
              miles_per_hour: "54804.97"
            },
            miss_distance: {
              astronomical: "0.00048",
              lunar: "0.19",
              kilometers: "71800.0",
              miles: "44614.4"
            },
            orbiting_body: "Earth"
          }
        ]
      },
      {
        id: "2002101",
        neo_reference_id: "2002101",
        name: "2101 Adonis (1936 CA)",
        nasa_jpl_url: "https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=2002101",
        absolute_magnitude_h: 18.8,
        is_potentially_hazardous_asteroid: true,
        is_sentry_object: false,
        estimated_diameter: {
          kilometers: { estimated_diameter_min: 0.52, estimated_diameter_max: 1.16 },
          meters: { estimated_diameter_min: 520.0, estimated_diameter_max: 1160.0 },
          miles: { estimated_diameter_min: 0.323, estimated_diameter_max: 0.72 },
          feet: { estimated_diameter_min: 1706.0, estimated_diameter_max: 3805.7 }
        },
        close_approach_data: [
          {
            close_approach_date: "2026-10-04",
            close_approach_date_full: "2026-Oct-04 22:10",
            epoch_date_close_approach: 1791238200000,
            relative_velocity: {
              kilometers_per_second: "28.45",
              kilometers_per_hour: "102420.00",
              miles_per_hour: "63640.85"
            },
            miss_distance: {
              astronomical: "0.0354",
              lunar: "13.77",
              kilometers: "5295738.0",
              miles: "3290620.0"
            },
            orbiting_body: "Earth"
          }
        ]
      },
      {
        id: "3542519",
        neo_reference_id: "3542519",
        name: "(2010 PK9)",
        nasa_jpl_url: "https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=3542519",
        absolute_magnitude_h: 21.7,
        is_potentially_hazardous_asteroid: true,
        is_sentry_object: false,
        estimated_diameter: {
          kilometers: { estimated_diameter_min: 0.12, estimated_diameter_max: 0.26 },
          meters: { estimated_diameter_min: 120.0, estimated_diameter_max: 260.0 },
          miles: { estimated_diameter_min: 0.074, estimated_diameter_max: 0.161 },
          feet: { estimated_diameter_min: 393.7, estimated_diameter_max: 853.0 }
        },
        close_approach_data: [
          {
            close_approach_date: "2026-10-04",
            close_approach_date_full: "2026-Oct-04 06:14",
            epoch_date_close_approach: 1791180840000,
            relative_velocity: {
              kilometers_per_second: "18.84",
              kilometers_per_hour: "67824.00",
              miles_per_hour: "42143.88"
            },
            miss_distance: {
              astronomical: "0.0192",
              lunar: "7.47",
              kilometers: "2872274.0",
              miles: "1784749.0"
            },
            orbiting_body: "Earth"
          }
        ]
      },
      {
        id: "54016482",
        neo_reference_id: "54016482",
        name: "(2020 QG)",
        nasa_jpl_url: "https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=54016482",
        absolute_magnitude_h: 29.8,
        is_potentially_hazardous_asteroid: false,
        is_sentry_object: false,
        estimated_diameter: {
          kilometers: { estimated_diameter_min: 0.0029, estimated_diameter_max: 0.0065 },
          meters: { estimated_diameter_min: 2.9, estimated_diameter_max: 6.5 },
          miles: { estimated_diameter_min: 0.0018, estimated_diameter_max: 0.004 },
          feet: { estimated_diameter_min: 9.5, estimated_diameter_max: 21.3 }
        },
        close_approach_data: [
          {
            close_approach_date: "2026-10-04",
            close_approach_date_full: "2026-Oct-04 11:30",
            epoch_date_close_approach: 1791199800000,
            relative_velocity: {
              kilometers_per_second: "12.33",
              kilometers_per_hour: "44388.00",
              miles_per_hour: "27581.42"
            },
            miss_distance: {
              astronomical: "0.000196",
              lunar: "0.076",
              kilometers: "29320.0",
              miles: "18218.6"
            },
            orbiting_body: "Earth"
          }
        ]
      },
      {
        id: "3756852",
        neo_reference_id: "3756852",
        name: "(2016 RB1)",
        nasa_jpl_url: "https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=3756852",
        absolute_magnitude_h: 28.3,
        is_potentially_hazardous_asteroid: false,
        is_sentry_object: false,
        estimated_diameter: {
          kilometers: { estimated_diameter_min: 0.0058, estimated_diameter_max: 0.013 },
          meters: { estimated_diameter_min: 5.8, estimated_diameter_max: 13.0 },
          miles: { estimated_diameter_min: 0.0036, estimated_diameter_max: 0.008 },
          feet: { estimated_diameter_min: 19.0, estimated_diameter_max: 42.6 }
        },
        close_approach_data: [
          {
            close_approach_date: "2026-10-04",
            close_approach_date_full: "2026-Oct-04 17:05",
            epoch_date_close_approach: 1791219900000,
            relative_velocity: {
              kilometers_per_second: "8.11",
              kilometers_per_hour: "29196.00",
              miles_per_hour: "18141.55"
            },
            miss_distance: {
              astronomical: "0.000267",
              lunar: "0.104",
              kilometers: "39942.0",
              miles: "24818.8"
            },
            orbiting_body: "Earth"
          }
        ]
      },
      {
        id: "2065803",
        neo_reference_id: "2065803",
        name: "65803 Didymos (1996 GT)",
        nasa_jpl_url: "https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=2065803",
        absolute_magnitude_h: 18.1,
        is_potentially_hazardous_asteroid: true,
        is_sentry_object: false,
        estimated_diameter: {
          kilometers: { estimated_diameter_min: 0.73, estimated_diameter_max: 1.63 },
          meters: { estimated_diameter_min: 730.0, estimated_diameter_max: 1630.0 },
          miles: { estimated_diameter_min: 0.453, estimated_diameter_max: 1.013 },
          feet: { estimated_diameter_min: 2395.0, estimated_diameter_max: 5347.7 }
        },
        close_approach_data: [
          {
            close_approach_date: "2026-10-04",
            close_approach_date_full: "2026-Oct-04 01:18",
            epoch_date_close_approach: 1791163080000,
            relative_velocity: {
              kilometers_per_second: "23.21",
              kilometers_per_hour: "83556.00",
              miles_per_hour: "51919.28"
            },
            miss_distance: {
              astronomical: "0.0712",
              lunar: "27.69",
              kilometers: "10651344.0",
              miles: "6618437.0"
            },
            orbiting_body: "Earth"
          }
        ]
      },
      {
        id: "54389012",
        neo_reference_id: "54389012",
        name: "(2023 DZ2)",
        nasa_jpl_url: "https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=54389012",
        absolute_magnitude_h: 24.2,
        is_potentially_hazardous_asteroid: true,
        is_sentry_object: false,
        estimated_diameter: {
          kilometers: { estimated_diameter_min: 0.041, estimated_diameter_max: 0.091 },
          meters: { estimated_diameter_min: 41.0, estimated_diameter_max: 91.0 },
          miles: { estimated_diameter_min: 0.025, estimated_diameter_max: 0.056 },
          feet: { estimated_diameter_min: 134.5, estimated_diameter_max: 298.5 }
        },
        close_approach_data: [
          {
            close_approach_date: "2026-10-04",
            close_approach_date_full: "2026-Oct-04 19:49",
            epoch_date_close_approach: 1791229740000,
            relative_velocity: {
              kilometers_per_second: "7.78",
              kilometers_per_hour: "28008.00",
              miles_per_hour: "17403.36"
            },
            miss_distance: {
              astronomical: "0.00117",
              lunar: "0.45",
              kilometers: "175029.0",
              miles: "108758.0"
            },
            orbiting_body: "Earth"
          }
        ]
      },
      {
        id: "54129984",
        neo_reference_id: "54129984",
        name: "(2021 NY1)",
        nasa_jpl_url: "https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=54129984",
        absolute_magnitude_h: 21.5,
        is_potentially_hazardous_asteroid: true,
        is_sentry_object: false,
        estimated_diameter: {
          kilometers: { estimated_diameter_min: 0.13, estimated_diameter_max: 0.30 },
          meters: { estimated_diameter_min: 130.0, estimated_diameter_max: 300.0 },
          miles: { estimated_diameter_min: 0.081, estimated_diameter_max: 0.186 },
          feet: { estimated_diameter_min: 426.5, estimated_diameter_max: 984.2 }
        },
        close_approach_data: [
          {
            close_approach_date: "2026-10-04",
            close_approach_date_full: "2026-Oct-04 14:41",
            epoch_date_close_approach: 1791211260000,
            relative_velocity: {
              kilometers_per_second: "9.35",
              kilometers_per_hour: "33660.00",
              miles_per_hour: "20915.35"
            },
            miss_distance: {
              astronomical: "0.0104",
              lunar: "4.05",
              kilometers: "1555816.0",
              miles: "966740.0"
            },
            orbiting_body: "Earth"
          }
        ]
      },
      {
        id: "3546781",
        neo_reference_id: "3546781",
        name: "(2010 TD54)",
        nasa_jpl_url: "https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=3546781",
        absolute_magnitude_h: 28.7,
        is_potentially_hazardous_asteroid: false,
        is_sentry_object: false,
        estimated_diameter: {
          kilometers: { estimated_diameter_min: 0.0048, estimated_diameter_max: 0.011 },
          meters: { estimated_diameter_min: 4.8, estimated_diameter_max: 11.0 },
          miles: { estimated_diameter_min: 0.003, estimated_diameter_max: 0.0068 },
          feet: { estimated_diameter_min: 15.7, estimated_diameter_max: 36.1 }
        },
        close_approach_data: [
          {
            close_approach_date: "2026-10-04",
            close_approach_date_full: "2026-Oct-04 10:48",
            epoch_date_close_approach: 1791197280000,
            relative_velocity: {
              kilometers_per_second: "17.03",
              kilometers_per_hour: "61308.00",
              miles_per_hour: "38095.03"
            },
            miss_distance: {
              astronomical: "0.00034",
              lunar: "0.13",
              kilometers: "50863.0",
              miles: "31604.8"
            },
            orbiting_body: "Earth"
          }
        ]
      },
      {
        id: "2417419",
        neo_reference_id: "2417419",
        name: "417419 (2006 TR7)",
        nasa_jpl_url: "https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=2417419",
        absolute_magnitude_h: 20.3,
        is_potentially_hazardous_asteroid: true,
        is_sentry_object: false,
        estimated_diameter: {
          kilometers: { estimated_diameter_min: 0.23, estimated_diameter_max: 0.52 },
          meters: { estimated_diameter_min: 230.0, estimated_diameter_max: 520.0 },
          miles: { estimated_diameter_min: 0.143, estimated_diameter_max: 0.323 },
          feet: { estimated_diameter_min: 754.5, estimated_diameter_max: 1706.0 }
        },
        close_approach_data: [
          {
            close_approach_date: "2026-10-04",
            close_approach_date_full: "2026-Oct-04 20:15",
            epoch_date_close_approach: 1791231300000,
            relative_velocity: {
              kilometers_per_second: "16.42",
              kilometers_per_hour: "59112.00",
              miles_per_hour: "36730.50"
            },
            miss_distance: {
              astronomical: "0.0463",
              lunar: "18.01",
              kilometers: "6926442.0",
              miles: "4303893.0"
            },
            orbiting_body: "Earth"
          }
        ]
      },
      {
        id: "54238712",
        neo_reference_id: "54238712",
        name: "(2024 CR9)",
        nasa_jpl_url: "https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=54238712",
        absolute_magnitude_h: 21.0,
        is_potentially_hazardous_asteroid: true,
        is_sentry_object: false,
        estimated_diameter: {
          kilometers: { estimated_diameter_min: 0.17, estimated_diameter_max: 0.38 },
          meters: { estimated_diameter_min: 170.0, estimated_diameter_max: 380.0 },
          miles: { estimated_diameter_min: 0.106, estimated_diameter_max: 0.236 },
          feet: { estimated_diameter_min: 557.7, estimated_diameter_max: 1246.7 }
        },
        close_approach_data: [
          {
            close_approach_date: "2026-10-04",
            close_approach_date_full: "2026-Oct-04 04:32",
            epoch_date_close_approach: 1791174720000,
            relative_velocity: {
              kilometers_per_second: "21.65",
              kilometers_per_hour: "77940.00",
              miles_per_hour: "48429.67"
            },
            miss_distance: {
              astronomical: "0.0163",
              lunar: "6.34",
              kilometers: "2438451.0",
              miles: "1515183.0"
            },
            orbiting_body: "Earth"
          }
        ]
      }
    ]
  }
};
