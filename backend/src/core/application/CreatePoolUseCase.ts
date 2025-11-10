import { ComplianceRepository } from "../ports/ComplianceRepository";
import { PoolingRepository } from "../ports/PoolingRepository";
import { PoolMember } from "../domain/Pool";

interface CreatePoolInput {
  year: number;
  shipIds: string[];
}

export class CreatePoolUseCase {
  constructor(
    private complianceRepo: ComplianceRepository,
    private poolingRepo: PoolingRepository
  ) {}  

  async execute(input: CreatePoolInput) {
    const { year, shipIds } = input;


    // Load CB records
    const cbList = await this.complianceRepo.getComplianceForShips(shipIds, year);

    if (cbList.length !== shipIds.length) {
      throw new Error("All ships must have CB calculated before pooling.");
    }

    // Split into surplus and deficit ships
    const surplus = cbList.filter(r => r.cbGco2eq > 0);
    const deficit = cbList.filter(r => r.cbGco2eq < 0);

    // If no deficits, pooling unnecessary
    if (deficit.length === 0) {
      throw new Error("Pooling requires at least one ship with deficit CB.");
    }

    // Sort deficit ships ascending (most negative first)
    deficit.sort((a, b) => a.cbGco2eq - b.cbGco2eq);

    // Sort surplus ships descending (largest surplus first)
    surplus.sort((a, b) => b.cbGco2eq - a.cbGco2eq);

    // Prepare map for cbAfter
    const cbAfterMap: Record<string, number> = {};
    cbList.forEach(r => (cbAfterMap[r.shipId] = r.cbGco2eq));
 
    let sIdx = 0; // surplus index
    let dIdx = 0; // deficit index

    while (sIdx < surplus.length && dIdx < deficit.length) {
      let surplusShip = surplus[sIdx];
      let deficitShip = deficit[dIdx];

      const available = cbAfterMap[surplusShip.shipId];
      const need = Math.abs(cbAfterMap[deficitShip.shipId]);

      const transfer = Math.min(available, need);

      // Apply transfer
      cbAfterMap[surplusShip.shipId] -= transfer;
      cbAfterMap[deficitShip.shipId] += transfer;

      // Move to next ship if depleted or resolved
      if (cbAfterMap[surplusShip.shipId] <= 0.00001) sIdx++;
      if (cbAfterMap[deficitShip.shipId] >= -0.00001) dIdx++;
    }

    
    // Validation rules

    // Pool sum must be >= 0
    const finalSum = Object.values(cbAfterMap).reduce((a, b) => a + b, 0);
    if (finalSum < -0.00001) {
      throw new Error("Invalid pool: total CB after pooling must be >= 0.");
    }

    //  Deficit ships cannot exit worse
    for (const d of deficit) {
      if (cbAfterMap[d.shipId] < d.cbGco2eq) {
        throw new Error("A deficit ship would exit worse after pooling.");
      }
    }

    //  Surplus ships cannot exit negative
    for (const s of surplus) {
      if (cbAfterMap[s.shipId] < -0.00001) {
        throw new Error("A surplus ship cannot be brought below zero CB.");
      }
    }

   
    // Persist the pool
    const poolId = await this.poolingRepo.createPool(year);

    const members: PoolMember[] = cbList.map(r => ({
      shipId: r.shipId,
      cbBefore: r.cbGco2eq,
      cbAfter: cbAfterMap[r.shipId],
    }));

    await this.poolingRepo.addPoolMembers(poolId, members);

  
    // Return response DTO
    return {
      poolId,
      year,
      members,
      totalCB: finalSum
    };
  }
}
