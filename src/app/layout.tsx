import './globals.css'
import { Analytics } from '@vercel/analytics/react'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { ReactNode } from 'react'
import { siteMetadata } from '@/lib/metadata'
import ClientLayout from './ClientLayout'
import StructuredData from '@/components/StructuredData'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: { canonical: './' },
  description: siteMetadata.description,
  metadataBase: new URL(siteMetadata.siteUrl),
  openGraph: {
    description: siteMetadata.description,
    images: [{ url: siteMetadata.siteImage, width: 512, height: 512 }],
    locale: 'en_US',
    siteName: siteMetadata.title,
    title: siteMetadata.title,
    type: 'website',
    url: './'
  },
  robots: { follow: true, index: true },
  title: { default: siteMetadata.title, template: `%s | ${siteMetadata.title}` },
  twitter: {
    card: 'summary_large_image',
    creator: siteMetadata.authorUsername,
    description: siteMetadata.description,
    images: [siteMetadata.siteImage],
    title: siteMetadata.title
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="color-scheme" content="dark" />

        <link rel="preconnect" href="https://images.ctfassets.net" crossOrigin="anonymous" />

        <StructuredData />
      </head>

      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <ClientLayout>{children}</ClientLayout>

        <Analytics />
      </body>
    </html>
  )
}
