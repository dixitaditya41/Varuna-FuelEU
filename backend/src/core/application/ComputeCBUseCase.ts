import { ComplianceRepository } from "../ports/ComplianceRepository";
import { RouteRepository } from "../ports/RouteRepository";
import { computeCB } from "../domain/ComplianceCalculation";

export class ComputeCBUseCase {
  constructor(
    private routeRepo: RouteRepository,
    private complianceRepo: ComplianceRepository
  ) {}

  async execute(shipId: string, year: number) {
    // 1. Fetch the route for this ship/year
    const route = await this.routeRepo.findByRouteId(shipId);

    if (!route || route.year !== year) {
      throw new Error(`No route data found for shipId=${shipId} and year=${year}`);
    }

    // 2. Compute compliance balance using domain logic
    const cbValue = computeCB(route.ghgIntensity, route.fuelTons);

    // 3. Save snapshot into DB
    await this.complianceRepo.saveComplianceRecord({
      shipId,
      year,
      cbGco2eq: cbValue
    });

    // 4. Return computed result
    return {
      shipId,
      year,
      cb: cbValue
    };
  }
}
