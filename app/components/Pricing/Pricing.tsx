'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './Pricing.module.css'

/* ─── Tier data — prices verbatim from Cape Town Summit Brochure ─────────────── */
const TIERS = [
  {
    id:        'networking',
    label:     'Networking Event',
    seats:     '15 May 2026',
    price:     '1,175',
    priceNote: 'per person · networking only',
    featured:  false,
    ribbon:    false,
    ribbonText: '',
    ctaLabel:  'Reserve Networking Seat',
    ctaHref:   '#register',
    delay:     0,
    inclusions: [
      'Access to networking event — 15 May 2026',
      'Cross-sector partnership forum',
      'Pan-African delegate mixer',
    ],
    bonus: null,
  },
  {
    id:        'individual',
    label:     'Main Event · Individual',
    seats:     '11–14 May 2026',
    price:     '2,740',
    priceNote: 'per seat · individual rate',
    featured:  true,
    ribbon:    true,
    ribbonText: 'Recommended',
    ctaLabel:  'Reserve My Seat',
    ctaHref:   '#register',
    delay:     100,
    inclusions: [
      '4 days of executive-level training (11–14 May)',
      'Executive workbook + governance templates',
      'Certificate of completion',
      'Institutional approval letter',
      '30-day post-event group clinic — 2 sessions',
    ],
    bonus: '30-day implementation clinic included',
  },
  {
    id:        'corporate',
    label:     'Main Event · Corporate',
    seats:     '2–5 seats · 11–14 May 2026',
    price:     '2,270',
    priceNote: 'per seat · corporate rate',
    featured:  false,
    ribbon:    false,
    ribbonText: '',
    ctaLabel:  'Book Executive Briefing',
    ctaHref:   '#register',
    delay:     200,
    inclusions: [
      'All Individual inclusions per attendee',
      'Team coordination and group onboarding',
      '1 private 60-min Institution Risk Mapping session (online)',
      'Invoice for institutional procurement',
    ],
    bonus: null,
  },
  {
    id:       'institutional',
    label:    'Institutional Package',
    seats:    '6–15 seats',
    price:    null,
    priceNote: 'Contact us for institutional pricing',
    featured:  false,
    ribbon:    false,
    ribbonText: '',
    ctaLabel:  'Request Institutional Package',
    ctaHref:   '#register',
    delay:     300,
    inclusions: [
      'All Corporate inclusions per attendee',
      'Policy starter pack — ready-to-use governance templates',
      '90-day implementation support option',
      'Dedicated relationship manager',
      'Path to strategic partnership / MoU',
    ],
    bonus: null,
  },
  {
    id:       'partner',
    label:    'Strategic Partner',
    seats:    '16+ seats or ongoing',
    price:    null,
    priceNote: 'Membership & partnership pricing',
    featured:  false,
    ribbon:    false,
    ribbonText: '',
    ctaLabel:  'Enquire About Partnership',
    ctaHref:   '#register',
    delay:     400,
    inclusions: [
      'Institutional seat allocation across cohorts',
      'Ongoing capability-building programme',
      'Co-branding and regional visibility opportunities',
      'MoU framework for long-term engagement',
      'Continuous revenue model for your institution',
    ],
    bonus: null,
  },
] as const

/* ─── Pricing ────────────────────────────────────────────────────────────────── */
export default function Pricing() {
  const gridRef                 = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const el = gridRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setRevealed(true); obs.disconnect() } },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="pricing" className={styles.section} aria-labelledby="pricing-heading">

      {/* Header */}
      <header className={styles.header}>
        <span className={styles.label}>Investment</span>
        <h2 id="pricing-heading" className={styles.heading}>
          Choose Your Path
        </h2>
        <p className={styles.subHeading}>
          Same core programme. Packaged for the right level of engagement.
        </p>
      </header>

      {/* Cards */}
      <div ref={gridRef} className={styles.grid} role="list">
        {TIERS.map(({ id, label, seats, price, priceNote, featured, ribbon, ribbonText, ctaLabel, ctaHref, inclusions, bonus, delay }) => (
          <article
            key={id}
            role="listitem"
            className={`${styles.card} ${featured ? styles.cardFeatured : ''} ${revealed ? styles.animate : ''}`}
            style={revealed ? { animationDelay: `${delay}ms` } : undefined}
            aria-label={`${label} — ${price ? `USD ${price}` : 'contact for pricing'}`}
          >
            {ribbon && (
              <div className={styles.ribbon} aria-hidden="true">
                <span>{ribbonText}</span>
              </div>
            )}

            {/* Tier label + seats */}
            <div className={styles.tierTop}>
              <p className={styles.tierLabel}>{label}</p>
              <span className={styles.tierSeats}>{seats}</span>
            </div>

            {/* Price */}
            <div className={styles.priceBlock}>
              {price ? (
                <>
                  <span className={styles.currency}>USD</span>
                  <span className={styles.price}>{price}</span>
                </>
              ) : (
                <span className={styles.priceContact}>Contact Us</span>
              )}
            </div>
            <p className={styles.priceNote}>{priceNote}</p>

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

            {/* Bonus badge */}
            {bonus && (
              <p className={styles.bonus} aria-label="Included bonus">
                <span className={styles.bonusDot} aria-hidden="true" />
                {bonus}
              </p>
            )}

            {/* CTA */}
            <a
              href={ctaHref}
              className={`${styles.ctaBase} ${featured ? styles.ctaSolidGold : styles.ctaOutlined}`}
              onClick={e => {
                e.preventDefault()
                document.querySelector(ctaHref)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
            >
              {ctaLabel}
            </a>
          </article>
        ))}
      </div>

      {/* Clarity Guarantee */}
      <div className={styles.guarantee} role="note" aria-label="Clarity guarantee">
        <div className={styles.guaranteeIcon} aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z"
              stroke="var(--color-gold)"
              strokeWidth="1.25"
              strokeLinejoin="round"
            />
            <path
              d="M9 12l2 2 4-4"
              stroke="var(--color-gold)"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <p className={styles.guaranteeTitle}>Clarity Guarantee</p>
          <p className={styles.guaranteeBody}>
            If, by the end of Day 1, you cannot identify at least 5 priority actions
            to improve availability, integrity, confidentiality, and responsible AI
            governance in your institution, you may request a full refund in writing
            before Day 2 begins.
          </p>
        </div>
      </div>

      {/* Footnote */}
      <p className={styles.footnote}>
        Payment details and invoice provided upon registration.
        Contact{' '}
        <a href="mailto:training@siccai.org">training@siccai.org</a>
        {' '}for group and institutional bookings.
      </p>

    </section>
  )
}
