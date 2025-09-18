import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/lib/contentful'
import { Asset, Entry } from 'contentful'

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const { searchParams } = new URL(req.url)

  const fm = searchParams.get('fm')
  const q = searchParams.get('q')
  const w = searchParams.get('w')

  const galleries = await client.getEntries({ content_type: 'gallery', 'fields.slug': slug })

  if (galleries.items.length === 0) return NextResponse.json({ images: [] })

  const gallery = galleries.items[0] as Entry<any>

  const images = await client.getEntries({
    content_type: 'galleryImage',
    'fields.gallery.sys.id': gallery.sys.id
  })

  const normalized = images.items
    .slice()
    .reverse()
    .map((img: Entry<any>) => {
      const asset = img.fields.image as Asset | undefined
      const url = asset?.fields?.file?.url

      if (!url) return null

      const imageUrl = new URL(`https:${url}`)

      if (fm) imageUrl.searchParams.set('fm', fm)
      if (q) imageUrl.searchParams.set('q', q)
      if (w) imageUrl.searchParams.set('w', w)

      return {
        description: (img.fields.description as string) ?? '',
        id: img.sys.id,
        title: (img.fields.title as string) ?? '',
        url: imageUrl.toString()
      }
    })
    .filter((v: any) => v !== null)

  return NextResponse.json({ images: normalized })
}
