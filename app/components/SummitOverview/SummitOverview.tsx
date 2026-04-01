'use client'

import { useEffect, useRef } from 'react'
import styles from './SummitOverview.module.css'

/* ─── Stat pills — all facts from PDF ───────────────────────────────────────── */
const PILLS = [
  '500+ Participants Trained in 2025',
  'Pan-African · International Delegates',
  'In Partnership with ArtinTech, Canada',
]

/* ─── Metadata items — left column ──────────────────────────────────────────── */
const META = [
  { label: 'Dates',   value: '11–15 May 2026'           },
  { label: 'Venue',   value: 'The Bay Hotel\nCape Town, South Africa' },
  { label: 'Format',  value: '4 Plenary Days\n+ Networking Event'     },
  { label: 'Hosted by', value: 'SICC AI'                },
]

/* ─── SummitOverview ─────────────────────────────────────────────────────────── */
export default function SummitOverview() {
  const leftRef  = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const targets = [
      { el: leftRef.current,  cls: 'reveal-left'  },
      { el: rightRef.current, cls: 'reveal-right' },
    ]

    // Add initial hidden classes
    targets.forEach(({ el, cls }) => {
      if (el) el.classList.add(cls)
    })

    const observer = new IntersectionObserver(
      (entries) => {
        const anyVisible = entries.some(e => e.isIntersecting)
        if (anyVisible) {
          targets.forEach(({ el }) => {
            if (el) el.classList.add('visible')
          })
          observer.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -48px 0px' }
    )

    targets.forEach(({ el }) => {
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <section id="overview" className={styles.section} aria-labelledby="overview-heading">
      <div className={styles.grid}>

        {/* ── Left column ── */}
        <div ref={leftRef} className={styles.left}>
          {/* Decorative year */}
          <span className={styles.year} aria-hidden="true">2026</span>

          {/* Vertical rule + metadata */}
          <div className={styles.meta}>
            <div className={styles.metaRule} aria-hidden="true" />
            <dl className={styles.metaContent}>
              {META.map(({ label, value }) => (
                <div key={label} className={styles.metaItem}>
                  <dt className={styles.metaLabel}>{label}</dt>
                  <dd className={styles.metaValue}>
                    {value.split('\n').map((line, i) => (
                      <span key={i} style={{ display: 'block' }}>{line}</span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* ── Right column ── */}
        <div ref={rightRef} className={styles.right}>

          <div>
            <span className={styles.label}>About the Summit</span>
            <h2 id="overview-heading" className={styles.heading}>
              A High-Impact Forum Built for Africa's Leaders
            </h2>
          </div>

          {/* Body copy — verbatim from PDF Summit Overview + Introduction */}
          <div className={styles.body}>
            <p className={styles.bodyP}>
              The Continental Summit on Cybersecurity &amp; AI for Executives is a
              high-impact, pan-African capacity-building forum designed to strengthen
              cyber resilience, responsible AI adoption, and leadership awareness
              across governments, businesses, and institutions. The event aims to
              equip CEOs, Director Generals, Policymakers, Board of Directors, Heads
              of Associations, Executives, and International participants with
              knowledge and skills in Cybersecurity and Artificial Intelligence —
              whether technical or non-technical.
            </p>
            <p className={styles.bodyP}>
              As organizations accelerate their digital transformation journeys,
              technologies such as Artificial Intelligence, cloud platforms, and the
              Internet of Things are becoming central to operations and
              decision-making. Senior leaders are now accountable not only for
              organizational performance, but also for safeguarding digital trust,
              ensuring sound data governance, and overseeing the responsible
              deployment of AI. The Summit combines practical delivery, policy
              dialogue, and executive-level engagement to address Africa's growing
              exposure to cyber threats and the rapid expansion of artificial
              intelligence.
            </p>
          </div>

          {/* Stat pills */}
          <ul className={styles.pills} aria-label="Summit highlights">
            {PILLS.map((text) => (
              <li key={text} className={styles.pill}>
                <span className={styles.pillDot} aria-hidden="true" />
                {text}
              </li>
            ))}
          </ul>

        </div>
      </div>
    </section>
  )
}
