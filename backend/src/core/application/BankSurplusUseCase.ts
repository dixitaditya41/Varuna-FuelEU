import { BankingRepository } from "../ports/BankingRepository";
import { ComplianceRepository } from "../ports/ComplianceRepository";

export class BankSurplusUseCase {
  constructor(
    private bankingRepo: BankingRepository,
    private complianceRepo: ComplianceRepository
  ) {}

  async execute(shipId: string, year: number): Promise<{ banked: number }> {
    const record = await this.complianceRepo.getComplianceRecord(shipId, year);

    if (!record) {
      throw new Error("Compliance balance not computed yet for this ship/year.");
    }

    if (record.cbGco2eq <= 0) {
      throw new Error("Cannot bank non-positive CB.");
    }

    await this.bankingRepo.addBankEntry({
      shipId,
      year,
      amountGco2eq: record.cbGco2eq,
    });

    return { banked: record.cbGco2eq };
  }
}
