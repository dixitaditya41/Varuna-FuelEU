import { Router } from "express";
import { PoolingController } from "../../adapters/inbound/http/PoolingController";

export function createPoolingRouter(controller: PoolingController) {
  const router = Router();

  router.post("/pools", controller.createPool);

  return router;
}
