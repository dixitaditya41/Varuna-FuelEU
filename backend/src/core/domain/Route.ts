
export interface Route {
    id?: number;                // database internal id
    routeId: string;            // R001, R002, etc.
    
    vesselType: string;         // Container, BulkCarrier, etc.
    fuelType: string;           // HFO, LNG, MGO
    
    year: number;               // Reporting year
    
    ghgIntensity: number;       // gCO2e/MJ
    fuelTons: number;           // fuelConsumption(t)
    distanceKm: number;         // distance in km
    totalEmissionsT: number;    // totalEmissions(t)
    
    isBaseline: boolean;        // Only one route is baseline at a time
  }
  