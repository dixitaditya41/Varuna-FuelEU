import { ComplianceBalance } from "../domain/ComplianceBalance";

export interface ComplianceRepository {
  
  // Save or update a compliance record
  saveComplianceRecord(record: ComplianceBalance): Promise<void>;
  
  // Retrieve a compliance record by ship ID and year
  getComplianceRecord(shipId: string, year: number): Promise<ComplianceBalance | null>;
   
  // Retrieve compliance records for multiple ships for a given year
  getComplianceForShips(shipIds: string[], year: number): Promise<ComplianceBalance[]>;

  // Get compliance for a year
  getComplianceForYear(year: number): Promise<{ shipId: string, cbGco2eq: number, year: number }[]>;


}
