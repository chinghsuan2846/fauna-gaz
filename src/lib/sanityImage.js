import { createImageUrlBuilder } from '@sanity/image-url'

const builder = createImageUrlBuilder({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID || 'replace-me',
  dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
})

export function sanityImageUrl(source, options = {}) {
  if (!source?.asset) return undefined

  return builder.image(source).auto('format').fit('max').width(options.width ?? 1600).url()
}
