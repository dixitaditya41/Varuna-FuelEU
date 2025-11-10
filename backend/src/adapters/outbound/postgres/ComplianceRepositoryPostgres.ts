import { ComplianceRepository } from "../../../core/ports/ComplianceRepository";
import { ComplianceBalance } from "../../../core/domain/ComplianceBalance";
import { Pool } from "pg";

export class ComplianceRepositoryPostgres implements ComplianceRepository {
  constructor(private db: Pool) {}

  
  // Save CB Snapshot
  async saveComplianceRecord(record: ComplianceBalance): Promise<void> {
    await this.db.query(
      `
      INSERT INTO ship_compliance (ship_id, year, cb_gco2eq)
      VALUES ($1, $2, $3)
      ON CONFLICT (ship_id, year)
      DO UPDATE SET cb_gco2eq = EXCLUDED.cb_gco2eq;
      `,
      [record.shipId, record.year, record.cbGco2eq]
    );
  }
  
  // Get Compliance for a year
  async getComplianceForYear(year: number) {
    const res = await this.db.query(
      `SELECT ship_id AS "shipId", cb_gco2eq AS "cbGco2eq", year 
       FROM ship_compliance 
       WHERE year = $1`,
      [year]
    );
    return res.rows;
  }

  // Get CB for a single ship in a year
  async getComplianceRecord(
    shipId: string,
    year: number
  ): Promise<ComplianceBalance | null> {
    const res = await this.db.query(
      `
      SELECT ship_id, year, cb_gco2eq 
      FROM ship_compliance 
      WHERE ship_id = $1 AND year = $2 
      LIMIT 1;
      `,
      [shipId, year]
    );

    if (res.rows.length === 0) return null;

    const r = res.rows[0];

    return {
      shipId: r.ship_id,
      year: r.year,
      cbGco2eq: Number(r.cb_gco2eq),
    };
  }

  // Get CB for multiple ships in a year (pooling)
  async getComplianceForShips(
    shipIds: string[],
    year: number
  ): Promise<ComplianceBalance[]> {
    const res = await this.db.query(
      `
      SELECT ship_id, year, cb_gco2eq
      FROM ship_compliance
      WHERE year = $1 AND ship_id = ANY($2);
      `,
      [year, shipIds]
    );

    return res.rows.map((r: any) => ({
      shipId: r.ship_id,
      year: r.year,
      cbGco2eq: Number(r.cb_gco2eq),
    }));
  }
}
