import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Three design directions, each its own page, sharing content and quote logic in src/shared.
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@shared': resolve(import.meta.dirname, 'src/shared') } },
  build: {
    rollupOptions: {
      input: {
        index: resolve(import.meta.dirname, 'index.html'),
        a: resolve(import.meta.dirname, 'a/index.html'),
        b: resolve(import.meta.dirname, 'b/index.html'),
        c: resolve(import.meta.dirname, 'c/index.html'),
      },
    },
  },
})
