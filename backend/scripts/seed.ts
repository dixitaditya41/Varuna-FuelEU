import { db } from "../src/infrastructure/db/client";

async function seed() {
  const routes = [
    // shipId, vesselType, fuelType, year, ghgIntensity, fuelConsumption, distance, totalEmissions, isBaseline
  
    // Slight improvement to increase surplus
    ['R006', 'Container', 'HFO', 2024, 89.0, 5000, 12000, 4500, true],
  
    // Already strong surplus (keep)
    ['R007', 'BulkCarrier', 'LNG', 2024, 87.0, 4800, 11500, 4200, false],
  
    // Reduce intensity so deficit becomes reasonable
    ['R008', 'Tanker', 'MGO', 2024, 90.0, 5100, 12500, 4700, false],
  
    // 2025 routes unchanged
    ['R009', 'RoRo', 'HFO', 2025, 89.2, 4900, 11800, 4300, false],
    ['R0010', 'Container', 'LNG', 2025, 90.5, 4950, 11900, 4400, false]
  ];

  for (const r of routes) {
    await db.query(
      `INSERT INTO routes(route_id, vessel_type, fuel_type, year, ghg_intensity, fuel_tons, distance_km, total_emissions_t, is_baseline)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       ON CONFLICT (route_id) DO NOTHING`,
      r
    );
  }

  console.log("Routes seeded successfully");
  process.exit(0);
}

seed();
