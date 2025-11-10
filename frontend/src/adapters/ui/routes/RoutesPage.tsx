import { useEffect, useMemo, useState } from "react";
import { useRoutesService } from "../../../core/application/useRoutesService";
import type { Route } from "../../../core/domain/Route";
import { Filter, List, Ship, Anchor } from "lucide-react";

export function RoutesPage() {
  const { routes, loading, loadRoutes, setBaseline } = useRoutesService();

  const [filters, setFilters] = useState({
    vesselType: "",
    fuelType: "",
    year: "",
  });

  useEffect(() => {
    loadRoutes();
  }, [loadRoutes]);

  const filteredRoutes = useMemo(() => {
    return routes.filter((r: Route) => {
      return (
        (filters.vesselType === "" || r.vesselType === filters.vesselType) &&
        (filters.fuelType === "" || r.fuelType === filters.fuelType) &&
        (filters.year === "" || r.year === Number(filters.year))
      );
    });
  }, [routes, filters]);

  const vesselTypes = [...new Set(routes.map((r) => r.vesselType))];
  const fuelTypes = [...new Set(routes.map((r) => r.fuelType))];
  const years = [...new Set(routes.map((r) => r.year))];

  return (
    <div className="space-y-8">
      {/* Filters Card */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <div className="flex items-center mb-4">
          <Filter className="text-gray-600" size={24} />
          <h2 className="ml-3 text-xl font-semibold text-gray-800">Filters</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <select
            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={filters.vesselType}
            onChange={(e) => setFilters({ ...filters, vesselType: e.target.value })}
          >
            <option value="">All Vessel Types</option>
            {vesselTypes.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
          <select
            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={filters.fuelType}
            onChange={(e) => setFilters({ ...filters, fuelType: e.target.value })}
          >
            <option value="">All Fuel Types</option>
            {fuelTypes.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
          <select
            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={filters.year}
            onChange={(e) => setFilters({ ...filters, year: e.target.value })}
          >
            <option value="">All Years</option>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {/* Routes Table Card */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <div className="flex items-center mb-4">
          <List className="text-gray-600" size={24} />
          <h2 className="ml-3 text-xl font-semibold text-gray-800">Routes Overview</h2>
        </div>
        {loading ? (
          <p className="text-center text-gray-500 py-8">Loading routes...</p>
        ) : filteredRoutes.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No routes found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="p-4 text-left font-semibold">Route ID</th>
                  <th className="p-4 text-left font-semibold">Vessel</th>
                  <th className="p-4 text-left font-semibold">Fuel</th>
                  <th className="p-4 text-left font-semibold">Year</th>
                  <th className="p-4 text-left font-semibold">GHG Intensity</th>
                  <th className="p-4 text-left font-semibold">Fuel Used (t)</th>
                  <th className="p-4 text-left font-semibold">Distance (km)</th>
                  <th className="p-4 text-left font-semibold">Emissions (t)</th>
                  <th className="p-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRoutes.map((r) => (
                  <tr key={r.routeId} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-mono text-gray-700">{r.routeId}</td>
                    <td className="p-4 text-gray-800">{r.vesselType}</td>
                    <td className="p-4 text-gray-800">{r.fuelType}</td>
                    <td className="p-4 text-gray-800">{r.year}</td>
                    <td className="p-4 text-gray-800">{r.ghgIntensity.toFixed(2)}</td>
                    <td className="p-4 text-gray-800">{r.fuelTons}</td>
                    <td className="p-4 text-gray-800">{r.distanceKm}</td>
                    <td className="p-4 text-gray-800">{r.totalEmissionsT}</td>
                    <td className="p-4">
                      {r.isBaseline ? (
                        <span className="flex items-center text-green-600 font-semibold">
                          <Anchor size={16} className="mr-2" />
                          Baseline
                        </span>
                      ) : (
                        <button
                          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-sm"
                          onClick={() => setBaseline(r.routeId)}
                        >
                          <Ship size={16} className="mr-2" />
                          Set Baseline
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
