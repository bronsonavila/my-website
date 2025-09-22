import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/lib/contentful'
import { Asset, type EntryFields, type EntrySkeletonType } from 'contentful'

type GalleryImageSkeleton = EntrySkeletonType<
  {
    description?: EntryFields.Text
    image?: unknown
    title?: EntryFields.Text
  },
  'galleryImage'
>

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const { searchParams } = new URL(req.url)

  const fm = searchParams.get('fm')
  const q = searchParams.get('q')
  const w = searchParams.get('w')

  const galleries = await client.getEntries({ content_type: 'gallery', 'fields.slug': slug })

  if (galleries.items.length === 0) return NextResponse.json({ images: [] })

  const gallery = galleries.items[0]

  const images = await client.getEntries<GalleryImageSkeleton>({
    content_type: 'galleryImage',
    links_to_entry: gallery.sys.id
  })

  const normalized = images.items
    .slice()
    .reverse()
    .map((img) => {
      const asset = img.fields.image as Asset | undefined
      const url = asset?.fields?.file?.url

      if (!url) return null

      const imageUrl = new URL(`https:${url}`)

      if (fm) imageUrl.searchParams.set('fm', fm)
      if (q) imageUrl.searchParams.set('q', q)
      if (w) imageUrl.searchParams.set('w', w)

      return {
        description: (img.fields.description as string | undefined) ?? '',
        id: img.sys.id,
        title: (img.fields.title as string | undefined) ?? '',
        url: imageUrl.toString()
      }
    })
    .filter((v) => v !== null)

  return NextResponse.json({ images: normalized })
}
