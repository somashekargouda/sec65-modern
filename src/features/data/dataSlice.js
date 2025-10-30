
import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'

const initialState = {
  rows: [],
  status: 'idle',
  error: null,
  filters: { offices: [], sources: [], taxPeriod: 'All', search: '' },
  sort: { column: null, direction: 'asc' },
  columns: {
    GSTIN: true, TRADE_NAME: true, ALLOTED_OFFICE: true, SOURCE: true,
    TAX_PERIOD: true, TAX_INVOLVED: true, PROP_TOT: true, ADT_TOT: true
  },
  theme: 'light',
  importing: false
}

export const loadData = createAsyncThunk('data/load', async () => {
  const res = await fetch('/dcct_a3_2_v4.json')
  if (!res.ok) throw new Error('Failed to load data')
  return res.json()
})

const slice = createSlice({
  name: 'data', initialState,
  reducers: {
    setRows: (s,a)=>{ s.rows = a.payload },
    setOffices: (s,a)=>{ s.filters.offices=a.payload },
    setSources: (s,a)=>{ s.filters.sources=a.payload },
    setTaxPeriod: (s,a)=>{ s.filters.taxPeriod=a.payload },
    setSearch: (s,a)=>{ s.filters.search=a.payload },
    resetFilters: (s)=>{ s.filters=initialState.filters },
    setSort: (s,a)=>{ s.sort=a.payload },
    setColumns: (s,a)=>{ s.columns=a.payload },
    setTheme: (s,a)=>{ s.theme=a.payload },
    setImporting: (s,a)=>{ s.importing=a.payload }
  },
  extraReducers: b=>{
    b.addCase(loadData.pending, s=>{s.status='loading'})
     .addCase(loadData.fulfilled, (s,a)=>{s.status='succeeded'; s.rows=a.payload})
     .addCase(loadData.rejected, (s,a)=>{s.status='failed'; s.error=a.error.message})
  }
})

export const { setRows,setOffices,setSources,setTaxPeriod,setSearch,resetFilters,setSort,setColumns,setTheme,setImporting } = slice.actions
export default slice.reducer

export const selectRows = s=>s.data.rows
export const selectFilters = s=>s.data.filters
export const selectSort = s=>s.data.sort
export const selectColumns = s=>s.data.columns
export const selectTheme = s=>s.data.theme
export const selectImporting = s=>s.data.importing

export const selectAllOffices = createSelector([selectRows], rows=>{
  const set = new Set(rows.map(r=>r.ALLOTED_OFFICE).filter(Boolean))
  return Array.from(set).sort()
})
export const selectAllSources = createSelector([selectRows], rows=>{
  const set = new Set(rows.map(r=>r.SOURCE).filter(Boolean))
  return Array.from(set).sort()
})
export const selectTaxPeriods = createSelector([selectRows], rows=>{
  const set = new Set(rows.map(r=>r.TAX_PERIOD).filter(Boolean))
  return ['All', ...Array.from(set).sort()]
})

const cmp = (a,b)=>{
  const na = typeof a === 'number' ? a : parseFloat(a)
  const nb = typeof b === 'number' ? b : parseFloat(b)
  const aIsNum = !isNaN(na) && isFinite(na)
  const bIsNum = !isNaN(nb) && isFinite(nb)
  if (aIsNum && bIsNum) return na - nb
  const sa = (a??'').toString().toLowerCase()
  const sb = (b??'').toString().toLowerCase()
  if(sa<sb) return -1; if(sa>sb) return 1; return 0
}

export const selectFilteredRows = createSelector([selectRows, selectFilters, selectSort], (rows, f, sort)=>{
  let filtered = rows.filter(r=>{
    const officeOk = !f.offices.length || f.offices.includes(r.ALLOTED_OFFICE)
    const sourceOk = !f.sources.length || f.sources.includes(r.SOURCE)
    const taxOk = f.taxPeriod === 'All' || r.TAX_PERIOD === f.taxPeriod
    const q = f.search.toLowerCase()
    const searchOk = !q || (r.TRADE_NAME||'').toLowerCase().includes(q) || (r.GSTIN||'').toLowerCase().includes(q)
    return officeOk && sourceOk && taxOk && searchOk
  })
  if (sort.column) {
    const dir = sort.direction==='asc'?1:-1
    filtered = [...filtered].sort((A,B)=> dir * cmp(A[sort.column], B[sort.column]))
  }
  return filtered
})

export const selectKpis = createSelector([selectFilteredRows], rows=>{
  const total = rows.length
  const neg = rows.filter(r => (r.LIABILITY_DIFF??0) < 0).length
  const zero = rows.filter(r => (r.LIABILITY_DIFF??0) === 0).length
  const pos = rows.filter(r => (r.LIABILITY_DIFF??0) > 0).length
  const sumTaxInvolved = rows.reduce((acc,r)=>acc + (r.TAX_INVOLVED||0), 0)
  const propTot = rows.reduce((a,r)=>a+(r.PROP_TOT||0),0)
  const adtTot  = rows.reduce((a,r)=>a+(r.ADT_TOT||0),0)
  return { total, neg, zero, pos, sumTaxInvolved, propTot, adtTot }
})

export const selectOfficeCounts = createSelector([selectFilteredRows], (rows)=>{
  const map = {}
  rows.forEach(r=>{ const k = r.ALLOTED_OFFICE || 'Unknown'; map[k]=(map[k]||0)+1 })
  return Object.entries(map).map(([name,value])=>({name,value})).sort((a,b)=>b.value-a.value)
})

export const selectOfficeStacked = createSelector([selectFilteredRows], rows=>{
  const map = {}
  rows.forEach(r=>{
    const k = r.ALLOTED_OFFICE || 'Unknown'
    if(!map[k]) map[k] = { name: k, Proposed: 0, Detected: 0 }
    map[k].Proposed += (r.PROP_TOT||0)
    map[k].Detected += (r.ADT_TOT||0)
  })
  return Object.values(map).sort((a,b)=>(b.Proposed+b.Detected)-(a.Proposed+a.Detected)).slice(0,15)
})

export const selectPeriodSeries = createSelector([selectFilteredRows], rows=>{
  const map = {}
  rows.forEach(r=>{ const p=r.TAX_PERIOD||'Unknown'; map[p]=(map[p]||0)+(r.TAX_INVOLVED||0) })
  return Object.entries(map).map(([name,value])=>({name,value})).sort((a,b)=>a.name.localeCompare(b.name))
})

export const selectPieSplit = createSelector([selectFilteredRows], rows=>{
  const pos = rows.filter(r => (r.LIABILITY_DIFF??0) > 0).length
  const zero = rows.filter(r => (r.LIABILITY_DIFF??0) === 0).length
  const neg = rows.filter(r => (r.LIABILITY_DIFF??0) < 0).length
  return [
    { name: 'Positive Diff', value: pos },
    { name: 'Zero Diff', value: zero },
    { name: 'Negative Diff', value: neg },
  ]
})
