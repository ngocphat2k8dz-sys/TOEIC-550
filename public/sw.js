const cacheName = 'toeic-static-v1'
const root = new URL('./', self.location.href)
const appShell = root.href
const publicAssets = ['favicon.svg', 'images/study-hero.webp']

function staticAsset(url) {
  if (url.origin !== root.origin || !url.pathname.startsWith(root.pathname)) return false
  const file = url.pathname.slice(root.pathname.length)
  return file.startsWith('assets/') || file.startsWith('listening/') || publicAssets.includes(file)
}

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(cacheName)
    const html = await fetch(appShell, { cache: 'reload' })
    if (!html.ok) throw new Error('Study app shell unavailable')
    const text = await html.clone().text()
    const assets = [...text.matchAll(/(?:src|href)="([^"]+\/assets\/[^"]+|\/assets\/[^"]+)"/g)]
      .map(match => new URL(match[1], root).href)
    await cache.addAll([...assets, ...publicAssets.map(file => new URL(file, root).href)])
    const cssFiles = await Promise.all(assets.filter(file => file.endsWith('.css')).map(async file => (await cache.match(file)).text()))
    const fonts = cssFiles.flatMap(css => [...css.matchAll(/url\(["']?([^"')]+\.woff2)["']?\)/g)]
      .map(match => new URL(match[1], root).href))
    await cache.addAll([...new Set(fonts)].filter(file => staticAsset(new URL(file))))
    await cache.put(appShell, html)
    await self.skipWaiting()
  })())
})

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys()
    await Promise.all(names.filter(name => name.startsWith('toeic-static-') && name !== cacheName).map(name => caches.delete(name)))
    await self.clients.claim()
  })())
})

async function navigate(request) {
  const cache = await caches.open(cacheName)
  try {
    const response = await fetch(request)
    if (response.ok && response.headers.get('content-type')?.includes('text/html')) await cache.put(appShell, response.clone())
    return response
  } catch {
    return await cache.match(appShell) ?? Response.error()
  }
}

async function asset(request) {
  const cache = await caches.open(cacheName)
  const range = request.headers.get('range')
  const source = new Request(request.url, { credentials: 'same-origin' })
  const response = await cache.match(source) ?? await fetch(source).then(async result => {
    if (result.ok && result.status === 200) await cache.put(source, result.clone())
    return result
  })
  if (!range || !response.ok) return response
  const selection = /^bytes=(\d+)-(\d*)$/.exec(range)
  if (!selection) return fetch(request)
  const bytes = await response.arrayBuffer()
  const start = Number(selection[1])
  const end = selection[2] ? Math.min(Number(selection[2]), bytes.byteLength - 1) : bytes.byteLength - 1
  if (start > end) return new Response(null, { status: 416, headers: { 'Content-Range': 'bytes */' + bytes.byteLength } })
  return new Response(bytes.slice(start, end + 1), { status: 206, headers: {
    'Accept-Ranges': 'bytes', 'Content-Type': response.headers.get('Content-Type') || 'audio/mpeg',
    'Content-Length': String(end - start + 1), 'Content-Range': 'bytes ' + start + '-' + end + '/' + bytes.byteLength,
  } })
}

self.addEventListener('fetch', event => {
  const { request } = event
  if (request.method !== 'GET') return
  const url = new URL(request.url)
  if (request.mode === 'navigate' && url.origin === root.origin &&
      (url.pathname === root.pathname || url.pathname === root.pathname + 'index.html')) {
    event.respondWith(navigate(request))
  } else if (staticAsset(url)) {
    event.respondWith(asset(request))
  }
})
