import { useState } from "react";
import { usePoolingService } from "../../../core/application/usePoolingService";
import { API_BASE_URL } from "../../../shared/config";
import { toast } from "react-toastify";
import { Users, Ship } from "lucide-react";

export function PoolingPage() {
  const { pool, loading, createPool } = usePoolingService();

  const [year, setYear] = useState("");
  const [ships, setShips] = useState<{ shipId: string; adjustedCb: number }[]>([]);
  const [selectedShips, setSelectedShips] = useState<string[]>([]);

  async function loadAdjustedCB() {
    if (!year) return;

    const res = await fetch(`${API_BASE_URL}/compliance/adjusted-cb?year=${year}`);
    if (!res.ok) {
      const err = await res.json();
      toast.error(err.error);
      return;
    }

    const data = await res.json();
    setShips(data);
  }

  function toggleShip(id: string) {
    setSelectedShips((list) =>
      list.includes(id) ? list.filter((x) => x !== id) : [...list, id]
    );
  }

  async function handleCreatePool() {
    if (!year || selectedShips.length === 0) {
      toast.error("Select year and ships first");
      return;
    }
    await createPool(Number(year), selectedShips);
  }

  const poolSum = ships
    .filter((s) => selectedShips.includes(s.shipId))
    .reduce((acc, s) => acc + s.adjustedCb, 0);
  const hasDeficitSelected = ships
    .filter((s) => selectedShips.includes(s.shipId))
    .some((s) => s.adjustedCb < 0);
  const canCreatePool = selectedShips.length > 0 && poolSum >= 0 && hasDeficitSelected && !loading;

  return (
    <div className="space-y-8">
      {/* Inputs */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Create a Pool</h2>
        <div className="flex items-center gap-4">
          <input
            type="number"
            placeholder="Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="border-gray-300 rounded-lg shadow-sm"
          />
          <button
            onClick={loadAdjustedCB}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Load Ships
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Ship Selection */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Available Ships</h3>
          {ships.length > 0 ? (
            <div className="space-y-3">
              {ships.map((s) => (
                <label
                  key={s.shipId}
                  className="flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={selectedShips.includes(s.shipId)}
                    onChange={() => toggleShip(s.shipId)}
                  />
                  <Ship size={20} className="mx-3 text-gray-500" />
                  <span className="font-medium text-gray-800">{s.shipId}</span>
                  <span
                    className={`ml-auto font-semibold ${
                      s.adjustedCb >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {s.adjustedCb.toLocaleString()} gCO₂e
                  </span>
                </label>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No ships loaded.</p>
          )}
        </div>

        {/* Create Pool & Summary */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex flex-col">
          <h3 className="text-lg font-semibold mb-4">Pool Summary</h3>
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <p className="text-5xl font-bold" style={{ color: poolSum >= 0 ? '#10B981' : '#EF4444' }}>
              {poolSum.toLocaleString()}
            </p>
            <p className="text-gray-500 mb-6">Total Pool CB</p>
            <button
              onClick={handleCreatePool}
              className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
              disabled={!canCreatePool}
            >
              <Users size={20} className="inline-block mr-2" />
              Create Pool
            </button>
            {!hasDeficitSelected && selectedShips.length > 0 && (
              <p className="text-xs text-amber-600 mt-2">Select at least one deficit ship.</p>
            )}
            {poolSum < 0 && (
              <p className="text-xs text-red-600 mt-1">Pool sum must be ≥ 0.</p>
            )}
          </div>
        </div>
      </div>

      {/* Pool result */}
      {pool && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Pool Result</h3>
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-4 text-left font-semibold">Ship</th>
                <th className="p-4 text-left font-semibold">Before</th>
                <th className="p-4 text-left font-semibold">After</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pool.members.map((m) => (
                <tr key={m.shipId} className="hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-800">{m.shipId}</td>
                  <td className="p-4 text-gray-600">{m.cbBefore.toLocaleString()}</td>
                  <td
                    className={`p-4 font-semibold ${
                      m.cbAfter >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {m.cbAfter.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
