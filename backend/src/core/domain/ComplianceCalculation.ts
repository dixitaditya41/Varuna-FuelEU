import { ENERGY_PER_TON_MJ, TARGET_2025_INTENSITY } from "../../shared/constants";

export function computeCB(
  actualIntensity: number,
  fuelTons: number,
  target: number = TARGET_2025_INTENSITY ): number {
  const energyInScope = fuelTons * ENERGY_PER_TON_MJ;
  
  const cb = (target - actualIntensity) * energyInScope;

  return cb; // positive = surplus, negative = deficit
}
