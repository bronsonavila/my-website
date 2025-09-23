'use client'

import { cn } from '@/lib/utils'
import { DialogTrigger } from '@/components/ui/dialog'
import { HTMLAttributes, forwardRef, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import Image from 'next/image'

export type GalleryListItemProps = {
  alt: string
  caption?: string
  imageUrl: string
  title: string
} & HTMLAttributes<HTMLDivElement>

const GalleryListItem = forwardRef<HTMLDivElement, GalleryListItemProps>(
  ({ alt, className, caption, imageUrl, title, ...props }, ref) => {
    const [isHovered, setIsHovered] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)

    return (
      <div
        className={cn(
          'relative flex h-auto w-full cursor-default justify-start gap-4 transition-all sm:grid sm:grid-cols-8 sm:gap-4',
          className
        )}
        ref={ref}
        {...props}
      >
        <DialogTrigger asChild>
          <button
            aria-label={`Open ${title} gallery`}
            className="border-border relative order-1 h-14 w-20 shrink-0 cursor-pointer overflow-hidden rounded border bg-transparent p-0 shadow-md sm:col-span-2 sm:aspect-[3/2] sm:h-auto sm:w-auto"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            tabIndex={-1}
            type="button"
          >
            {!isLoaded && <Skeleton className="absolute inset-0" />}

            <Image
              alt={alt}
              className="object-cover brightness-90"
              fill
              onLoad={() => setIsLoaded(true)}
              sizes="(min-width: 640px) 150px, 80px"
              src={imageUrl}
            />
          </button>
        </DialogTrigger>

        <div className="z-10 order-2 flex flex-col justify-center text-left sm:col-span-6">
          <DialogTrigger asChild>
            <button
              className={`text-foreground w-fit cursor-pointer bg-transparent p-0 text-left text-base leading-tight font-semibold hover:underline ${
                isHovered ? 'underline' : ''
              }`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              type="button"
            >
              {title}
            </button>
          </DialogTrigger>

          {caption && <p className="text-muted-foreground mt-2 text-left text-sm leading-normal">{caption}</p>}
        </div>
      </div>
    )
  }
)

GalleryListItem.displayName = 'GalleryListItem'

export { GalleryListItem }
