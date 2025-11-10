import { Request, Response } from "express";
import { ComputeCBUseCase } from "../../../core/application/ComputeCBUseCase";
import { ComplianceRepository } from "../../../core/ports/ComplianceRepository";
import { GetAdjustedComplianceUseCase } from "../../../core/application/GetAdjustedComplianceUseCase";

export class ComplianceController {
  constructor(
    private computeCB: ComputeCBUseCase,
    private complianceRepo: ComplianceRepository,
    private adjustedUseCase: GetAdjustedComplianceUseCase
  ) {}
  

  // Compute and fetch CB
  getComplianceBalance = async (req: Request, res: Response) => {
    try {
      const { shipId, year } = req.query;

      if (!shipId || !year) {
        return res.status(400).json({
          error: "Missing required query parameters: shipId, year",
        });
      }

      const yearNum = Number(year);
      if (isNaN(yearNum)) {
        return res.status(400).json({
          error: "year must be a valid number",
        });
      }

      // Execute use-case
      const result = await this.computeCB.execute(String(shipId), yearNum);

      res.json({
        shipId: result.shipId,
        year: result.year,
        cb: result.cb,
      });

    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };

  // fetch stored CB (without recomputing)
  getStoredComplianceRecord = async (req: Request, res: Response) => {
    try {
      const { shipId, year } = req.query;

      if (!shipId || !year) {
        return res.status(400).json({
          error: "Missing required query parameters: shipId, year",
        });
      }

      const record = await this.complianceRepo.getComplianceRecord(
        String(shipId),
        Number(year)
      );

      if (!record) {
        return res.status(404).json({ error: "No CB record found" });
      }

      res.json(record);

    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };

  getAdjustedCompliance = async (req: Request, res: Response) => {
    try {
      const { year } = req.query;
  
      if (!year) {
        return res.status(400).json({ error: "Missing required query parameter: year" });
      }
  
      const yearNum = Number(year);
      const result = await this.adjustedUseCase.execute(yearNum);
  
      return res.json(result);
  
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };
  
  
}
