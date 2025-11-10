import { computeCB } from "../src/core/domain/ComplianceCalculation";

describe("computeCB", () => {
  it("calculates positive CB when actual < target", () => {
    const cb = computeCB(88, 1); // 1 ton
    expect(cb).toBeGreaterThan(0);
  });
  it("calculates negative CB when actual > target", () => {
    const cb = computeCB(95, 1);
    expect(cb).toBeLessThan(0);
  });
});


