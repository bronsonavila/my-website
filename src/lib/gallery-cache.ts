'use client'

import { cache } from 'react'

export type GalleryImage = { id: string; url: string; title: string; description: string }

export const GALLERY_CACHE_NAME = 'gallery-images-v1' // Gallery images cache
export const GALLERY_API_CACHE_NAME = 'gallery-api-v1' // Gallery API responses cache

// Track in-flight fetch+cache operations per image URL to avoid duplicate network requests.
const INFLIGHT_CACHE_PUTS = new Map<string, Promise<void>>()

export function getApiUrl(slug: string) {
  if (typeof window === 'undefined') return `/api/galleries/${slug}`

  const width = Math.min(1920, Math.ceil(window.innerWidth * window.devicePixelRatio))

  return `/api/galleries/${slug}?w=${width}&q=65&fm=webp`
}

export async function openGalleryCache(): Promise<Cache | null> {
  if (typeof window === 'undefined' || !('caches' in window)) return null

  try {
    return await caches.open(GALLERY_CACHE_NAME)
  } catch {
    return null
  }
}

export async function openGalleryApiCache(): Promise<Cache | null> {
  if (typeof window === 'undefined' || !('caches' in window)) return null

  try {
    return await caches.open(GALLERY_API_CACHE_NAME)
  } catch {
    return null
  }
}

async function fetchAndPutToCache(imageUrl: string, cache: Cache): Promise<void> {
  const existing = INFLIGHT_CACHE_PUTS.get(imageUrl)

  if (existing) return existing

  const promise = (async () => {
    try {
      const request = new Request(imageUrl, { mode: 'cors' })
      const response = await fetch(request, { cache: 'no-store', mode: 'cors' })

      if (response.ok) await cache.put(request, response.clone())
    } catch {
      // No-op.
    } finally {
      INFLIGHT_CACHE_PUTS.delete(imageUrl)
    }
  })()

  INFLIGHT_CACHE_PUTS.set(imageUrl, promise)

  return promise
}

export async function ensureImageCached(imageUrl: string | undefined) {
  if (!imageUrl) return

  const cache = await openGalleryCache()

  if (!cache) return

  const request = new Request(imageUrl, { mode: 'cors' })
  const match = await cache.match(request)

  if (match) return

  await fetchAndPutToCache(imageUrl, cache)
}

export async function getOrCreateImageBlobUrl(imageUrl: string): Promise<string | null> {
  const cache = await openGalleryCache()

  if (!cache) return null

  const request = new Request(imageUrl, { mode: 'cors' })

  let response = await cache.match(request)

  if (!response) {
    await fetchAndPutToCache(imageUrl, cache)

    response = await cache.match(request)

    if (!response) return null
  }
  try {
    const blob = await response.blob()

    return URL.createObjectURL(blob)
  } catch {
    return null
  }
}

export const getGalleryFromCache = cache(async (slug: string): Promise<{ images: GalleryImage[] } | null> => {
  const cache = await openGalleryApiCache()

  if (!cache) return null

  const requestUrl = getApiUrl(slug)

  try {
    const response = await cache.match(requestUrl)

    if (!response) return null

    return (await response.json()) as { images: GalleryImage[] }
  } catch {
    return null
  }
})

export async function putGalleryToCache(slug: string, response: Response): Promise<void> {
  const cache = await openGalleryApiCache()

  if (!cache) return

  const requestUrl = getApiUrl(slug)

  try {
    await cache.put(requestUrl, response)
  } catch {
    // No-op.
  }
}
