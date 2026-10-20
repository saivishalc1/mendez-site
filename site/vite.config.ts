import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

const base = process.env.BASE_PATH || '/'

/**
 * Per page: preload the hero photo (responsive WebP) and the headline font so the
 * first screen paints without waiting for CSS and JS to discover them.
 */
const PRELOAD: Record<string, { hero: string; sizes: string; fonts: RegExp[] }> = {
  a: { hero: 'street-truck', sizes: '(min-width: 768px) 54vw, 100vw', fonts: [/anton-latin-400-normal.*\.woff2$/, /inter-latin-wght-normal.*\.woff2$/] },
  b: { hero: 'snow-truck', sizes: '(min-width: 1024px) 44vw, 100vw', fonts: [/instrument-serif-latin-400-(normal|italic).*\.woff2$/, /inter-latin-wght-normal.*\.woff2$/] },
  c: { hero: 'street-truck', sizes: '100vw', fonts: [/archivo-latin-wdth-normal.*\.woff2$/] },
}

function preloadHints(): Plugin {
  return {
    name: 'mv-preload-hints',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        const page = ctx.path.match(/^\/([abc])\//)?.[1]
        if (!page) return html
        const cfg = PRELOAD[page]
        const img = (s: string) => `${base}img/${cfg.hero}${s}.webp`
        const tags = [
          {
            tag: 'link',
            attrs: {
              rel: 'preload',
              as: 'image',
              type: 'image/webp',
              fetchpriority: 'high',
              imagesrcset: `${img('-xs')} 640w, ${img('-sm')} 900w, ${img('-md')} 1280w, ${img('')} 1920w`,
              imagesizes: cfg.sizes,
            },
            injectTo: 'head-prepend' as const,
          },
        ]
        const files = Object.keys(ctx.bundle ?? {})
        for (const re of cfg.fonts) {
          for (const f of files.filter((x) => re.test(x))) {
            tags.push({ tag: 'link', attrs: { rel: 'preload', as: 'font', type: 'font/woff2', crossorigin: '', href: `${base}${f}` }, injectTo: 'head-prepend' } as never)
          }
        }
        return { html: html.replace(/\s*<link rel="preload" as="image" href="[^"]*" \/>/, ''), tags }
      },
    },
  }
}

// Three design directions, each its own page, sharing content and quote logic in src/shared.
export default defineConfig({
  base,
  plugins: [react(), tailwindcss(), preloadHints()],
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
