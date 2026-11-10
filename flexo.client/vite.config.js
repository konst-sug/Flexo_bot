import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,            // порт дев-сервера фронта (по умолчанию 5173)
    proxy: {
      '/api': {
        target: 'http://localhost:8050',   // твой бэкенд
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''),  // если бэкенду не нужен префикс /api
        // ws: true,  // если бэкенд держит websocket'ы
      },
    },
  },
})
