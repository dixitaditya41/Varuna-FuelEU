import type { RoutePort } from "../../core/ports/RoutePort";
import type { Route } from "../../core/domain/Route";
import type { ComparisonResult } from "../../core/domain/Comparison";
import { API_BASE_URL } from "../../shared/config";

export class HttpRouteAdapter implements RoutePort {
  async getRoutes(): Promise<Route[]> {
    const res = await fetch(`${API_BASE_URL}/routes`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to fetch routes (${res.status})`);
    }
    return res.json();
  }

  async setBaseline(routeId: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/routes/${routeId}/baseline`, {
      method: "POST",
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to set baseline (${res.status})`);
    }
  }

  async getComparison(): Promise<ComparisonResult[]> {
    const res = await fetch(`${API_BASE_URL}/routes/comparison`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to fetch comparison (${res.status})`);
    }
    return res.json();
  }
}
