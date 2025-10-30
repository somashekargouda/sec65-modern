import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";

export default function Filters({
  offices,
  sources,
  filters,
  onSelectOffice,
  onToggleOffice,
  onSelectAllOffices,
  onClearOffices,
  onToggleSource,
  taxPeriods,
  onTaxPeriod,
  onSearch,
  onReset,
}) {
  const [officeQuery, setOfficeQuery] = useState("");
  const visibleOffices = useMemo(() => {
    const q = officeQuery.trim().toLowerCase();
    if (!q) return offices;
    return offices.filter((o) => (o || "").toLowerCase().includes(q));
  }, [offices, officeQuery]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container card card-pad flex flex-col gap-3"
    >
      <div className="grid md:grid-cols-4 gap-3">
        <div>
          <label className="block text-sm text-slate-600 dark:text-slate-300 mb-1">
            Search (GSTIN / Trade Name)
          </label>
          <input
            value={filters.search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="e.g. 29ABCDE1234F1Z5 or ZUNO"
            className="input"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-600 dark:text-slate-300 mb-1">
            Tax Period
          </label>
          <select
            value={filters.taxPeriod}
            onChange={(e) => onTaxPeriod(e.target.value)}
            className="select"
          >
            {taxPeriods.map((tp) => (
              <option key={tp} value={tp}>
                {tp}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2 flex items-end gap-2">
          <button onClick={onReset} className="btn btn-dark">
            Reset
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-slate-600 dark:text-slate-300 mb-1">
            Office
          </label>
          <select
            value={filters.office}
            onChange={(e) => onSelectOffice(e.target.value)}
            className="select w-full"
          >
            <option value="All">All</option>
            {offices.map((ofc) => (
              <option key={ofc} value={ofc}>
                {ofc}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="text-sm text-slate-600 dark:text-slate-300 mb-1">
            Source (multi-select)
          </div>
          <div className="flex flex-wrap gap-2 border rounded-xl p-2 max-h-40 overflow-auto bg-white/70 dark:bg-gray-900/60 border-slate-200 dark:border-slate-700">
            {sources.map((src) => (
              <button
                key={src}
                onClick={() => onToggleSource(src)}
                className={`chip ${
                  filters.sources.includes(src) ? "chip-on" : "chip-off"
                }`}
              >
                {src}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
