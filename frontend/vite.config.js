import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import nodePolyfills from 'rollup-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills()],
  define: {
    'process.env': {},
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
    },
    build: {
      sourcemap: true,
    },
  },
})
