import { BankingRepository } from "../../../core/ports/BankingRepository";
import { BankEntry } from "../../../core/domain/BankEntry";
import { Pool } from "pg";

export class BankingRepositoryPostgres implements BankingRepository {
  constructor(private db: Pool) {}

  async addBankEntry(entry: BankEntry): Promise<void> {
    await this.db.query(
      `
      INSERT INTO bank_entries (ship_id, year, amount_gco2eq)
      VALUES ($1, $2, $3);
      `,
      [entry.shipId, entry.year, entry.amountGco2eq]
    );
  }

  async getBankedAmount(shipId: string, year: number): Promise<number> {
    const res = await this.db.query(
      `
      SELECT COALESCE(SUM(amount_gco2eq), 0) AS total
      FROM bank_entries
      WHERE ship_id = $1 AND year = $2;
      `,
      [shipId, year]
    );

    return Number(res.rows[0].total);
  }

  async getBankEntriesForYear(year: number) {
    const res = await this.db.query(
      `SELECT ship_id AS "shipId", amount_gco2eq AS "amountGco2eq", year 
       FROM bank_entries 
       WHERE year = $1`,
      [year]
    );
    return res.rows;
  }

  async getBankEntries(shipId: string, year: number): Promise<BankEntry[]> {
    const res = await this.db.query(
      `
      SELECT id, ship_id, year, amount_gco2eq
      FROM bank_entries
      WHERE ship_id = $1 AND year = $2;
      `,
      [shipId, year]
    );

    return res.rows.map((r) => ({
      id: r.id,
      shipId: r.ship_id,
      year: r.year,
      amountGco2eq: Number(r.amount_gco2eq),
    }));
  }

  async applyBankedAmount(shipId: string, year: number, amount: number): Promise<void> {
    await this.db.query(
      `
      INSERT INTO bank_entries (ship_id, year, amount_gco2eq)
      VALUES ($1, $2, $3);
      `,
      [shipId, year, -Math.abs(amount)]
    );
  }
}
