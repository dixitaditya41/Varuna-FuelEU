import { BankingRepository } from "../ports/BankingRepository";
import { ComplianceRepository } from "../ports/ComplianceRepository";

export class ApplyBankedUseCase {
  constructor(
    private bankingRepo: BankingRepository,
    private complianceRepo: ComplianceRepository
  ) {}

  async execute(shipId: string, year: number, amount: number) {
    const available = await this.bankingRepo.getBankedAmount(shipId, year);

    if (amount > available) {
      throw new Error("Cannot apply more than available banked amount.");
    }

    // Deduct from bank
    await this.bankingRepo.applyBankedAmount(shipId, year, amount);

    // Return outcome
    return {
      applied: amount,
      remaining: available - amount,
    };
  }
}
