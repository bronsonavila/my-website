'use client'

import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle, DialogClose } from '@/components/ui/dialog'
import { ReactNode, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { useGalleryImages } from '@/hooks/useGalleryImages'
import { useGalleryNavigation } from '@/hooks/useGalleryNavigation'
import { useGalleryPreloading } from '@/hooks/useGalleryPreloading'
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation'
import { useResolvedImageSource } from '@/hooks/useResolvedImageSource'
import NextImage from 'next/image'

export function GalleryDialog({ slug, title, children }: { slug: string; title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)

  const { images, index, setIndex, current } = useGalleryImages(slug, open)
  const { goToPreviousImage, goToNextImage, lastDirectionRef, preloadRunIdRef } = useGalleryNavigation(images, setIndex)
  const { currentSrc, isCurrentImageLoaded } = useResolvedImageSource(current)

  useGalleryPreloading({
    images,
    index,
    isCurrentImageLoaded,
    lastDirectionRef,
    open,
    preloadRunIdRef
  })

  useKeyboardNavigation(open, goToPreviousImage, goToNextImage)

  // Blur the focused element when the dialog is closed (prevents a lingering focus ring).
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setTimeout(() => {
        if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
      })
    }

    setOpen(isOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {children}

      <DialogContent
        className="bg-background border-none p-0 shadow-none"
        aria-describedby={undefined}
        onOpenAutoFocus={(event) => event.preventDefault()}
        onCloseAutoFocus={(event) => event.preventDefault()}
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>

        <div className="relative mx-auto aspect-[3/2] max-h-[65dvh] w-[92vw] max-w-7xl outline-none">
          {(!current || !isCurrentImageLoaded || !currentSrc) && <Skeleton className="absolute inset-0" />}

          {current && isCurrentImageLoaded && currentSrc && (
            <NextImage
              alt={current.description || title}
              className="object-contain"
              fetchPriority="high"
              fill
              sizes="92vw"
              src={currentSrc}
              unoptimized
            />
          )}

          {images && images.length > 0 && (
            <div className="bg-background text-muted-foreground absolute -top-9 right-0 left-0 p-2 text-center text-sm shadow-[0_-1px_2px_0px_rgba(0,0,0,0.4)]">
              {index + 1} of {images.length}
            </div>
          )}

          <DialogClose className="ring-offset-background focus-visible:ring-ring absolute -top-9 right-0 rounded p-2 opacity-80 transition-opacity hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2">
            <X className="h-5 w-5" />

            <span className="sr-only">Close</span>
          </DialogClose>

          <button
            aria-label="Previous"
            className="bg-background/70 hover:bg-background absolute top-1/2 left-2 -translate-y-1/2 rounded p-2 backdrop-blur disabled:opacity-40"
            disabled={!images || images.length <= 1}
            onClick={goToPreviousImage}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            aria-label="Next"
            className="bg-background/70 hover:bg-background absolute top-1/2 right-2 -translate-y-1/2 rounded p-2 backdrop-blur disabled:opacity-40"
            disabled={!images || images.length <= 1}
            onClick={goToNextImage}
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {current?.description && (
            <div className="bg-background text-muted-foreground absolute top-full right-0 left-0 p-2 text-center text-sm shadow-[0_1px_2px_0px_rgba(0,0,0,0.4)]">
              {current.description}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
