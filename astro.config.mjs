import react from '@astrojs/react'
import sanity from '@sanity/astro'
import { defineConfig } from 'astro/config'
import { loadEnv } from 'vite'

const env = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), '')
const projectId = env.PUBLIC_SANITY_PROJECT_ID || 'replace-me'
const dataset = env.PUBLIC_SANITY_DATASET || 'production'

export default defineConfig({
  output: 'static',
  vite: {
    server: {
      proxy: {
        '/__sanity-pdf': {
          target: 'https://cdn.sanity.io',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/__sanity-pdf/, ''),
        },
      },
    },
  },
  integrations: [
    react(),
    sanity({
      projectId,
      dataset,
      apiVersion: '2026-03-01',
      useCdn: false,
      token: env.SANITY_API_READ_TOKEN || undefined,
    }),
  ],
})
