import { useEffect, useRef, useState } from 'react'
import { getOrCreateImageBlobUrl, type GalleryImage } from '@/lib/gallery-cache'

// Resolves the current image to a blob URL from CacheStorage and exposes loading state.
export function useResolvedImageSource(current: GalleryImage | null) {
  const [currentSrc, setCurrentSrc] = useState<string | null>(null)
  const [isCurrentImageLoaded, setIsCurrentImageLoaded] = useState(false)

  const currentBlobUrlRef = useRef<string | null>(null)

  useEffect(() => {
    let cancelled = false

    // Delay showing the loading state to avoid a flicker of the skeleton when the image is already cached.
    const loadingTimeout = setTimeout(() => {
      if (cancelled) return

      setCurrentSrc(null)
      setIsCurrentImageLoaded(false)
    }, 100)

    ;(async () => {
      if (!current) {
        if (currentBlobUrlRef.current) {
          URL.revokeObjectURL(currentBlobUrlRef.current)

          currentBlobUrlRef.current = null
        }

        setCurrentSrc(null)

        return
      }

      const blobUrl = await getOrCreateImageBlobUrl(current.url)

      if (cancelled) return

      clearTimeout(loadingTimeout)

      if (blobUrl) {
        if (currentBlobUrlRef.current && currentBlobUrlRef.current !== blobUrl) {
          URL.revokeObjectURL(currentBlobUrlRef.current)
        }

        currentBlobUrlRef.current = blobUrl

        setCurrentSrc(blobUrl)
      } else {
        if (currentBlobUrlRef.current) {
          URL.revokeObjectURL(currentBlobUrlRef.current)

          currentBlobUrlRef.current = null
        }

        setCurrentSrc(current.url)
      }

      setIsCurrentImageLoaded(true)
    })()

    return () => {
      cancelled = true

      clearTimeout(loadingTimeout)
    }
  }, [current])

  useEffect(() => {
    return () => {
      if (currentBlobUrlRef.current) {
        URL.revokeObjectURL(currentBlobUrlRef.current)

        currentBlobUrlRef.current = null
      }
    }
  }, [])

  return { currentSrc, isCurrentImageLoaded }
}
