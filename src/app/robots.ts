import type { MetadataRoute } from 'next'

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
const siteUrl = rawSiteUrl.replace(/\/+$/, '')

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ allow: ['/', '/index.html'], disallow: ['/*'], userAgent: '*' }],
    sitemap: [`${siteUrl}/sitemap.xml`]
  }
}
