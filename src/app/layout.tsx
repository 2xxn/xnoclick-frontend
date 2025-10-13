import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  metadataBase: new URL('https://xno.click'),
  title: 'xno.click - get paid from impressions on your links!',
  description: 'An URL shortener that pays you in cryptocurrency for every impression on your links. Share your links and earn!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="dark">
      <body>
        {children}
      <Toaster
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
      </body>
    </html>
  )
}
