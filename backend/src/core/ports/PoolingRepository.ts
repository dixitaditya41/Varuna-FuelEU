import { Pool, PoolMember } from "../domain/Pool";

export interface PoolingRepository {

  createPool(year: number): Promise<number>;

  addPoolMembers(poolId: number, members: PoolMember[]): Promise<void>;

  existsForYear(year: number): Promise<boolean>;



}