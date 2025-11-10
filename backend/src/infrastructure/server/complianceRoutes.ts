import { Router } from "express";
import { ComplianceController } from "../../adapters/inbound/http/ComplianceController";

export function createComplianceRouter(controller: ComplianceController) {
  const router = Router();

  router.get("/compliance/cb", controller.getComplianceBalance);
  router.get("/compliance/cb/stored", controller.getStoredComplianceRecord);
  router.get("/compliance/adjusted-cb", controller.getAdjustedCompliance);


  return router;
}
