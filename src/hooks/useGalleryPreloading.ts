import { useEffect } from 'react'
import { ensureImageCached, type GalleryImage } from '@/lib/gallery-cache'

// Warms next/previous neighbors and preloads remaining images after current is ready.
export function useGalleryPreloading(options: {
  open: boolean
  images: GalleryImage[] | null
  index: number
  isCurrentImageLoaded: boolean
  lastDirectionRef: React.MutableRefObject<'next' | 'prev' | null>
  preloadRunIdRef: React.MutableRefObject<number>
}) {
  const { open, images, index, isCurrentImageLoaded, lastDirectionRef, preloadRunIdRef } = options

  useEffect(() => {
    if (!isCurrentImageLoaded || !images || images.length <= 1) return

    const nextIndex = (index + 1) % images.length
    const previousIndex = (index - 1 + images.length) % images.length

    const nextImage = images[nextIndex]
    const previousImage = images[previousIndex]

    const direction = lastDirectionRef.current

    if (direction === 'next') {
      ensureImageCached(nextImage?.url)
    } else if (direction === 'prev') {
      ensureImageCached(previousImage?.url)
    } else {
      ensureImageCached(nextImage?.url)
      ensureImageCached(previousImage?.url)
    }
  }, [images, index, isCurrentImageLoaded, lastDirectionRef])

  // Background preloading loop for remaining images following last navigation direction.
  useEffect(() => {
    if (!open || !isCurrentImageLoaded || !images || images.length <= 1) return

    const direction = lastDirectionRef.current || 'next' // Default to next if no direction is set.
    const runId = preloadRunIdRef.current
    const total = images.length

    let i = index

    const advance = (j: number) => {
      if (direction === 'next') return (j + 1) % total

      return (j - 1 + total) % total
    }

    const startFrom = advance(i)

    let cancelled = false

    const run = async () => {
      let cursor = startFrom

      while (!cancelled && runId === preloadRunIdRef.current) {
        const img = images[cursor]

        if (img?.url) await ensureImageCached(img.url)

        const nextCursor = advance(cursor)

        if (nextCursor === i) break

        cursor = nextCursor
      }
    }

    void run()

    return () => {
      cancelled = true
    }
  }, [open, images, index, isCurrentImageLoaded, lastDirectionRef, preloadRunIdRef])
}
