import { RouteRepository } from "../ports/RouteRepository";

export class SetBaselineUseCase {
  constructor(private routeRepo: RouteRepository) {}

  async execute(routeId: string): Promise<void> {
    const route = await this.routeRepo.findByRouteId(routeId);

    if (!route) {
      throw new Error(`Route with id ${routeId} not found`);
    }

    await this.routeRepo.setBaseline(routeId);
  }
}
