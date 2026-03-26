'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './DelegatesFormat.module.css'

/* ─── Data — verbatim from PDF ───────────────────────────────────────────────── */

const DELEGATES = [
  'CEOs',
  'Executive Directors',
  'Board Members',
  'International Diplomats',
  'Director Generals',
  'Regional Heads',
  'COMESA',
  'ECOWAS',
  'Chambers of Commerce',
  'Tech Vendors',
  'Opinion Leaders',
] as const

const FORMAT_ITEMS = [
  {
    index: '01',
    name:  'High-Level Keynote Sessions',
    desc:  'Expert speakers address the strategic priorities of cybersecurity and AI across African and international institutions.',
  },
  {
    index: '02',
    name:  'Hands-On Technical Workshops',
    desc:  'Practical, skills-based exercises equipping participants with applied knowledge in cybersecurity tools and AI systems.',
  },
  {
    index: '03',
    name:  'Executive & Board-Level Masterclasses',
    desc:  'Curated deep-dives designed specifically for senior executives and board members responsible for organisational risk.',
  },
  {
    index: '04',
    name:  'Policy Roundtables',
    desc:  'Structured dialogue sessions on national strategy, regional regulation, data governance, and AI policy frameworks.',
  },
  {
    index: '05',
    name:  'Live Demonstrations & Simulations',
    desc:  'Real-world cyber scenarios and AI deployments presented live to illustrate emerging threats and response approaches.',
  },
  {
    index: '06',
    name:  'Networking & Partnership Forums',
    desc:  "Dedicated sessions for cross-sector and cross-border relationship building between Africa's executive community.",
  },
] as const

/* ─── Ticker rows ────────────────────────────────────────────────────────────── */
const ROW1 = [...DELEGATES]
const ROW2 = [...DELEGATES].slice().reverse()

/* ─── Component ──────────────────────────────────────────────────────────────── */
export default function DelegatesFormat() {
  const formatRef                      = useRef<HTMLDivElement>(null)
  const [fmtRevealed,  setFmtRevealed]  = useState(false)

  /* Format grid observer */
  useEffect(() => {
    const el = formatRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setFmtRevealed(true)
          obs.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -48px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section className={styles.section} aria-labelledby="delegates-heading">
      <div className={styles.inner}>

        {/* ── Sub-section A: Who Should Attend ── */}
        <div className={styles.delegatesBlock}>
          <header className={styles.delegatesHeader}>
            <span className={styles.subLabel}>Intended Delegates</span>
            <h2 id="delegates-heading" className={styles.subHeading}>
              Built for Decision-Makers
            </h2>
          </header>

          {/* Accessible list for screen readers */}
          <ul className={styles.srOnly} aria-label="Intended delegate types">
            {DELEGATES.map(label => <li key={label}>{label}</li>)}
          </ul>

          {/* Infinite ticker — decorative, aria-hidden */}
          <div className={styles.tickerWrap} aria-hidden="true">
            <div className={styles.tickerMask}>
              <div className={`${styles.tickerRow} ${styles.tickerRowLeft}`}>
                {[...ROW1, ...ROW1].map((label, i) => (
                  <span key={`r1-${i}`} className={styles.tickerPill}>
                    <span className={styles.pillDot} />
                    {label}
                  </span>
                ))}
              </div>
              <div className={`${styles.tickerRow} ${styles.tickerRowRight}`}>
                {[...ROW2, ...ROW2].map((label, i) => (
                  <span key={`r2-${i}`} className={styles.tickerPill}>
                    <span className={styles.pillDot} />
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <hr className={styles.divider} aria-hidden="true" />

        {/* ── Sub-section B: Format & Structure ── */}
        <div>
          <header className={styles.formatHeader}>
            <h2 id="format-heading" className={styles.subHeading}>
              How the Summit is Structured
            </h2>
          </header>

          <div
            ref={formatRef}
            className={`${styles.formatGrid} ${fmtRevealed ? styles.visible : ''}`}
            role="list"
            aria-label="Summit session formats"
          >
            {FORMAT_ITEMS.map(({ index, name, desc }) => (
              <div key={index} className={styles.formatItem} role="listitem">
                <span className={styles.formatIndex}>{index}</span>
                <p className={styles.formatName}>{name}</p>
                <p className={styles.formatDesc}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
