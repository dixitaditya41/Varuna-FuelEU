import { BankEntry } from "../domain/BankEntry";

export interface BankingRepository {
  
  //Save a new banked entry.
  addBankEntry(entry: BankEntry): Promise<void>;

  // Get the total banked amount available for a ship in a given year.
  getBankedAmount(shipId: string, year: number): Promise<number>;

  // Get all bank entries for a ship in a given year.
  getBankEntries(shipId: string, year: number): Promise<BankEntry[]>;

  // Apply a banked amount for a ship in a given year (deduct from banked amount).
  applyBankedAmount(
    shipId: string,
    year: number,
    amount: number
  ): Promise<void>;
  
  // get  bank entries for a year
  getBankEntriesForYear(year: number): Promise<{ shipId: string, amountGco2eq: number, year: number }[]>;

}
