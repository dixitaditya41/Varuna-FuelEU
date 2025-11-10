import { BankSurplusUseCase } from "../src/core/application/BankSurplusUseCase";
import { ApplyBankedUseCase } from "../src/core/application/ApplyBankedUseCase";

describe("Banking use-cases", () => {
  it("banks only positive CB", async () => {
    const complianceRepo: any = {
      getComplianceRecord: async () => ({ cbGco2eq: 100, shipId: "R001", year: 2025 }),
    };
    const bankingRepo: any = {
      addBankEntry: async () => {},
    };
    const bankUC = new BankSurplusUseCase(bankingRepo, complianceRepo);
    const res = await bankUC.execute("R001", 2025);
    expect(res.banked).toBe(100);
  });

  it("apply cannot exceed available", async () => {
    const bankingRepo: any = {
      getBankedAmount: async () => 50,
      applyBankedAmount: async () => {},
    };
    const complianceRepo: any = {};
    const applyUC = new ApplyBankedUseCase(bankingRepo, complianceRepo);
    await expect(applyUC.execute("R001", 2025, 60)).rejects.toThrow();
    const res = await applyUC.execute("R001", 2025, 20);
    expect(res.applied).toBe(20);
    expect(res.remaining).toBe(30);
  });
});


