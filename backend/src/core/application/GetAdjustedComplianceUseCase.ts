import type { ComplianceRepository } from "../ports/ComplianceRepository";
import type { BankingRepository } from "../ports/BankingRepository";

export class GetAdjustedComplianceUseCase {
  constructor(
    private complianceRepo: ComplianceRepository,
    private bankingRepo: BankingRepository
  ) {}

  async execute(year: number) {
    const cbRows = await this.complianceRepo.getComplianceForYear(year);
    const bankRows = await this.bankingRepo.getBankEntriesForYear(year);

    return cbRows.map((row) => {
      const applied = bankRows
        .filter((b) => b.shipId === row.shipId)
        .reduce((sum, b) => sum + b.amountGco2eq, 0);

      return {
        shipId: row.shipId,
        adjustedCb: row.cbGco2eq + applied
      };
    });
  }
}
