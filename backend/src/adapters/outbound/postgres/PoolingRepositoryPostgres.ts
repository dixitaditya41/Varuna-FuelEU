import { Pool as PgPool } from "pg";
import { PoolingRepository } from "../../../core/ports/PoolingRepository";
import { PoolMember } from "../../../core/domain/Pool";

export class PoolingRepositoryPostgres implements PoolingRepository {
  constructor(private db: PgPool) {}

  
  // Create a pool and return pool_id
  async createPool(year: number): Promise<number> {
    const res = await this.db.query(
      `
      INSERT INTO pools (year)
      VALUES ($1)
      RETURNING id;
      `,
      [year]
    );

    return res.rows[0].id;
  }

  // Insert pool members
  async addPoolMembers(poolId: number, members: PoolMember[]): Promise<void> {
    const query = `
      INSERT INTO pool_members (pool_id, ship_id, cb_before, cb_after)
      VALUES ($1, $2, $3, $4);
    `;

    for (const m of members) {
      await this.db.query(query, [
        poolId,
        m.shipId,
        m.cbBefore,
        m.cbAfter,
      ]);
    }
  }

  async existsForYear(year: number): Promise<boolean> {
    const res = await this.db.query(
      `SELECT 1 FROM pools WHERE year = $1 LIMIT 1`,
      [year]
    );
    return (res.rowCount ?? 0) > 0;
  }
}
