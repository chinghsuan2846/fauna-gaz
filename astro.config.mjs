import react from '@astrojs/react'
import sanity from '@sanity/astro'
import { defineConfig } from 'astro/config'

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID || 'replace-me'
const dataset = process.env.PUBLIC_SANITY_DATASET || 'production'

export default defineConfig({
  output: 'static',
  integrations: [
    react(),
    sanity({
      projectId,
      dataset,
      apiVersion: '2026-03-01',
      useCdn: false,
      token: process.env.SANITY_API_READ_TOKEN || undefined,
    }),
  ],
})
