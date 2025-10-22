import type { MetadataRoute } from 'next'

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
const siteUrl = rawSiteUrl.replace(/\/+$/, '')

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  return [{ changeFrequency: 'monthly', lastModified: now, priority: 1, url: `${siteUrl}/` }]
}
