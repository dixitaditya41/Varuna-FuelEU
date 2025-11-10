import { useEffect } from "react";
import { useCompareService } from "../../../core/application/useCompareService";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { GitCompareArrows, BarChart3, CheckCircle, XCircle } from "lucide-react";

export function ComparePage() {
  const { comparison, loading, loadComparison } = useCompareService();

  useEffect(() => {
    loadComparison();
  }, []);

  return (
    <div className="space-y-8">
      {/* Comparison Table Card */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <div className="flex items-center mb-4">
          <GitCompareArrows className="text-gray-600" size={24} />
          <h2 className="ml-3 text-xl font-semibold text-gray-800">Route Comparison</h2>
        </div>
        {loading ? (
          <p className="text-center text-gray-500 py-8">Loading comparison data...</p>
        ) : comparison.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No comparison data found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="p-4 text-left font-semibold">Route ID</th>
                  <th className="p-4 text-left font-semibold">Baseline Intensity</th>
                  <th className="p-4 text-left font-semibold">Actual Intensity</th>
                  <th className="p-4 text-left font-semibold">% Difference</th>
                  <th className="p-4 text-left font-semibold">Compliant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {comparison.map((c) => (
                  <tr key={c.routeId} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-mono text-gray-700">{c.routeId}</td>
                    <td className="p-4 text-gray-800">{c.baselineIntensity.toFixed(2)}</td>
                    <td className="p-4 text-gray-800">{c.comparisonIntensity.toFixed(2)}</td>
                    <td
                      className={`p-4 font-semibold ${
                        c.percentDiff <= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {c.percentDiff.toFixed(2)}%
                    </td>
                    <td className="p-4">
                      {c.compliant ? (
                        <span className="flex items-center text-green-600 font-semibold">
                          <CheckCircle size={18} className="mr-2" />
                          Compliant
                        </span>
                      ) : (
                        <span className="flex items-center text-red-600 font-semibold">
                          <XCircle size={18} className="mr-2" />
                          Non-Compliant
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Comparison Chart Card */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <div className="flex items-center mb-4">
          <BarChart3 className="text-gray-600" size={24} />
          <h2 className="ml-3 text-xl font-semibold text-gray-800">GHG Intensity Comparison</h2>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={comparison} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="routeId" tick={{ fill: "#4B5563" }} />
            <YAxis tick={{ fill: "#4B5563" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "0.5rem",
              }}
            />
            <Legend />
            <Bar dataKey="baselineIntensity" fill="#3B82F6" name="Baseline Intensity" radius={[4, 4, 0, 0]} />
            <Bar dataKey="comparisonIntensity" fill="#10B981" name="Actual Intensity" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
