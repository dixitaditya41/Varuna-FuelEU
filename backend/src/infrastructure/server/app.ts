import express from "express";
import cors from "cors";
import { db } from "../db/client";

import { RouteRepositoryPostgres } from "../../adapters/outbound/postgres/RouteRepositoryPostgres";
import { ComplianceRepositoryPostgres } from "../../adapters/outbound/postgres/ComplianceRepositoryPostgres";
import { BankingRepositoryPostgres } from "../../adapters/outbound/postgres/BankingRepositoryPostgres";
import { PoolingRepositoryPostgres } from "../../adapters/outbound/postgres/PoolingRepositoryPostgres";



import { GetRoutesUseCase } from "../../core/application/GetRoutesUseCase";
import { SetBaselineUseCase } from "../../core/application/SetBaselineUseCase";
import { GetComparisonUseCase } from "../../core/application/GetComparisonUseCase";
import { ComputeCBUseCase } from "../../core/application/ComputeCBUseCase";
import { BankSurplusUseCase } from "../../core/application/BankSurplusUseCase";
import { ApplyBankedUseCase } from "../../core/application/ApplyBankedUseCase";
import { CreatePoolUseCase } from "../../core/application/CreatePoolUseCase";
import { GetAdjustedComplianceUseCase } from "../../core/application/GetAdjustedComplianceUseCase";


import { RoutesController } from "../../adapters/inbound/http/RoutesController";
import { ComplianceController } from "../../adapters/inbound/http/ComplianceController";
import { BankingController } from "../../adapters/inbound/http/BankingController";
import { PoolingController } from "../../adapters/inbound/http/PoolingController";


import { createRoutesRouter } from "./routes";
import { createComplianceRouter } from "./complianceRoutes";
import { createBankingRouter } from "./bankingRoutes";
import { createPoolingRouter } from "./poolingRoutes";


export function createApp() {
  const app = express();

  app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: false
  }));

  
  app.use(express.json());
 
  // Repositories
  const routeRepo = new RouteRepositoryPostgres(db);
  const complianceRepo = new ComplianceRepositoryPostgres(db);
  const bankingRepo = new BankingRepositoryPostgres(db);
  const poolingRepo = new PoolingRepositoryPostgres(db);

  // Use Cases
  const getRoutesUC = new GetRoutesUseCase(routeRepo);
  const setBaselineUC = new SetBaselineUseCase(routeRepo);
  const getComparisonUC = new GetComparisonUseCase(routeRepo);
  const createPoolUC = new CreatePoolUseCase(complianceRepo, poolingRepo);

  const computeCBUC = new ComputeCBUseCase(routeRepo, complianceRepo);

  const bankSurplusUC = new BankSurplusUseCase(bankingRepo, complianceRepo);
  const applyBankedUC = new ApplyBankedUseCase(bankingRepo, complianceRepo);

  const getAdjustedComplianceUC = new GetAdjustedComplianceUseCase(complianceRepo, bankingRepo);

  // Controllers
  const routesController = new RoutesController(
    getRoutesUC,
    setBaselineUC,
    getComparisonUC
  );

  

  const complianceController = new ComplianceController(
    computeCBUC,
    complianceRepo,
    getAdjustedComplianceUC
  );

  const bankingController = new BankingController(
    bankSurplusUC,
    applyBankedUC,
    bankingRepo
  );
   
  const poolingController = new PoolingController(createPoolUC);

  // Routes
  app.use(createRoutesRouter(routesController));
  app.use(createComplianceRouter(complianceController));
  app.use(createBankingRouter(bankingController));
  app.use(createPoolingRouter(poolingController));

  return app;
}
