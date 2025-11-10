import { describe, it, expect, vi } from "vitest";
import { HttpRouteAdapter } from "../adapters/infrastructure/HttpRouteAdapter";
import { act } from "react";
import { renderHook } from "@testing-library/react";
import { useRoutesService } from "../core/application/useRoutesService";

vi.mock("../adapters/infrastructure/HttpRouteAdapter");

describe("useRoutesService", () => {
  it("loads routes", async () => {
    const mockRoutes = [{ routeId: "R001", vesselType: "Container", fuelType: "HFO", year: 2024, ghgIntensity: 91, fuelTons: 5000, distanceKm: 12000, totalEmissionsT: 4500, isBaseline: false }];
    (HttpRouteAdapter as any).mockImplementation(() => ({
      getRoutes: vi.fn().mockResolvedValue(mockRoutes),
      setBaseline: vi.fn(),
    }));

    const { result } = renderHook(() => useRoutesService());
    await act(async () => {
      await result.current.loadRoutes();
    });
    expect(result.current.routes).toEqual(mockRoutes);
  });
});


