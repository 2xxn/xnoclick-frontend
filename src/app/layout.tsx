import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  metadataBase: new URL("https://xno.click"),
  title: {
    default: "xno.click — Earn Crypto from Every Click & Impression",
    template: "%s | xno.click",
  },
  description:
    "Shorten links, share them, and earn cryptocurrency for every impression and click. xno.click is the next-gen crypto monetization tool for creators, marketers, and influencers.",
  keywords: [
    "crypto link shortener",
    "earn crypto online",
    "get paid per click",
    "URL shortener that pays",
    "make money sharing links",
    "crypto impressions",
  ],
  openGraph: {
    title: "xno.click — Earn Crypto from Every Click & Impression",
    description:
      "Turn your links into income. Shorten URLs, share anywhere, and get paid in cryptocurrency for impressions and clicks.",
    url: "https://xno.click",
    siteName: "xno.click",
    images: [
      {
        url: "/preview.png",
        width: 1200,
        height: 630,
        alt: "xno.click — Earn Crypto from Every Click & Impression",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "xno.click — Earn Crypto from Every Click & Impression",
    description:
      "Share your links and get paid in crypto for every impression and click.",
    creator: "@nx2xno",
    images: ["/preview.png"],
  },
  alternates: {
    canonical: "https://xno.click",
  },
  icons: {
    icon: "/favicon.png",
  },
};


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
