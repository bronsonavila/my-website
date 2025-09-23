import './globals.css'
import { Analytics } from '@vercel/analytics/react'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { ReactNode } from 'react'
import ClientLayout from './ClientLayout'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  description: 'Personal website of Bronson Avila — an attorney-turned-software engineer residing in Hawaii.',
  title: {
    default: 'Bronson Avila',
    template: '%s | Bronson Avila'
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
      </head>

      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <ClientLayout>{children}</ClientLayout>

        <Analytics />
      </body>
    </html>
  )
}
