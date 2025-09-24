import { siteMetadata } from '@/lib/metadata'

const StructuredData = () => {
  const jsonData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    author: { '@type': 'Person', name: siteMetadata.author },
    description: siteMetadata.description,
    image: { '@type': 'ImageObject', url: `${siteMetadata.siteUrl}${siteMetadata.siteImage}` },
    inLanguage: 'en-US',
    name: siteMetadata.title,
    url: siteMetadata.siteUrl
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonData) }} />
}

export default StructuredData
