import { RouteRepository } from "../../../core/ports/RouteRepository";
import { Route } from "../../../core/domain/Route";
import { Pool } from "pg";

export class RouteRepositoryPostgres implements RouteRepository {
  constructor(private db: Pool) {}

  async findAll(): Promise<Route[]> {
    const res = await this.db.query(`
      SELECT 
        id, route_id, vessel_type, fuel_type, year, 
        ghg_intensity, fuel_tons, distance_km, total_emissions_t, is_baseline
      FROM routes
      ORDER BY route_id ASC
    `);

    return res.rows.map(r => this.mapRowToRoute(r));
  }

  async findByRouteId(routeId: string): Promise<Route | null> {
    const res = await this.db.query(
      `SELECT * FROM routes WHERE route_id = $1 LIMIT 1`,
      [routeId]
    );

    if (res.rows.length === 0) return null;

    return this.mapRowToRoute(res.rows[0]);
  }

  async setBaseline(routeId: string): Promise<void> {
    // Only one baseline route is allowed
    await this.db.query("UPDATE routes SET is_baseline = FALSE");
    await this.db.query(
      "UPDATE routes SET is_baseline = TRUE WHERE route_id = $1",
      [routeId]
    );
  }

  async getBaseline(): Promise<Route | null> {
    const res = await this.db.query(
      `SELECT * FROM routes WHERE is_baseline = TRUE LIMIT 1`
    );

    if (res.rows.length === 0) return null;

    return this.mapRowToRoute(res.rows[0]);
  }

  // Mapping DB Row → Domain Entity
  private mapRowToRoute(row: any): Route {
    return {
      id: row.id,
      routeId: row.route_id,
      vesselType: row.vessel_type,
      fuelType: row.fuel_type,
      year: Number(row.year),
      ghgIntensity: Number(row.ghg_intensity),
      fuelTons: Number(row.fuel_tons),
      distanceKm: Number(row.distance_km),
      totalEmissionsT: Number(row.total_emissions_t),
      isBaseline: row.is_baseline
    };
  }
}
