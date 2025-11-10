import { useState, useEffect } from "react";
import { useComplianceService } from "../../../core/application/useComplianceService";
import { useBankingService } from "../../../core/application/useBankingService";
import { toast } from "react-toastify";
import { Ban, Search, PlusCircle, MinusCircle, History } from "lucide-react";

export function BankingPage() {
  const { cb, loadCB, loading: loadingCB, error: cbError } = useComplianceService();
  const {
    records,
    loadRecords,
    bankSurplus,
    applyBank,
    loading: loadingRecords,
    error: bankingError,
  } = useBankingService();

  const [shipId, setShipId] = useState("");
  const [year, setYear] = useState("");
  const [applyAmount, setApplyAmount] = useState("");

  const appliedTotal = records.reduce((sum, r) => sum + r.amountGco2eq, 0);
  const cbBefore = cb?.cb ?? 0;
  const cbAfter = cbBefore + appliedTotal;
  const availableBank = appliedTotal; // positives minus negatives
  const applyAmtNum = Number(applyAmount || 0);
  const canApply = !!cb && !Number.isNaN(applyAmtNum) && applyAmtNum > 0 && applyAmtNum <= availableBank;

  useEffect(() => {
    if (cbError) toast.error(cbError);
    if (bankingError) toast.error(bankingError);
  }, [cbError, bankingError]);

  async function handleLoadCB() {
    if (!shipId || !year) return;
    await loadCB(shipId, Number(year));
    await loadRecords(shipId, Number(year));
  }

  async function handleBank() {
    if (!shipId || !year) return;
    const res = await bankSurplus(shipId, Number(year));
    if (!res) return;
    toast.success("Surplus banked successfully");
    await handleLoadCB();
  }

  async function handleApply() {
    if (!shipId || !year || !applyAmount) return;
    if (!canApply) {
      toast.error("Invalid apply amount or exceeds available banked.");
      return;
    }
    const res = await applyBank(shipId, Number(year), Number(applyAmount));
    if (!res) return;
    toast.success("Bank amount applied successfully");
    await handleLoadCB();
    setApplyAmount("");
  }

  return (
    <div className="space-y-8">
      {/* Ship/Year Inputs */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <div className="flex items-center mb-4">
          <Search className="text-gray-600" size={24} />
          <h2 className="ml-3 text-xl font-semibold text-gray-800">Load Compliance Data</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <input
            type="text"
            placeholder="Ship ID (e.g., R001)"
            className="w-full border-gray-300 rounded-lg shadow-sm"
            value={shipId}
            onChange={(e) => setShipId(e.target.value)}
          />
          <input
            type="number"
            placeholder="Year"
            className="w-full border-gray-300 rounded-lg shadow-sm"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
          <button
            onClick={handleLoadCB}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-sm"
          >
            Load Data
          </button>
        </div>
      </div>

      {/* Compliance Balance & Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <div className="flex items-center mb-4">
            <Ban className="text-gray-600" size={24} />
            <h2 className="ml-3 text-xl font-semibold text-gray-800">Compliance Balance</h2>
          </div>
          {loadingCB ? (
            <p className="text-center text-gray-500 py-8">Loading CB...</p>
          ) : cb ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-lg bg-gray-50 border">
                  <div className="text-sm text-gray-500">CB Before</div>
                  <div className="text-2xl font-bold" style={{ color: cbBefore >= 0 ? '#10B981' : '#EF4444' }}>{cbBefore.toLocaleString()}</div>
                </div>
                <div className="p-4 rounded-lg bg-gray-50 border">
                  <div className="text-sm text-gray-500">Applied (Net)</div>
                  <div className="text-2xl font-bold" style={{ color: appliedTotal >= 0 ? '#10B981' : '#EF4444' }}>{appliedTotal.toLocaleString()}</div>
                </div>
                <div className="p-4 rounded-lg bg-gray-50 border">
                  <div className="text-sm text-gray-500">CB After</div>
                  <div className="text-2xl font-bold" style={{ color: cbAfter >= 0 ? '#10B981' : '#EF4444' }}>{cbAfter.toLocaleString()}</div>
                </div>
              </div>
              <div className="text-center text-sm text-gray-500">gCO₂e</div>
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">Enter ship and year to load CB.</p>
          )}
        </div>

        {cb && (
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Banking Actions</h2>
            {cb.cb > 0 ? (
              <button
                onClick={handleBank}
                className="w-full flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                <PlusCircle size={18} className="mr-2" />
                Bank Positive CB
              </button>
            ) : (
              <div className="text-center text-gray-500 py-2">No positive CB to bank.</div>
            )}
            <div className="flex items-center gap-4">
              <input
                type="number"
                placeholder="Amount to apply"
                className="w-full border-gray-300 rounded-lg shadow-sm"
                value={applyAmount}
                onChange={(e) => setApplyAmount(e.target.value)}
              />
              <button
                onClick={handleApply}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                disabled={!canApply}
              >
                <MinusCircle size={18} className="mr-2" />
                Apply
              </button>
            </div>
            <div className="text-xs text-gray-500">Available to apply: {availableBank.toLocaleString()} gCO₂e</div>
          </div>
        )}
      </div>

      {/* Banking Records */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <div className="flex items-center mb-4">
          <History className="text-gray-600" size={24} />
          <h2 className="ml-3 text-xl font-semibold text-gray-800">Banking Records</h2>
        </div>
        {loadingRecords ? (
          <p className="text-center text-gray-500 py-8">Loading records...</p>
        ) : records.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No banking records found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="p-4 text-left font-semibold">Type</th>
                  <th className="p-4 text-left font-semibold">Amount (gCO₂e)</th>
                  <th className="p-4 text-left font-semibold">Year</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {records.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      {record.amountGco2eq > 0 ? (
                        <span className="flex items-center text-green-600 font-semibold">
                          <PlusCircle size={16} className="mr-2" /> Banked
                        </span>
                      ) : (
                        <span className="flex items-center text-red-600 font-semibold">
                          <MinusCircle size={16} className="mr-2" /> Applied
                        </span>
                      )}
                    </td>
                    <td className="p-4">{record.amountGco2eq?.toLocaleString() ?? "—"}</td>
                    <td className="p-4">{record.year}</td>
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
