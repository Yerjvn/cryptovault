import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/CryptoVault/',  // Имя репозитория для GitHub Pages
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist'
  }
})

