import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: "/ParaHook_Configurator/",
  plugins: [react()],
  server: {
    proxy: {
      '/pubparts-source': {
        target: 'https://pubparts.xyz',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/pubparts-source/u, ''),
      },
    },
  },
})
