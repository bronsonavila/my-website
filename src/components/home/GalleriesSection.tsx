import { Asset } from 'contentful'
import { client } from '@/lib/contentful'
import { GalleryDialog } from '@/components/GalleryDialog'
import { GalleryListItem } from '@/components/GalleryListItem'
import { GalleryPreloader } from '../GalleryPreloader'
import { SectionHeading } from './SectionHeading'
import type { EntryFieldTypes, EntrySkeletonType } from 'contentful'

type GalleryData = {
  alt: string
  caption: string | undefined
  id: string
  slug: string
  title: string
  url: string
}

interface GallerySkeleton extends EntrySkeletonType {
  contentTypeId: 'gallery'
  fields: {
    featured_image: EntryFieldTypes.AssetLink
    slug: EntryFieldTypes.Symbol
    title: EntryFieldTypes.Symbol
  }
}

const GALLERY_YEARS: Record<string, string> = {
  kyiv: '2014',
  chernobyl: '2014',
  'appalachian-trail': '2016'
}

async function getGalleries() {
  const galleries = await client.getEntries<GallerySkeleton>({
    content_type: 'gallery',
    order: ['fields.title']
  })

  return galleries.items
}

export async function GalleriesSection() {
  const galleries = await getGalleries()

  const galleriesData = galleries
    .map((gallery): GalleryData | null => {
      const asset = gallery.fields.featured_image as Asset | undefined
      const url = asset?.fields?.file?.url

      if (!url) return null

      const slug = gallery.fields.slug as string

      return {
        alt: (asset.fields?.description as string) || (asset.fields?.title as string) || '',
        caption: GALLERY_YEARS[slug],
        id: gallery.sys.id,
        slug,
        title: gallery.fields.title as string,
        url: `https:${url}`
      }
    })
    .filter((item): item is GalleryData => item !== null)

  const gallerySlugs = galleriesData.map((item) => item.slug)

  return (
    <section>
      <GalleryPreloader slugs={gallerySlugs} />
      <SectionHeading>Photo Galleries</SectionHeading>

      <ul className="space-y-9">
        {galleriesData.map(
          (item) =>
            item && (
              <li key={item.id}>
                <GalleryDialog slug={item.slug} title={item.caption ? `${item.title} · ${item.caption}` : item.title}>
                  <GalleryListItem title={item.title} caption={item.caption} imageUrl={item.url} alt={item.alt} />
                </GalleryDialog>
              </li>
            )
        )}
      </ul>
    </section>
  )
}
