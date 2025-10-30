
import React from 'react'
import { motion } from 'framer-motion'
export default function Insights({ messages }){
  if(!messages || !messages.length) return null
  return (
    <motion.div initial={{opacity:0, y:6}} animate={{opacity:1, y:0}} transition={{duration:.3}} className="container card card-pad">
      <div className="h2 mb-2">Auto Insights</div>
      <ul className="list-disc pl-6 space-y-1">
        {messages.map((m,i)=>(<li key={i} className="text-sm">{m}</li>))}
      </ul>
    </motion.div>
  )
}
