import { siteMetadata } from '@/lib/metadata'
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', disallow: '/' },
    sitemap: `${siteMetadata.siteUrl}/sitemap.xml`
  }
}
