import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Real-Time-Fitness-Tracker-1/',
  server: {
    host: true
  }
}) 