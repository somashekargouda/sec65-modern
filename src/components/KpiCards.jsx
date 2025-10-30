
import React from 'react'
import { motion } from 'framer-motion'

export default function KpiCards({ kpis }){
  const items=[
    {label:'Total Records',value:kpis.total},
    {label:'Negative Diff',value:kpis.neg},
    {label:'Zero Diff',value:kpis.zero},
    {label:'Positive Diff',value:kpis.pos},
    {label:'Tax Involved (L)',value:kpis.sumTaxInvolved.toFixed(2)},
    {label:'Proposed Total',value:kpis.propTot.toFixed(2)},
    {label:'Detected Total',value:kpis.adtTot.toFixed(2)}
  ]
  return <div className="container grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
    {items.map((it,idx)=>(
      <motion.div key={it.label} initial={{opacity:0, y:6}} animate={{opacity:1, y:0}} transition={{delay: .05*idx, duration:.3}} className="card card-pad">
        <div className="text-xs text-slate-600 dark:text-slate-300">{it.label}</div>
        <div className="mt-1 text-2xl font-semibold">{it.value}</div>
      </motion.div>
    ))}
  </div>
}
