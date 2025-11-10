import { Router } from "express";
import { RoutesController } from "../../adapters/inbound/http/RoutesController";

export function createRoutesRouter(routesController: RoutesController) {
  const router = Router();

  router.get("/routes", routesController.getAllRoutes);
  router.post("/routes/:id/baseline", routesController.setBaselineRoute);
  router.get("/routes/comparison", routesController.getComparisonRoutes);

  return router;
}
