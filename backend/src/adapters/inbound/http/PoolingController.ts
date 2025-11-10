import { Request, Response } from "express";
import { CreatePoolUseCase } from "../../../core/application/CreatePoolUseCase";

export class PoolingController {
  constructor(private createPoolUseCase: CreatePoolUseCase) {}

  createPool = async (req: Request, res: Response) => {
    try {
      const { year, shipIds } = req.body;

      if (!year || !shipIds) {
        return res.status(400).json({
          error: "Missing required fields: year, shipIds"
        });
      }

      if (!Array.isArray(shipIds) || shipIds.length === 0) {
        return res.status(400).json({
          error: "shipIds must be a non-empty array"
        });
      }

      const result = await this.createPoolUseCase.execute({
        year: Number(year),
        shipIds: shipIds.map(String)
      });

      return res.json(result);

    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  };
}
