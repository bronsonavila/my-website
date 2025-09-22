import { Dispatch, SetStateAction, useCallback, useRef } from 'react'
import type { GalleryImage } from '@/lib/gallery-cache'

// Provides previous/next navigation actions and tracks last navigation direction.
export function useGalleryNavigation(images: GalleryImage[] | null, setIndex: Dispatch<SetStateAction<number>>) {
  const lastDirectionRef = useRef<'next' | 'prev' | null>(null)
  const preloadRunIdRef = useRef<number>(0)

  const goToPreviousImage = useCallback(() => {
    if (!images) return

    lastDirectionRef.current = 'prev'
    preloadRunIdRef.current++

    setIndex((i) => (i === 0 ? images.length - 1 : i - 1))
  }, [images, setIndex])

  const goToNextImage = useCallback(() => {
    if (!images) return

    lastDirectionRef.current = 'next'
    preloadRunIdRef.current++

    setIndex((i) => (i === images.length - 1 ? 0 : i + 1))
  }, [images, setIndex])

  return { goToPreviousImage, goToNextImage, lastDirectionRef, preloadRunIdRef }
}
