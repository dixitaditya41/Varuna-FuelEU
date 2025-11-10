import type { BankingPort } from "../../core/ports/BankingPort";
import type { BankEntry } from "../../core/domain/BankEntry";
import { API_BASE_URL } from "../../shared/config";

export class HttpBankingAdapter implements BankingPort {
  async bankSurplus(shipId: string, year: number): Promise<{ banked: number }> {
    const res = await fetch(`${API_BASE_URL}/banking/bank`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shipId, year }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to bank surplus (${res.status})`);
    }
    return res.json();
  }

  async applyBank(
    shipId: string,
    year: number,
    amount: number
  ): Promise<{ applied: number; remaining: number }> {
    const res = await fetch(`${API_BASE_URL}/banking/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shipId, year, amount }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to apply banked amount (${res.status})`);
    }
    return res.json();
  }

  async getRecords(shipId: string, year: number): Promise<BankEntry[]> {
    const res = await fetch(
      `${API_BASE_URL}/banking/records?shipId=${shipId}&year=${year}`
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to fetch bank records (${res.status})`);
    }
    return res.json();
  }
}
