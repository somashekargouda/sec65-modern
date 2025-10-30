
import React, { useMemo, useState } from 'react'
import { Tooltip } from 'react-tooltip'
import { motion } from 'framer-motion'

export function ShimmerTable(){
  return <div className="container"><div className="card card-pad h-64 shimmer"></div></div>
}

export default function DataTable({ rows, onSort, sort, columns, onToggleColumn }){
  const [page, setPage] = useState(1)
  const pageSize = 20
  const pages = Math.max(1, Math.ceil(rows.length / pageSize))
  const pageRows = useMemo(()=>{ const start=(page-1)*pageSize; return rows.slice(start,start+pageSize) },[rows,page])

  const allCols=[
    {key:'GSTIN',label:'GSTIN'},
    {key:'TRADE_NAME',label:'Trade Name'},
    {key:'ALLOTED_OFFICE',label:'Office'},
    {key:'SOURCE',label:'Source'},
    {key:'TAX_PERIOD',label:'Tax Period'},
    {key:'TAX_INVOLVED',label:'Tax Involved (L)'},
    {key:'PROP_TOT',label:'Proposed Total'},
    {key:'ADT_TOT',label:'ADT-02 Total'},
  ]
  const cols = allCols.filter(c => columns[c.key])

  return (<motion.div initial={{opacity:0, y:6}} animate={{opacity:1, y:0}} transition={{duration:.3}} className="container card card-pad">
    <div className="flex items-center justify-between mb-2">
      <div className="h2">Records ({rows.length})</div>
      <div className="flex items-center gap-3 flex-wrap">
        {allCols.map(c=>(
          <label key={c.key} className="text-xs flex items-center gap-1">
            <input type="checkbox" checked={!!columns[c.key]} onChange={()=>onToggleColumn(c.key)} />
            {c.label}
          </label>
        ))}
      </div>
    </div>

    <div className="overflow-auto">
      <table className="table">
        <thead>
          <tr>{cols.map(c=>(
            <th key={c.key} className="th" onClick={()=>onSort(c.key)}>
              {c.label} {sort.column===c.key?(sort.direction==='asc'?'▲':'▼'):''}
            </th>
          ))}</tr>
        </thead>
        <tbody>
          {pageRows.map((r,i)=>(
            <tr key={r.GSTIN + i} data-tooltip-id={`tip${i}`} className={`row ${(r.LIABILITY_DIFF??0)<0?'text-red-600':''}`}>
              {cols.map(c=>(
                <td key={c.key} className="td">{r[c.key]}</td>
              ))}
              <Tooltip id={`tip${i}`} place="top">
                <div className="text-sm space-y-1">
                  <div><b>Tax Involved:</b> {r.TAX_INVOLVED} L</div>
                  <div><b>Proposed (Observation O–S):</b> T:{r.PROP_TAX} · I:{r.PROP_INT} · P:{r.PROP_PEN} · Tot:{r.PROP_TOT}</div>
                  <div><b>Detected (ADT-02 U–Y):</b> T:{r.ADT_TAX} · I:{r.ADT_INT} · P:{r.ADT_PEN} · Tot:{r.ADT_TOT}</div>
                </div>
              </Tooltip>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="flex items-center justify-between mt-4">
      <button onClick={()=>setPage(p=>Math.max(1,p-1))} className="px-3 py-1 rounded-lg border border-slate-300 dark:border-slate-700">Prev</button>
      <div className="text-sm">Page {page} / {pages}</div>
      <button onClick={()=>setPage(p=>Math.min(pages,p+1))} className="px-3 py-1 rounded-lg border border-slate-300 dark:border-slate-700">Next</button>
    </div>
  </motion.div>)
}
