import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // VITE_BASE_PATH=/vpn-miniapp/ for GitHub Pages, defaults to / for local dev
  const base = env.VITE_BASE_PATH ?? '/'

  return {
    base,
    plugins: [react(), tailwindcss()],
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
    server: {
      port: 5173,
      proxy: {
        '/tma': env.VITE_API_URL ?? 'http://localhost:8000',
      },
    },
  }
})
