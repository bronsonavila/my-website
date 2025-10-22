import { siteMetadata } from '@/lib/metadata'
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { allow: '/', disallow: '/resume.pdf', userAgent: '*' },
    sitemap: `${siteMetadata.siteUrl}/sitemap.xml`
  }
}
