import { useCallback, useState } from "react";
import { HttpRouteAdapter } from "../../adapters/infrastructure/HttpRouteAdapter";
import type { Route } from "../domain/Route";

export function useRoutesService() {
  const api = new HttpRouteAdapter();

  const [loading, setLoading] = useState(false);
  const [routes, setRoutes] = useState<Route[]>([]);

  const loadRoutes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getRoutes();
      setRoutes(data);
    } finally {
      setLoading(false);
    }
  }, []);

  async function setBaseline(routeId: string) {
    await api.setBaseline(routeId);
    await loadRoutes(); 
  }

  return {
    loading,
    routes,
    loadRoutes,
    setBaseline
  };
}
