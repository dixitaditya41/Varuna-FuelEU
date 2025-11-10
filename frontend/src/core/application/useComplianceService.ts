import { useState } from "react";
import { HttpComplianceAdapter } from "../../adapters/infrastructure/HttpComplianceAdapter";
import type { ComplianceBalance } from "../domain/ComplianceBalance";

export function useComplianceService() {
  const api = new HttpComplianceAdapter();

  const [cb, setCb] = useState<ComplianceBalance | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadCB(shipId: string, year: number) {
    setLoading(true);
    setError(null);
    setCb(null);

    try {
      const data = await api.getComplianceBalance(shipId, year);
      setCb(data);
    } catch (err: any) {
      setError(err.message || "Failed to load CB");
    }

    setLoading(false);
  }

  return {
    cb,
    loading,
    error,
    loadCB
  };
}
