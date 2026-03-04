import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: "/ParaHook_Configurator/",
  plugins: [react()],
})