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
        className="bg-background border-none p-0 shadow-xl"
        aria-describedby={undefined}
        onOpenAutoFocus={(event) => event.preventDefault()}
        onCloseAutoFocus={(event) => event.preventDefault()}
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>

        <div className="relative mx-auto w-[100vw] max-w-7xl">
          <div className="grid grid-cols-[auto_1fr_auto] grid-rows-[auto_1fr_auto] items-center gap-x-3 gap-y-2 p-3 sm:gap-x-4 sm:gap-y-3 sm:p-4 lg:gap-x-6 lg:gap-y-4 lg:p-6">
            {images && images.length > 0 && (
              <div className="text-muted-foreground col-[2] row-[1] text-center text-sm">
                {index + 1} of {images.length}
              </div>
            )}

            <button
              aria-label="Previous"
              className="bg-background/70 hover:bg-background col-[1] row-[2] justify-self-start rounded p-2 backdrop-blur disabled:opacity-40"
              disabled={!images || images.length <= 1}
              onClick={goToPreviousImage}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="relative col-[2] row-[2] mx-auto aspect-[3/2] max-h-[58dvh] w-full overflow-hidden rounded-md outline-none lg:max-h-none">
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
            </div>

            <button
              aria-label="Next"
              className="bg-background/70 hover:bg-background col-[3] row-[2] justify-self-end rounded p-2 backdrop-blur disabled:opacity-40"
              disabled={!images || images.length <= 1}
              onClick={goToNextImage}
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <DialogClose className="ring-offset-background focus-visible:ring-ring col-[3] row-[1] justify-self-end rounded p-2 opacity-80 transition-opacity hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2">
              <X className="h-5 w-5" />

              <span className="sr-only">Close</span>
            </DialogClose>

            <div className="relative col-span-3 row-[3] flex h-0 min-h-[36px] justify-center">
              <div className="bg-background text-muted-foreground absolute w-[100vw] max-w-7xl px-6 pt-2 pb-5 text-center">
                <p className="line-clamp-3 text-sm">{current?.description}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
