'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { ExternalLink } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useState } from 'react'
import Image from 'next/image'
import styles from './components.module.css'

type ProjectCardProps = {
  description: string
  imageUrl?: string
  name: string
  technologies: string[]
  url: string
}

export function ProjectCard({ description, imageUrl, name, technologies, url }: ProjectCardProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <div
      className={cn(
        'group relative flex gap-4 transition-all sm:grid sm:grid-cols-8 sm:gap-4 lg:hover:!opacity-100',
        styles.projectCard
      )}
    >
      {imageUrl && (
        <a
          aria-label={`${name} (opens in a new tab)`}
          className="border-border group/image relative block h-14 w-20 shrink-0 overflow-hidden rounded border shadow-md transition-shadow sm:col-span-2 sm:aspect-[3/2] sm:h-auto sm:w-auto"
          href={url}
          rel="noreferrer noopener"
          tabIndex={-1}
          target="_blank"
        >
          {!isLoaded && <Skeleton className="absolute inset-0" />}

          <Image
            alt={name}
            className="object-cover brightness-90"
            fill
            onLoad={() => setIsLoaded(true)}
            sizes="(min-width: 640px) 150px, 80px"
            src={imageUrl}
          />
        </a>
      )}

      <div className="z-10 sm:col-span-6 md:pt-2">
        <h3>
          <a
            aria-label={`${name} (opens in a new tab)`}
            className={cn(
              'text-foreground focus-visible:text-primary inline-flex items-baseline text-base leading-tight font-semibold hover:underline',
              styles.title
            )}
            href={url}
            rel="noreferrer noopener"
            target="_blank"
          >
            <span className="inline-flex gap-2">
              {name} <ExternalLink className="inline-block h-4 w-4 shrink-0" />
            </span>
          </a>
        </h3>

        <p className="text-muted-foreground mt-2 text-sm leading-normal">{description}</p>

        <ul className="mt-2 flex flex-wrap" aria-label="Technologies used">
          {technologies.map((tech) => (
            <li key={tech} className="mt-2 mr-1.5">
              <Badge variant="secondary">{tech}</Badge>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
