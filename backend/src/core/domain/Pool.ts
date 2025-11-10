export interface Pool {
    id?: number;
    year: number;
    createdAt?: Date;
    members: PoolMember[];
  }
  
  export interface PoolMember {
    shipId: string;
    cbBefore: number;  // original CB
    cbAfter: number;   // adjusted CB after pooling
  }
  