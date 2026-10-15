import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Three design directions, each its own page, sharing content and quote logic in src/shared.
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@shared': resolve(__dirname, 'src/shared') } },
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        a: resolve(__dirname, 'a/index.html'),
        b: resolve(__dirname, 'b/index.html'),
        c: resolve(__dirname, 'c/index.html'),
      },
    },
  },
})
