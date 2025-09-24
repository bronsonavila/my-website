'use client'

import { ensureImageCached, getApiUrl, putGalleryToCache, type GalleryImage } from '@/lib/gallery-cache'
import { useEffect } from 'react'

async function fetchAndCacheFirstImage(slug: string) {
  try {
    const response = await fetch(getApiUrl(slug))

    if (!response.ok) return

    const responseForCache = response.clone()
    const data = (await response.json()) as { images: GalleryImage[] }

    await Promise.all([
      putGalleryToCache(slug, responseForCache),
      (async () => {
        const firstImage = data.images?.[0]

        if (firstImage?.url) await ensureImageCached(firstImage.url)
      })()
    ])
  } catch {
    // Preloading is not critical – OK to fail silently.
  }
}

// Warm the cache by preloading each gallery's first image.
// Runs once on or after window load; not used inside the gallery dialog.
export function GalleriesFirstImagePreloader({ slugs }: { slugs: string[] }) {
  useEffect(() => {
    const preload = () => Promise.all(slugs.map(fetchAndCacheFirstImage))

    if (document.readyState === 'complete') {
      preload()
    } else {
      window.addEventListener('load', preload, { once: true })

      return () => window.removeEventListener('load', preload)
    }
  }, [slugs])

  return null
}
