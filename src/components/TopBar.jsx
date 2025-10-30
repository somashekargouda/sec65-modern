
import React from 'react'
import { motion } from 'framer-motion'

export default function TopBar({ onThemeToggle, theme, children }){
  return (
    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .25 }} className="header-gradient header-pad rounded-2xl">
      <div className="container flex items-center justify-between gap-3 flex-wrap text-white">
        <div className="text-xl md:text-2xl font-semibold">SEC65 Dashboard – v4</div>
        <div className="flex items-center gap-2">{children}
          <button onClick={onThemeToggle} className="bg-white/20 hover:bg-white/30 text-white rounded-xl px-3 py-2">
            {theme==='dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </div>
    </motion.div>
  )
}
