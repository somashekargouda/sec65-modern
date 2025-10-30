
import React from 'react'
import * as XLSX from 'xlsx'
import { useToast } from './Toast.jsx'

function parseSheetToRecords(worksheet) {
  const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
  if (!rows.length) return { records: [], skipped: 0, total: 0 }
  let headerIdx = -1
  for (let i = 0; i < Math.min(60, rows.length); i++) {
    const row = rows[i].map(v => String(v || '').toUpperCase())
    if (row.some(cell => cell.includes('SL.NO'))) { headerIdx = i; break }
  }
  if (headerIdx === -1) return { records: [], skipped: rows.length, total: rows.length }

  const data = rows.slice(headerIdx + 1)
  let skipped = 0
  const records = []
  for (const row of data) {
    const get = (i) => row[i] ?? null
    const gstin = (get(2) || '').toString().trim()
    if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(gstin)) { skipped++; continue }
    const toNum = (v) => { const n = parseFloat(v); return Number.isFinite(n) ? n : null }
    records.push({
      ALLOTED_OFFICE: (get(1) || '').toString().trim(),
      GSTIN: gstin,
      TRADE_NAME: (get(3) || '').toString().trim(),
      TAX_PERIOD: (get(4) || '').toString().trim(),
      SOURCE: (get(5) || '').toString().trim(),
      TAX_INVOLVED: toNum(get(8)),
      PROP_TAX: toNum(get(14)),
      PROP_INT: toNum(get(15)),
      PROP_PEN: toNum(get(16)),
      PROP_TOT: toNum(get(18)),
      ADT_TAX: toNum(get(20)),
      ADT_INT: toNum(get(21)),
      ADT_PEN: toNum(get(22)),
      ADT_TOT: toNum(get(24)),
      LIABILITY_DIFF: toNum(get(36)),
    })
  }
  return { records, skipped, total: rows.length }
}

export default function UploadExcel({ onStart, onRows, onDone }){
  const { notify } = useToast()

  const onChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    onStart?.()
    const reader = new FileReader()
    reader.onload = (evt) => {
      try{
        const data = new Uint8Array(evt.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        let sheetName = 'DCCT(A)-3.2'
        if (!workbook.Sheets[sheetName]) {
          sheetName = workbook.SheetNames.find(n => n.toUpperCase().includes('3.2')) || workbook.SheetNames[0]
        }
        const ws = workbook.Sheets[sheetName]
        if (!ws) { notify('Could not find DCCT(A)-3.2 sheet','error'); onDone?.(); return }
        const res = parseSheetToRecords(ws)
        if (!res.records.length) { notify('No valid rows found in selected sheet','warn'); onDone?.(); return }
        notify(`Excel imported successfully — ${res.records.length} records`, 'success')
        onRows(res.records)
      } catch (err){
        console.error(err)
        notify('Failed to parse Excel file','error')
      } finally {
        onDone?.()
      }
    }
    reader.readAsArrayBuffer(file)
  }

  return (
    <label className="bg-white/20 hover:bg-white/30 text-white rounded-xl px-3 py-2 cursor-pointer">
      Import Excel (.xlsx)
      <input type="file" accept=".xlsx" onChange={onChange} hidden />
    </label>
  )
}
