// src/App.jsx
import React, { useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Qs from "qs";

// Redux selectors + actions
import {
  loadData,
  selectFilteredRows,
  selectAllOffices,
  selectAllSources,
  selectTaxPeriods,
  setOffices,
  setSources,
  setTaxPeriod,
  setSearch,
  resetFilters,
  selectSort,
  setSort,
  selectKpis,
  selectOfficeCounts,
  selectPieSplit,
  setRows,
  selectColumns,
  setColumns,
  selectTheme,
  setTheme,
  selectOfficeStacked,
  selectPeriodSeries,
  selectImporting,
  setImporting,
} from "./features/data/dataSlice.js";

// Components
import TopBar from "./components/TopBar.jsx";
import Filters from "./components/Filters.jsx";
import KpiCards from "./components/KpiCards.jsx";
import Charts, { ShimmerChart } from "./components/Charts.jsx";
import DataTable, { ShimmerTable } from "./components/DataTable.jsx";
import UploadExcel from "./components/UploadExcel.jsx";
import ExportCSV from "./components/ExportCSV.jsx";
import Insights from "./components/Insights.jsx";
import { useToast } from "./components/Toast.jsx";

export default function App() {
  const dispatch = useDispatch();
  const { notify } = useToast();

  // Redux state selections
  const status = useSelector((s) => s.data.status);
  const error = useSelector((s) => s.data.error);
  const rows = useSelector(selectFilteredRows);
  const offices = useSelector(selectAllOffices);
  const sources = useSelector(selectAllSources);
  const taxPeriods = useSelector(selectTaxPeriods);
  const filters = useSelector((s) => s.data.filters);
  const sort = useSelector(selectSort);
  const kpis = useSelector(selectKpis);
  const officeCounts = useSelector(selectOfficeCounts);
  const officeStacked = useSelector(selectOfficeStacked);
  const periodSeries = useSelector(selectPeriodSeries);
  const pie = useSelector(selectPieSplit);
  const columns = useSelector(selectColumns);
  const theme = useSelector(selectTheme);
  const importing = useSelector(selectImporting);

  // -----------------------------
  // INITIAL LOAD
  // -----------------------------
  useEffect(() => {
    dispatch(loadData())
      .unwrap()
      .catch(() => notify("Failed to load dataset", "error"));

    const q = window.location.search.slice(1);
    if (q) {
      try {
        const parsed = Qs.parse(q);
        if (parsed.offices)
          dispatch(
            setOffices(
              Array.isArray(parsed.offices) ? parsed.offices : [parsed.offices]
            )
          );
        if (parsed.sources)
          dispatch(
            setSources(
              Array.isArray(parsed.sources) ? parsed.sources : [parsed.sources]
            )
          );
        if (parsed.taxPeriod) dispatch(setTaxPeriod(parsed.taxPeriod));
        if (parsed.search) dispatch(setSearch(parsed.search));
      } catch (err) {
        console.warn("Invalid query string:", err);
      }
    }
  }, [dispatch, notify]);

  // -----------------------------
  // PERSIST STATE + THEME TO LOCALSTORAGE + URL
  // -----------------------------
  useEffect(() => {
    const state = {
      rows: rows.length ? rows : undefined,
      filters,
      columns,
      theme,
    };
    localStorage.setItem("sec65_state_v4", JSON.stringify(state));

    const qs = Qs.stringify(
      { ...filters, offices: filters.offices, sources: filters.sources },
      { arrayFormat: "repeat" }
    );
    window.history.replaceState(
      null,
      "",
      qs ? "?" + qs : window.location.pathname
    );

    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [rows, filters, columns, theme]);

  // -----------------------------
  // MEMOS + CALLBACKS
  // -----------------------------
  const visibleKeys = useMemo(
    () => Object.keys(columns).filter((k) => columns[k]),
    [columns]
  );

  const toggleOffice = useCallback(
    (ofc) => {
      const set = new Set(filters.offices);
      set.has(ofc) ? set.delete(ofc) : set.add(ofc);
      dispatch(setOffices(Array.from(set)));
    },
    [filters.offices, dispatch]
  );

  const handleSelectAllOffices = useCallback(
    () => dispatch(setOffices(offices)),
    [offices, dispatch]
  );

  const clearOffices = useCallback(() => dispatch(setOffices([])), [dispatch]);

  const toggleSource = useCallback(
    (src) => {
      const set = new Set(filters.sources);
      set.has(src) ? set.delete(src) : set.add(src);
      dispatch(setSources(Array.from(set)));
    },
    [filters.sources, dispatch]
  );

  const changeSort = useCallback(
    (col) => {
      if (sort.column === col) {
        dispatch(
          setSort({
            column: col,
            direction: sort.direction === "asc" ? "desc" : "asc",
          })
        );
      } else {
        dispatch(setSort({ column: col, direction: "asc" }));
      }
    },
    [sort, dispatch]
  );

  const handleImportedRows = useCallback(
    (records) => {
      dispatch(setRows(records));
      dispatch(resetFilters());
      dispatch(setImporting(false));
    },
    [dispatch]
  );

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <div className="space-y-4 pb-10">
      {/* TopBar */}
      <TopBar
        onThemeToggle={() =>
          dispatch(setTheme(theme === "dark" ? "light" : "dark"))
        }
        theme={theme}
      >
        <UploadExcel
          onStart={() => dispatch(setImporting(true))}
          onRows={handleImportedRows}
          onDone={() => dispatch(setImporting(false))}
        />
        <ExportCSV rows={rows} visibleKeys={visibleKeys} />
      </TopBar>

      {/* KPI Cards */}
      <KpiCards kpis={kpis} />

      {/* Filters */}
      <Filters
        offices={offices}
        sources={sources}
        taxPeriods={taxPeriods}
        filters={filters}
        onToggleOffice={toggleOffice}
        onSelectAllOffices={handleSelectAllOffices}
        onClearOffices={clearOffices}
        onToggleSource={toggleSource}
        onTaxPeriod={(v) => dispatch(setTaxPeriod(v))}
        onSearch={(v) => dispatch(setSearch(v))}
        onReset={() => dispatch(resetFilters())}
      />

      {/* Charts */}
      <Charts
        officeCounts={officeCounts}
        officeStacked={officeStacked}
        pie={pie}
        periodSeries={periodSeries}
        loading={status === "loading" || importing}
      />

      {/* Data Table */}
      {status === "loading" || importing ? (
        <ShimmerTable />
      ) : (
        <DataTable
          rows={rows}
          onSort={changeSort}
          sort={sort}
          columns={columns}
          onToggleColumn={(key) =>
            dispatch(setColumns({ ...columns, [key]: !columns[key] }))
          }
        />
      )}

      {/* Optional Insights */}
      <Insights />
    </div>
  );
}
