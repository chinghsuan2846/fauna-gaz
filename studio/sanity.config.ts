import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './schemaTypes'

const projectId = import.meta.env.SANITY_STUDIO_PROJECT_ID || 'replace-me'
const dataset = import.meta.env.SANITY_STUDIO_DATASET || 'production'
const singletonTypes = new Set(['siteSettings'])

const structure = (S: any) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site settings')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      ...S.documentTypeListItems().filter((item: any) => !singletonTypes.has(item.getId() ?? '')),
    ])

export default defineConfig({
  name: 'default',
  title: 'Fauna Gaz',
  projectId,
  dataset,
  plugins: [structureTool({ structure }), visionTool()],
  schema: {
    types: schemaTypes,
  },
})
