import { useState } from "react";
import { HttpPoolingAdapter } from "../../adapters/infrastructure/HttpPoolingAdapter";
import type { PoolResponse } from "../domain/Pool";
import { toast } from "react-toastify";

export function usePoolingService() {
  const api = new HttpPoolingAdapter();

  const [pool, setPool] = useState<PoolResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createPool(year: number, shipIds: string[]) {
    setLoading(true);
    setError(null);
    try {
      const result = await api.createPool(year, shipIds);
      setPool(result);
      toast.success("Pool created successfully!");
      return result;
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }

  return {
    pool,
    loading,
    error,
    createPool,
  };
}
