import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    include: ['axios', 'js-cookie', 'jwt-decode']
  },
  resolve: {
    alias: {
      // Ensure axios uses the correct adapter
      'axios/lib/adapters/fetch': 'axios/lib/adapters/xhr'
    }
  }
})
