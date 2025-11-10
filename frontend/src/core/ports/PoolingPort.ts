import type { PoolResponse } from "../domain/Pool";

export interface PoolingPort {
  createPool(year: number, shipIds: string[]): Promise<PoolResponse>;
}
