import type { ComplianceBalance } from "../domain/ComplianceBalance";

export interface CompliancePort {
  getComplianceBalance(shipId: string, year: number): Promise<ComplianceBalance>;
}
