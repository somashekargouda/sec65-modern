
import React from 'react'
import { useToast } from './Toast.jsx'

function toCSV(rows, visibleKeys){
  if(!rows.length) return ''
  const headers = visibleKeys
  const escape = (v) => {
    const s = (v==null?'':String(v)).replace(/"/g,'""')
    return /[",\n]/.test(s) ? `"${s}"` : s
  }
  const lines = [headers.join(',')]
  for(const r of rows){
    lines.push(headers.map(h=>escape(r[h])).join(','))
  }
  return lines.join('\n')
}

export default function ExportCSV({ rows, visibleKeys }){
  const { notify } = useToast()
  const onExport = () => {
    const csv = toCSV(rows, visibleKeys)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const d = new Date()
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth()+1).padStart(2,'0')
    const dd = String(d.getDate()).padStart(2,'0')
    a.href = url
    a.download = `sec65_filtered_${yyyy}-${mm}-${dd}.csv`
    a.click()
    URL.revokeObjectURL(url)
    notify('Filtered data exported successfully','info')
  }
  return (
    <button onClick={onExport} className="bg-white/20 hover:bg-white/30 text-white rounded-xl px-3 py-2">
      Export Filtered Data
    </button>
  )
}
