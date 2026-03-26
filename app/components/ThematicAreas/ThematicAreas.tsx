'use client'

import { useState } from 'react'
import styles from './ThematicAreas.module.css'

/* ─── SVG Icons ──────────────────────────────────────────────────────────────── */
function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M12 2.5L3.5 7v4.75C3.5 17.1 7.3 21.6 12 23c4.7-1.4 8.5-5.9 8.5-11.25V7L12 2.5z"
        stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"
      />
      <path
        d="M8.75 12l2.5 2.5 4-5"
        stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  )
}

function NeuralNetIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="4"  cy="5.5"  r="1.6" stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="4"  cy="12"   r="1.6" stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="4"  cy="18.5" r="1.6" stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="12" cy="8.75"  r="1.6" stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="12" cy="15.25" r="1.6" stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="20" cy="12"   r="1.6" stroke="currentColor" strokeWidth="1.2"/>
      <line x1="5.6"  y1="5.5"  x2="10.4" y2="8.75"  stroke="currentColor" strokeWidth="0.7" opacity="0.6"/>
      <line x1="5.6"  y1="5.5"  x2="10.4" y2="15.25" stroke="currentColor" strokeWidth="0.7" opacity="0.6"/>
      <line x1="5.6"  y1="12"   x2="10.4" y2="8.75"  stroke="currentColor" strokeWidth="0.7" opacity="0.6"/>
      <line x1="5.6"  y1="12"   x2="10.4" y2="15.25" stroke="currentColor" strokeWidth="0.7" opacity="0.6"/>
      <line x1="5.6"  y1="18.5" x2="10.4" y2="8.75"  stroke="currentColor" strokeWidth="0.7" opacity="0.6"/>
      <line x1="5.6"  y1="18.5" x2="10.4" y2="15.25" stroke="currentColor" strokeWidth="0.7" opacity="0.6"/>
      <line x1="13.6" y1="8.75"  x2="18.4" y2="12"   stroke="currentColor" strokeWidth="0.7" opacity="0.6"/>
      <line x1="13.6" y1="15.25" x2="18.4" y2="12"   stroke="currentColor" strokeWidth="0.7" opacity="0.6"/>
    </svg>
  )
}

function ScalesIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <line x1="12" y1="3.5" x2="12" y2="21" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="4.5" y1="7" x2="19.5" y2="7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <circle cx="12" cy="7" r="1.4" fill="currentColor"/>
      <line x1="6.5" y1="7" x2="5"  y2="13.5" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round"/>
      <line x1="6.5" y1="7" x2="8"  y2="13.5" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round"/>
      <path d="M4 13.5 Q6.5 16.5 9 13.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="17.5" y1="7" x2="16" y2="13.5" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round"/>
      <line x1="17.5" y1="7" x2="19" y2="13.5" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round"/>
      <path d="M15 13.5 Q17.5 16.5 20 13.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="9" y1="21" x2="15" y2="21" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  )
}

/* ─── Data ───────────────────────────────────────────────────────────────────── */
const PILLARS = [
  {
    id:           'cyber',
    number:       '01',
    name:         'Cyber Security',
    accentColor:  'var(--color-gold)',
    variantClass: styles.variantGold,
    description:
      "Africa's digital infrastructure faces an escalating wave of sophisticated threats. " +
      'This pillar addresses how leaders can build resilient defenses across critical systems, ' +
      'financial networks, and national infrastructure.',
    topics: [
      'Cyber threats facing Africa',
      'Critical infrastructure protection',
      'Financial sector cyber risks',
      'Cyber incident response & resilience',
      'Cybercrime trends and defense strategies',
    ],
    Icon: ShieldIcon,
  },
  {
    id:           'ai',
    number:       '02',
    name:         'Artificial Intelligence',
    accentColor:  'var(--color-teal)',
    variantClass: styles.variantTeal,
    description:
      'AI presents transformative opportunities for African economies — and significant ' +
      "governance challenges. This pillar examines responsible adoption, ethical oversight, " +
      "and AI's role in strengthening cybersecurity.",
    topics: [
      'AI opportunities for African economies',
      'AI risks, misuse, and cyber threats',
      'AI governance, ethics, and regulation',
      'AI for cybersecurity and threat detection',
      'Responsible and secure AI deployment',
    ],
    Icon: NeuralNetIcon,
  },
  {
    id:           'policy',
    number:       '03',
    name:         'Policy & Leadership',
    accentColor:  '#9B8FEE',
    variantClass: styles.variantPurple,
    description:
      'Cyber risk is no longer an IT issue — it sits at the board table. This pillar ' +
      'equips policymakers and executives with frameworks for national strategy, data ' +
      'governance, and public-private collaboration.',
    topics: [
      'National and regional cyber strategies',
      'Data protection and privacy',
      'AI policy frameworks',
      'Board-level cyber governance',
      'Public-private collaboration',
    ],
    Icon: ScalesIcon,
  },
] as const

/* ─── Component ──────────────────────────────────────────────────────────────── */
export default function ThematicAreas() {
  /* Default: Cyber Security active. Stays on last hovered — no reset on leave. */
  const [active, setActive] = useState(0)
  const pillar = PILLARS[active]

  return (
    <section className={styles.section} aria-labelledby="thematic-heading">
      <div className={styles.inner}>

        {/* Section header */}
        <header className={styles.header}>
          <span className={styles.sectionLabel}>Key Thematic Areas</span>
          <h2 id="thematic-heading" className={styles.heading}>
            Three Pillars of the Summit
          </h2>
        </header>

        {/* Two-column layout */}
        <div className={styles.twoCol}>

          {/* ── Left column: content for active pillar ── */}
          <div className={styles.leftCol}>
            {/* key forces CSS animation to retrigger on every active change */}
            <div key={active} className={styles.leftContent}>
              <span
                className={styles.contentLabel}
                style={{ color: pillar.accentColor }}
              >
                Pillar {pillar.number}
              </span>
              <h3 className={styles.contentTitle}>{pillar.name}</h3>
              <p className={styles.contentDesc}>{pillar.description}</p>
              <ul className={styles.topicList} aria-label={`${pillar.name} sub-topics`}>
                {pillar.topics.map(topic => (
                  <li key={topic} className={styles.topicItem}>
                    <span
                      className={styles.topicDash}
                      style={{ background: pillar.accentColor }}
                      aria-hidden="true"
                    />
                    {topic}
                  </li>
                ))}
              </ul>
              <button type="button" className={styles.cta}>
                Explore This Track{' '}
                <span className={styles.ctaArrow} aria-hidden="true">→</span>
              </button>
            </div>
          </div>

          {/* ── Right column: accordion panels ── */}
          <div className={styles.rightCol}>
            <div
              className={styles.accordion}
              role="list"
              aria-label="Summit pillars"
            >
              {PILLARS.map(({ id, number, name, variantClass }, i) => {
                const isActive = active === i
                return (
                  <article
                    key={id}
                    className={`${styles.panel} ${variantClass} ${isActive ? styles.panelActive : ''}`}
                    role="listitem"
                    tabIndex={0}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    aria-label={`Pillar ${number}: ${name}`}
                    aria-current={isActive ? true : undefined}
                  >
                    {/* Background pattern */}
                    <div className={styles.panelBg} aria-hidden="true" />
                    {/* Gradient overlay */}
                    <div className={styles.panelGradient} aria-hidden="true" />

                    {/* Collapsed label — rotated name, hidden when active */}
                    <div className={styles.collapsedLabel} aria-hidden="true">
                      <span className={styles.rotatedName}>{name}</span>
                    </div>

                    {/* Ghost index number — visible only when active */}
                    <span className={styles.ghostIndex} aria-hidden="true">
                      {number}
                    </span>
                  </article>
                )
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
