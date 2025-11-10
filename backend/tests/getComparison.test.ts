import { GetComparisonUseCase } from "../src/core/application/GetComparisonUseCase";
import type { RouteRepository } from "../src/core/ports/RouteRepository";

const mockRepo = (baseline: any, all: any[]): RouteRepository => ({
  findAll: async () => all,
  findByRouteId: async () => null,
  setBaseline: async () => {},
  getBaseline: async () => baseline,
});

describe("GetComparisonUseCase", () => {
  it("computes percentDiff and compliant", async () => {
    const baseline = { routeId: "R001", ghgIntensity: 90 } as any;
    const others = [{ routeId: "R002", ghgIntensity: 88 } as any, baseline];
    const uc = new GetComparisonUseCase(mockRepo(baseline, others));
    const res = await uc.execute();
    expect(res).toHaveLength(1);
    expect(res[0].routeId).toBe("R002");
    expect(res[0].percentDiff).toBeCloseTo(((88 / 90) - 1) * 100, 6);
    expect(res[0].compliant).toBe(true);
  });
});


