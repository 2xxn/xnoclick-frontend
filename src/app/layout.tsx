import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TinyXNO - URL Shortener',
  description: 'A URL shortener service with earnings tracking capabilities',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="dark">
      <body>{children}</body>
    </html>
  )
}
