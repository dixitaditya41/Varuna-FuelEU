import { RouteRepository } from "../ports/RouteRepository";

export class GetComparisonUseCase {
  constructor(private routeRepo: RouteRepository) {}

  async execute() {
    const baseline = await this.routeRepo.getBaseline();

    if (!baseline) {
      throw new Error("No baseline route set");
    }

    const allRoutes = await this.routeRepo.findAll();

    // Filter out baseline from comparison list
    const comparisonRoutes = allRoutes.filter(
      r => r.routeId !== baseline.routeId
    );

    // Build comparison result
    return comparisonRoutes.map(r => {
      const percentDiff =
        ((r.ghgIntensity / baseline.ghgIntensity) - 1) * 100;

      const target = 89.3368; // EU 2025 target (2% lower than 91.16)
      const compliant = r.ghgIntensity <= target;

      return {
        routeId: r.routeId,
        baselineIntensity: baseline.ghgIntensity,
        comparisonIntensity: r.ghgIntensity,
        percentDiff,
        compliant
      };
    });
  }
}
