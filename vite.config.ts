/// <reference types="vite/client" />

import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'monaco-editor': ['monaco-editor'],
        },
      },
    },
    worker: {
      format: 'es',
      plugins: []
    }
  },
  optimizeDeps: {
    include: ['monaco-editor/esm/vs/language/json/json.worker', 'monaco-editor/esm/vs/editor/editor.worker']
  },
  define: {
    // Handle browser polyfills
    'process.env': {},
    'process.platform': JSON.stringify('browser'),
    'process.version': JSON.stringify(''),
  }
})
