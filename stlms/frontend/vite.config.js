import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // When running standalone (npm run dev), proxy API calls to Spring Boot
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  },
  // Production build goes to dist/ — Spring Boot will serve it from /static
  build: {
    outDir: 'dist',
  }
})
