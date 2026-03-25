'use client'

import { useEffect, useState } from 'react'
import styles from './Hero.module.css'

/* ─── Scroll indicator ───────────────────────────────────────────────────────── */
function ScrollIndicator() {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const onScroll = () => setHidden(window.scrollY > 100)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className={`${styles.scrollIndicator} ${hidden ? styles.hidden : ''}`}
      aria-hidden="true"
    >
      <span className={styles.scrollLabel}>Scroll</span>
      <div className={styles.scrollArrow}>
        <svg
          width="16"
          height="20"
          viewBox="0 0 16 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 1 V15 M2 10 L8 16 L14 10"
            stroke="var(--color-gold-dim)"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  )
}

/* ─── Hero ───────────────────────────────────────────────────────────────────── */
export default function Hero() {
  return (
    <section className={styles.hero} aria-label="Summit hero">
      <div className={styles.inner}>

        {/* Eyebrow */}
        <p className={styles.eyebrow}>
          Cape Town
          <span className={styles.eyebrowDot} aria-hidden="true" />
          11–15 May 2026
          <span className={styles.eyebrowDot} aria-hidden="true" />
          The Bay Hotel
        </p>

        {/* Headline */}
        <h1 className={styles.headline}>
          The Continental Summit on Cybersecurity{' '}
          <span className={styles.headlineAccent}>&amp; AI</span> for Executives
        </h1>

        {/* Subheadline — verbatim from PDF Summit Overview */}
        <p className={styles.sub}>
          A high-impact, pan-African capacity-building forum designed to strengthen
          cyber resilience, responsible AI adoption, and leadership awareness across
          governments, businesses, and institutions.
        </p>

        {/* CTAs */}
        <div className={styles.ctaRow}>
          <a
            href="https://www.siccai.org/south-africa-summit-registration/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaPrimary}
          >
            Secure Your Seat
          </a>
          <a
            href="/siccai-cape-town-summit-brochure.pdf"
            download="SICCAI-Cape-Town-Summit-2026.pdf"
            className={styles.ctaSecondary}
          >
            <svg
              className={styles.downloadIcon}
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M7 1v8M3 6l4 4 4-4M1 11h12"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Download Brochure
          </a>
        </div>

        {/* Divider */}
        <hr className={styles.rule} />

        {/* Trust stats */}
        <div className={styles.stats} role="list" aria-label="Summit highlights">
          {[
            'Pan-African Forum',
            'Executive Track',
            '5 Days · Cape Town',
          ].map((label) => (
            <div key={label} className={styles.stat} role="listitem">
              <span className={styles.statDot} aria-hidden="true" />
              <span className={styles.statText}>{label}</span>
            </div>
          ))}
        </div>

      </div>

      {/* Scroll indicator */}
      <ScrollIndicator />
    </section>
  )
}
