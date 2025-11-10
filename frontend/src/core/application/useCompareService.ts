import { useCallback, useState } from "react";
import { HttpRouteAdapter } from "../../adapters/infrastructure/HttpRouteAdapter";
import type { ComparisonResult } from "../domain/Comparison";

export function useCompareService() {
  const api = new HttpRouteAdapter();

  const [loading, setLoading] = useState(false);
  const [comparison, setComparison] = useState<ComparisonResult[]>([]);

  const loadComparison = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getComparison();
      setComparison(data);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    comparison,
    loadComparison,
  };
}
