import { Router } from "express";
import { BankingController } from "../../adapters/inbound/http/BankingController";

export function createBankingRouter(controller: BankingController) {
  const router = Router();

  router.post("/banking/bank", controller.bank);
  router.post("/banking/apply", controller.apply);
  router.get("/banking/records", controller.getRecords);

  return router;
}
