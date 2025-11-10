import type { BankEntry } from "../domain/BankEntry";

export interface BankingPort {
  bankSurplus(shipId: string, year: number): Promise<{ banked: number }>;
  applyBank(shipId: string, year: number, amount: number): Promise<{ applied: number, remaining: number }>;
  getRecords(shipId: string, year: number): Promise<BankEntry[]>;
}
