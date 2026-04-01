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
    <section id="hero" className={styles.hero} aria-label="Summit hero">
      <div className={styles.inner}>

        {/* Eyebrow */}
        <p className={styles.eyebrow}>
          Cape Town
          <span className={styles.eyebrowDot} aria-hidden="true" />
          11–15 May 2026
          <span className={styles.eyebrowDot} aria-hidden="true" />
          Summit Training
        </p>

        {/* Headline */}
        <h1 className={styles.headline}>
          African Cybersecurity{' '}
          <span className={styles.headlineAccent}>&amp; AI</span>{' '}
          Summit Training
        </h1>

        {/* Positioning statement */}
        <p className={styles.sub}>
          Executive-level training for leaders who must protect services and adopt
          AI safely—without slowing innovation.
        </p>

        {/* Sub-headline */}
        <p className={styles.subAlt}>
          Built for CEOs, Directors, Regional Leaders and Policy Makers across
          COMESA, SADC and AU member states. Leave with a practical
          Cybersecurity + Responsible AI governance playbook you can apply immediately.
        </p>

        {/* Who it is for / not for */}
        <div className={styles.qualifier} role="note" aria-label="Audience qualifier">
          <span className={styles.qualifierFor}>
            <span className={styles.qualifierLabel}>For:</span>
            CEOs · Directors · Policy Makers · Regulators · Board Members
          </span>
          <span className={styles.qualifierSep} aria-hidden="true" />
          <span className={styles.qualifierNot}>
            <span className={styles.qualifierLabel}>Not for:</span>
            Entry-level ICT training
          </span>
        </div>

        {/* 3 Outcome bullets */}
        <ul className={styles.outcomes} aria-label="Key outcomes">
          {[
            { label: 'Availability', desc: 'Services stay up. Disruption risk reduced.' },
            { label: 'Integrity',    desc: 'Systems stay trusted. Insider threats controlled.' },
            { label: 'Confidentiality + AI Safety', desc: 'Data protected. AI adopted responsibly.' },
          ].map(({ label, desc }) => (
            <li key={label} className={styles.outcomesItem}>
              <span className={styles.outcomesDot} aria-hidden="true" />
              <span>
                <strong className={styles.outcomesLabel}>{label}</strong>
                {' — '}
                <span className={styles.outcomesDesc}>{desc}</span>
              </span>
            </li>
          ))}
        </ul>

        {/* CTAs */}
        <div className={styles.ctaRow}>
          <a
            href="#register"
            className={styles.ctaPrimary}
          >
            Reserve My Seat — USD 3,000
          </a>
          <a
            href="#register"
            className={styles.ctaSecondary}
          >
            Book an Executive Briefing
            <span className={styles.ctaSecondaryNote}>(Teams / Institutions)</span>
          </a>
        </div>

        {/* Divider */}
        <hr className={styles.rule} />

        {/* Trust stats */}
        <div className={styles.stats} role="list" aria-label="Summit highlights">
          {[
            'COMESA · SADC · AU',
            'Executive Track',
            '5 Days · The Bay Hotel',
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
