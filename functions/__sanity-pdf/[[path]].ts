type PagesFunctionContext = {
  request: Request
  params: Record<string, string | string[] | undefined>
}

const forwardedRequestHeaders = [
  'accept',
  'if-modified-since',
  'if-none-match',
  'if-range',
  'range',
]

const forwardedResponseHeaders = [
  'accept-ranges',
  'cache-control',
  'content-disposition',
  'content-length',
  'content-range',
  'content-type',
  'etag',
  'expires',
  'last-modified',
]

function getAssetPath(value: string | string[] | undefined) {
  return Array.isArray(value) ? value.join('/') : value ?? ''
}

function isSanityFilePath(assetPath: string) {
  const segments = assetPath.split('/').filter(Boolean)
  return segments.length >= 4 && segments[0] === 'files' && !segments.some((segment) => segment === '.' || segment === '..')
}

export async function onRequest({ request, params }: PagesFunctionContext) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response('Method Not Allowed', {
      status: 405,
      headers: { Allow: 'GET, HEAD' },
    })
  }

  const assetPath = getAssetPath(params.path)
  if (!isSanityFilePath(assetPath)) return new Response('Not Found', { status: 404 })

  const incomingUrl = new URL(request.url)
  const upstreamUrl = new URL(`https://cdn.sanity.io/${assetPath}`)
  upstreamUrl.search = incomingUrl.search

  const headers = new Headers()
  for (const headerName of forwardedRequestHeaders) {
    const value = request.headers.get(headerName)
    if (value) headers.set(headerName, value)
  }

  try {
    const upstreamResponse = await fetch(upstreamUrl, {
      method: request.method,
      headers,
      redirect: 'follow',
    })
    const responseHeaders = new Headers()

    for (const headerName of forwardedResponseHeaders) {
      const value = upstreamResponse.headers.get(headerName)
      if (value) responseHeaders.set(headerName, value)
    }

    responseHeaders.set('Access-Control-Allow-Origin', incomingUrl.origin)
    responseHeaders.set('Vary', 'Origin')

    return new Response(request.method === 'HEAD' ? null : upstreamResponse.body, {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers: responseHeaders,
    })
  } catch {
    return new Response('PDF proxy failed', { status: 502 })
  }
}
