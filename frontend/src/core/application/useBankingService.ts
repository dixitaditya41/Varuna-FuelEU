import { useState } from "react";
import { HttpBankingAdapter } from "../../adapters/infrastructure/HttpBankingAdapter";
import type { BankEntry } from "../domain/BankEntry";

export function useBankingService() {
  const api = new HttpBankingAdapter();

  const [records, setRecords] = useState<BankEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  async function loadRecords(shipId: string, year: number) {
    setLoading(true);
    setError(null);

    try {
      const data = await api.getRecords(shipId, year);
      setRecords(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Failed to load records");
      }
    }

    setLoading(false);
  }

  async function bankSurplus(shipId: string, year: number) {
    setError(null);
    try {
      return await api.bankSurplus(shipId, year);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
      return null;
    }
  }

  async function applyBank(shipId: string, year: number, amount: number) {
    setError(null);
    try {
      return await api.applyBank(shipId, year, amount);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
      return null;
    }
  }
return {
  loading,
  records,
  error,
  loadRecords,
  bankSurplus,
  applyBank
};

}
