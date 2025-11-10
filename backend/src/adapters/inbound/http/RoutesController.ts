import { Request, Response } from "express";
import { GetRoutesUseCase } from "../../../core/application/GetRoutesUseCase";
import { SetBaselineUseCase } from "../../../core/application/SetBaselineUseCase";
import { GetComparisonUseCase } from "../../../core/application/GetComparisonUseCase";

export class RoutesController {
  constructor(
    private getRoutes: GetRoutesUseCase,
    private setBaseline: SetBaselineUseCase,
    private getComparison: GetComparisonUseCase
  ) {}

  getAllRoutes = async (req: Request, res: Response) => {
    try {
      const routes = await this.getRoutes.execute();
      res.json(routes);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };

  setBaselineRoute = async (req: Request, res: Response) => {
    try {
      const routeId = req.params.id;
      await this.setBaseline.execute(routeId);
      res.json({ message: `Baseline set to route ${routeId}` });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };

  getComparisonRoutes = async (req: Request, res: Response) => {
    try {
      const result = await this.getComparison.execute();
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };
}
