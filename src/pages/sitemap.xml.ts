import type { APIRoute } from 'astro'
import { sanityClient } from 'sanity:client'
import { isQuarterlyArticleHidden } from '../lib/contentAdapter'
import { articleSlugsQuery } from '../lib/queries.js'

const defaultSiteUrl = 'https://faunagaz.com'
const staticPaths = ['/', '/donate/', '/privacy-policy/', '/terms-of-use/']

function escapeXml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}

function absoluteUrl(pathname: string, site?: URL) {
  return new URL(pathname, site ?? defaultSiteUrl).toString()
}

export const GET: APIRoute = async ({ site }) => {
  const urls = new Set(staticPaths.map((pathname) => absoluteUrl(pathname, site)))

  if (import.meta.env.PUBLIC_SANITY_PROJECT_ID) {
    try {
      const articles = await sanityClient.fetch(articleSlugsQuery)
      for (const article of articles) {
        if (!isQuarterlyArticleHidden(article)) urls.add(absoluteUrl(`/quarterly/${article.slug}/`, site))
      }
    } catch {
      // Keep the core site URLs available even when the CMS is temporarily unavailable.
    }
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...urls].sort().map((url) => `  <url><loc>${escapeXml(url)}</loc></url>`).join('\n')}
</urlset>`

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  })
}
