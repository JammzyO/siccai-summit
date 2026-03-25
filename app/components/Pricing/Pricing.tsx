'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './Pricing.module.css'

/* ─── Tier data ──────────────────────────────────────────────────────────────── */
/* Prices verbatim from PDF / CLAUDE.md — do not modify */
const TIERS = [
  {
    id:           'networking',
    label:        'Networking Event Only',
    labelColor:   'var(--color-teal)',
    price:        '1,175',
    dateRange:    '15 May 2026',
    featured:     false,
    ribbon:       false,
    inclusions: [
      'Access to networking event on 15 May 2026',
      'Cross-sector partnership forum',
      'Pan-African delegate mixer',
    ],
    ctaClass:  styles.ctaOutlined,
    delay:     0,
  },
  {
    id:           'corporate',
    label:        'Main Event · Corporate',
    labelColor:   'var(--color-gold)',
    price:        '2,270',
    dateRange:    '11–14 May 2026',
    featured:     true,
    ribbon:       true,
    inclusions: [
      '4 days of plenary sessions (11–14 May)',
      'Keynotes, workshops & masterclasses',
      'Policy roundtables & live demonstrations',
    ],
    ctaClass:  styles.ctaSolidGold,
    delay:     120,
  },
  {
    id:           'individual',
    label:        'Main Event · Individual',
    labelColor:   'var(--color-teal)',
    price:        '2,740',
    dateRange:    '11–14 May 2026',
    featured:     false,
    ribbon:       false,
    inclusions: [
      '4 days of plenary sessions (11–14 May)',
      'Keynotes, workshops & masterclasses',
      'Policy roundtables & live demonstrations',
    ],
    ctaClass:  styles.ctaSolidTeal,
    delay:     240,
  },
] as const

/* ─── Pricing ────────────────────────────────────────────────────────────────── */
export default function Pricing() {
  const gridRef                       = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed]       = useState(false)

  useEffect(() => {
    const el = gridRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true)
          obs.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section className={styles.section} aria-labelledby="pricing-heading">

      {/* Header */}
      <header className={styles.header}>
        <span className={styles.label}>Investment</span>
        <h2 id="pricing-heading" className={styles.heading}>
          Secure Your Place
        </h2>
      </header>

      {/* Cards */}
      <div ref={gridRef} className={styles.grid} role="list">
        {TIERS.map(({ id, label, labelColor, price, dateRange, featured, ribbon, inclusions, ctaClass, delay }) => (
          <article
            key={id}
            role="listitem"
            className={`${styles.card} ${featured ? styles.cardFeatured : ''} ${revealed ? styles.animate : ''}`}
            style={revealed ? { animationDelay: `${delay}ms` } : undefined}
            aria-label={`${label} — USD ${price}`}
          >
            {/* Corner ribbon — CSS only, featured card only */}
            {ribbon && (
              <div className={styles.ribbon} aria-hidden="true" />
            )}

            {/* Tier label */}
            <p className={styles.tierLabel} style={{ color: labelColor }}>
              {label}
            </p>

            {/* Price */}
            <div className={styles.priceBlock}>
              <span className={styles.currency}>USD</span>
              <span className={styles.price}>{price}</span>
            </div>
            <p className={styles.dateRange}>{dateRange}</p>

            {/* Divider */}
            <hr className={styles.cardDivider} />

            {/* Inclusions */}
            <ul className={styles.inclusions}>
              {inclusions.map((item) => (
                <li key={item} className={styles.inclusion}>
                  <span className={styles.dot} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <a
              href="https://www.siccai.org/south-africa-summit-registration/"
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.ctaBase} ${ctaClass}`}
            >
              Register for This Tier
            </a>
          </article>
        ))}
      </div>

      {/* Small print */}
      <p className={styles.footnote}>
        Payment details and invoice provided upon registration.
        Contact{' '}
        <a href="mailto:training@siccai.org">training@siccai.org</a>
        {' '}for group bookings.
      </p>

    </section>
  )
}
