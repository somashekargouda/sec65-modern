
import React, { createContext, useContext, useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const ToastCtx = createContext({ notify: ()=>{} })
export const useToast = ()=> useContext(ToastCtx)

export default function ToastProvider({ children }){
  const [toasts, setToasts] = useState([])
  const notify = useCallback((msg, type='info', id=Math.random().toString(36).slice(2))=>{
    setToasts(t => [...t, { id, msg, type }])
    setTimeout(()=> setToasts(t => t.filter(x => x.id !== id)), 3000)
  },[])
  return (
    <ToastCtx.Provider value={{ notify }}>
      {children}
      <div className="fixed top-3 right-3 z-50 space-y-2">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div key={t.id}
              initial={{ opacity: 0, y: -10, scale: .98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: .98 }}
              className={`toast ${t.type==='success'?'toast-success':''} ${t.type==='error'?'toast-error':''} ${t.type==='info'?'toast-info':''} ${t.type==='warn'?'toast-warn':''}`}>
              {t.msg}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  )
}
