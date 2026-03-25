import type { Metadata } from 'next'
import { Cormorant_Garamond, Outfit } from 'next/font/google'
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
    'Join executive leaders, policymakers, and diplomats at the SICC AI Continental Summit on Cybersecurity & AI — 11–15 May 2026, The Bay Hotel, Cape Town, South Africa.',
  keywords: [
    'cybersecurity summit Africa',
    'AI executives',
    'Cape Town 2026',
    'SICC AI',
    'siccai2026',
    'continental summit',
  ],
  openGraph: {
    title: 'SICC AI Continental Summit on Cybersecurity & AI — Cape Town 2026',
    description:
      'An executive summit for C-suite leaders, policymakers, and diplomats across Africa and internationally.',
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
