import { Request, Response } from "express";
import { BankSurplusUseCase } from "../../../core/application/BankSurplusUseCase";
import { ApplyBankedUseCase } from "../../../core/application/ApplyBankedUseCase";
import { BankingRepository } from "../../../core/ports/BankingRepository";

export class BankingController {
  constructor(
    private bankSurplus: BankSurplusUseCase,
    private applyBanked: ApplyBankedUseCase,
    private bankingRepo: BankingRepository
  ) {}

  bank = async (req: Request, res: Response) => {
    try {
      const { shipId, year } = req.body;

      const result = await this.bankSurplus.execute(shipId, Number(year));
      res.json(result);

    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };

  apply = async (req: Request, res: Response) => {
    try {
      const { shipId, year, amount } = req.body;

      const result = await this.applyBanked.execute(
        shipId,
        Number(year),
        Number(amount)
      );

      res.json(result);

    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };

  getRecords = async (req: Request, res: Response) => {
    try {
      const { shipId, year } = req.query;

      const records = await this.bankingRepo.getBankEntries(
        String(shipId),
        Number(year)
      );

      res.json(records);

    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };
}
