import type { PoolingPort } from "../../core/ports/PoolingPort";
import type { PoolResponse } from "../../core/domain/Pool";
import { API_BASE_URL } from "../../shared/config";

export class HttpPoolingAdapter implements PoolingPort {
  async createPool(year: number, shipIds: string[]): Promise<PoolResponse> {
    const res = await fetch(`${API_BASE_URL}/pools`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ year, shipIds }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to create pool");
    }

    return await res.json();
  }
}
