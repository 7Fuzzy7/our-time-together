import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/our-time-together/', // ajuste se seu repo tiver outro nome/capitalização
})
