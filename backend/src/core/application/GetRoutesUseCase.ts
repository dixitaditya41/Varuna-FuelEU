import { RouteRepository } from "../ports/RouteRepository";

export class GetRoutesUseCase {
  constructor(private routeRepo: RouteRepository) {}

  async execute() {
    return this.routeRepo.findAll();
  }
}
