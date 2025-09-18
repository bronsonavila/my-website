import { useEffect, useMemo, useState } from 'react'
import { getApiUrl, getGalleryFromCache, putGalleryToCache, type GalleryImage } from '@/lib/gallery-cache'

// Loads gallery images on open (prefers Cache API), tracks index, and exposes the current image.
export function useGalleryImages(slug: string, open: boolean) {
  const [images, setImages] = useState<GalleryImage[] | null>(null)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!open || images) return
    ;(async () => {
      const cachedData = await getGalleryFromCache(slug)

      if (cachedData) {
        setImages(cachedData.images)
        setIndex(0)

        return
      }

      const response = await fetch(getApiUrl(slug), { cache: 'no-store' })

      if (!response.ok) return

      await putGalleryToCache(slug, response.clone())

      const data = (await response.json()) as { images: GalleryImage[] }

      setImages(data.images)
      setIndex(0)
    })()
  }, [open, images, slug])

  useEffect(() => {
    if (!open) {
      setImages(null)
      setIndex(0)
    }
  }, [open])

  const current: GalleryImage | null = useMemo(() => (images ? (images[index] ?? null) : null), [images, index])

  return { images, index, setIndex, current }
}
