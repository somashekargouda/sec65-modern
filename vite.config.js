
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  cacheDir: false, // 🚫 no persistent cache, avoids stale chunk ghosts
  server: { port: 5173 }
})
