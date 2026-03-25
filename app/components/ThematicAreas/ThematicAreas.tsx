'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './ThematicAreas.module.css'

/* ─── SVG Icons ──────────────────────────────────────────────────────────────── */
function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M12 2.5L3.5 7v4.75C3.5 17.1 7.3 21.6 12 23c4.7-1.4 8.5-5.9 8.5-11.25V7L12 2.5z"
        stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"
      />
      <path
        d="M8.75 12l2.5 2.5 4-5"
        stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  )
}

function NeuralNetIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Input nodes */}
      <circle cx="4"  cy="5.5"  r="1.6" stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="4"  cy="12"   r="1.6" stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="4"  cy="18.5" r="1.6" stroke="currentColor" strokeWidth="1.2"/>
      {/* Hidden nodes */}
      <circle cx="12" cy="8.75" r="1.6" stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="12" cy="15.25" r="1.6" stroke="currentColor" strokeWidth="1.2"/>
      {/* Output node */}
      <circle cx="20" cy="12" r="1.6" stroke="currentColor" strokeWidth="1.2"/>
      {/* Input → Hidden connections */}
      <line x1="5.6"  y1="5.5"  x2="10.4" y2="8.75"  stroke="currentColor" strokeWidth="0.7" opacity="0.55"/>
      <line x1="5.6"  y1="5.5"  x2="10.4" y2="15.25" stroke="currentColor" strokeWidth="0.7" opacity="0.55"/>
      <line x1="5.6"  y1="12"   x2="10.4" y2="8.75"  stroke="currentColor" strokeWidth="0.7" opacity="0.55"/>
      <line x1="5.6"  y1="12"   x2="10.4" y2="15.25" stroke="currentColor" strokeWidth="0.7" opacity="0.55"/>
      <line x1="5.6"  y1="18.5" x2="10.4" y2="8.75"  stroke="currentColor" strokeWidth="0.7" opacity="0.55"/>
      <line x1="5.6"  y1="18.5" x2="10.4" y2="15.25" stroke="currentColor" strokeWidth="0.7" opacity="0.55"/>
      {/* Hidden → Output connections */}
      <line x1="13.6" y1="8.75"  x2="18.4" y2="12" stroke="currentColor" strokeWidth="0.7" opacity="0.55"/>
      <line x1="13.6" y1="15.25" x2="18.4" y2="12" stroke="currentColor" strokeWidth="0.7" opacity="0.55"/>
    </svg>
  )
}

function ScalesIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Centre column */}
      <line x1="12" y1="3.5" x2="12" y2="21" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      {/* Beam */}
      <line x1="4.5" y1="7" x2="19.5" y2="7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      {/* Fulcrum dot */}
      <circle cx="12" cy="7" r="1.4" fill="currentColor"/>
      {/* Left pan chains */}
      <line x1="6.5" y1="7" x2="5"   y2="13.5" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round"/>
      <line x1="6.5" y1="7" x2="8"   y2="13.5" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round"/>
      {/* Left pan arc */}
      <path d="M4 13.5 Q6.5 16.5 9 13.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      {/* Right pan chains */}
      <line x1="17.5" y1="7" x2="16"  y2="13.5" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round"/>
      <line x1="17.5" y1="7" x2="19"  y2="13.5" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round"/>
      {/* Right pan arc */}
      <path d="M15 13.5 Q17.5 16.5 20 13.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      {/* Base */}
      <line x1="9" y1="21" x2="15" y2="21" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  )
}

/* ─── Data — sub-topics verbatim from PDF ────────────────────────────────────── */
const PILLARS = [
  {
    variant:   styles.variantGold,
    color:     'var(--color-gold)',
    number:    '01',
    name:      'Cyber Security',
    topics: [
      'Cyber threats facing Africa',
      'Critical infrastructure protection',
      'Financial sector cyber risks',
      'Cyber incident response & resilience',
      'Cybercrime trends and defense strategies',
    ],
    Icon: ShieldIcon,
    delay: 0,
  },
  {
    variant:   styles.variantTeal,
    color:     'var(--color-teal)',
    number:    '02',
    name:      'Artificial Intelligence',
    topics: [
      'AI opportunities for African economies',
      'AI risks, misuse and cyber threats',
      'AI governance, ethics and regulation',
      'AI for cybersecurity and threat detection',
      'Responsible and secure AI deployment',
    ],
    Icon: NeuralNetIcon,
    delay: 120,
  },
  {
    variant:   styles.variantPurple,
    color:     '#7B68EE',
    number:    '03',
    name:      'Policy & Leadership',
    topics: [
      'National and regional cyber strategies',
      'Data protection and privacy',
      'AI policy frameworks',
      'Board-level cyber governance',
      'Public-private collaboration',
    ],
    Icon: ScalesIcon,
    delay: 240,
  },
] as const

/* ─── ThematicAreas ──────────────────────────────────────────────────────────── */
export default function ThematicAreas() {
  const sectionRef                  = useRef<HTMLElement>(null)
  const [revealed, setRevealed]     = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="thematic-heading"
    >
      {/* Header */}
      <header className={styles.header}>
        <span className={styles.label}>What We Cover</span>
        <h2 id="thematic-heading" className={styles.heading}>
          Three Pillars of the Summit
        </h2>
      </header>

      {/* Cards */}
      <div className={styles.grid} role="list">
        {PILLARS.map(({ variant, color, number, name, topics, Icon, delay }) => (
          <article
            key={name}
            role="listitem"
            className={`${styles.card} ${variant} ${revealed ? styles.animate : ''}`}
            style={revealed ? { animationDelay: `${delay}ms` } : undefined}
          >
            {/* Pillar header */}
            <div className={styles.cardTop}>
              <p className={styles.pillarLabel}>Pillar {number}</p>
              <h3
                className={styles.pillarName}
                style={{ color }}
              >
                {name}
              </h3>
            </div>

            {/* Sub-topics */}
            <ul className={styles.topicList} aria-label={`${name} topics`}>
              {topics.map((topic) => (
                <li key={topic} className={styles.topic}>
                  <span className={styles.topicDash} aria-hidden="true" />
                  {topic}
                </li>
              ))}
            </ul>

            {/* Decorative icon */}
            <div
              className={styles.iconWrap}
              style={{ color }}
              aria-hidden="true"
            >
              <Icon />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
