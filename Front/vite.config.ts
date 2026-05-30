import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const apiTarget = process.env.VITE_API_PROXY_TARGET ?? 'http://localhost:3000'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3001,
    proxy: {
      '/log': {
        target: apiTarget,
        changeOrigin: true,
      },
      '/work-type': {
        target: apiTarget,
        changeOrigin: true,
      },
    },
  },
})
