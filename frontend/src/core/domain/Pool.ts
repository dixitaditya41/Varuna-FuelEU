export interface PoolMember {
    shipId: string;
    cbBefore: number;
    cbAfter: number;
  }
  
  export interface PoolResponse {
    poolId: number;
    year: number;
    members: PoolMember[];
    totalCB: number;
  }
  