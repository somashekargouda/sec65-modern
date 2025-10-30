# SEC65 Dashboard – v4 (Cache‑Proof)

Modern analytics dashboard for **DCCT(A)-3.2** (SEC 65.xlsx).  
React + Redux + Tailwind + Recharts + Framer Motion. **Cache-proof Vite build** (no `.vite` cache).

## Features
- Animated charts (Bar, Stacked, Pie, Area)
- Office / Source / Tax Period filters + search
- Minimal shimmer loader
- Excel import (auto-detect 3.2, GSTIN validation)
- CSV export (filtered rows only)
- Auto insights (basic)
- Dark/Light mode
- LocalStorage + URL sync
- ✅ Toast notifications (import, export, errors)

## Setup
```bash
unzip sec65-dashboard-pro-v4.zip
cd sec65-dashboard-pro-v4
npm install
npm run dev
# open http://localhost:5173
```

## Build
```bash
npm run build
npm run preview
```
