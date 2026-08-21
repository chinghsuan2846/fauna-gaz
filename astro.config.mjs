import react from '@astrojs/react'
import sanity from '@sanity/astro'
import { defineConfig } from 'astro/config'
import { loadEnv } from 'vite'

const env = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), '')
const projectId = env.PUBLIC_SANITY_PROJECT_ID || 'replace-me'
const dataset = env.PUBLIC_SANITY_DATASET || 'production'

export default defineConfig({
  output: 'static',
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
