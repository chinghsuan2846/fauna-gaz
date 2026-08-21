import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { schemaTypes } from './schemaTypes'

const projectId = import.meta.env.SANITY_STUDIO_PROJECT_ID || 'replace-me'
const dataset = import.meta.env.SANITY_STUDIO_DATASET || 'production'

export default defineConfig({
  name: 'default',
  title: 'Fauna Gaz',
  projectId,
  dataset,
  plugins: [visionTool()],
  schema: {
    types: schemaTypes,
  },
})
