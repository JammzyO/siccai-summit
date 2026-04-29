import type { Metadata } from 'next'
import { Cormorant_Garamond, Outfit } from 'next/font/google'
import Script from 'next/script'
import Nav from '@/app/components/Nav/Nav'
import Footer from '@/app/components/Footer/Footer'
import ScrollReveal from '@/app/components/ScrollReveal/ScrollReveal'
import './globals.css'

/* ─── Fonts ──────────────────────────────────────────────────────────────────── */
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display-loaded',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body-loaded',
  display: 'swap',
})

/* ─── Metadata ───────────────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: 'Continental Summit on Cybersecurity & AI | Cape Town 2026',
  description:
    'Join executive leaders, policymakers, and diplomats at the SICC AI Continental Summit on Cybersecurity & AI — 11–15 June 2026, Cape Town International Convention Centre, South Africa.',
  keywords: [
    'cybersecurity summit Africa',
    'AI executives',
    'Cape Town 2026',
    'SICC AI',
    'siccai2026',
    'continental summit',
  ],
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
  openGraph: {
    title: 'SICC AI Continental Summit on Cybersecurity & AI — Cape Town 2026',
    description:
      'An executive summit for C-suite leaders, policymakers, and diplomats across Africa and internationally. 11–15 June 2026, CTICC, Cape Town.',
    siteName: 'SICC AI',
    locale: 'en_ZA',
    type: 'website',
  },
}

/* ─── Root Layout ────────────────────────────────────────────────────────────── */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${outfit.variable}`}
    >
      {/* ── Google Ads Tag (AW-17322819400) ── */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=AW-17322819400"
        strategy="afterInteractive"
      />
      <Script id="google-ads-tag" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'AW-17322819400');
      `}</Script>
      <body>
        {/* Global noise grain overlay — fixed, pointer-events: none, z-index: 1000 */}
        <div className="noise-overlay" aria-hidden="true" />

        {/* Fixed navigation — always rendered above page content */}
        <Nav />

        {/*
          Page wrapper — padding-top matches nav height (72px) so that
          no section content is obscured by the fixed nav bar.
        */}
        <div style={{ paddingTop: '72px' }}>
          {children}
          <Footer />
        </div>

        {/* Global scroll-reveal observer — mounts once, watches .reveal elements */}
        <ScrollReveal />
      </body>
    </html>
  )
}
