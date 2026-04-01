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
    accentColor:  '#D4845A',
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
  const [active, setActive] = useState(0)

  return (
    <section id="programme" className={styles.section} aria-labelledby="thematic-heading">
      <div className={styles.inner}>
        <div className={styles.twoCol}>

          {/* ── Left column: static intro copy ── */}
          <div className={styles.leftCol}>
            <span className={styles.sectionLabel}>Key Thematic Areas</span>
            <h2 id="thematic-heading" className={styles.heading}>
              Three Pillars of<br />the Summit
            </h2>
            <p className={styles.leftDesc}>
              Every session, workshop, and roundtable at the summit is structured around
              three interconnected pillars — each designed to bridge the gap between
              technical complexity and executive decision-making.
            </p>
            <ul className={styles.pillarTags} aria-label="Summit pillars">
              {PILLARS.map(({ id, number, name, accentColor }) => (
                <li key={id} className={styles.pillarTag}>
                  <span
                    className={styles.tagDot}
                    style={{ background: accentColor }}
                    aria-hidden="true"
                  />
                  <span className={styles.tagNum}>{number}</span>
                  {name}
                </li>
              ))}
            </ul>
            <div className={styles.ctaRow}>
              <a href="#form-heading" className={styles.ctaRegister}>
                Register Now{' '}
                <span className={styles.ctaArrow} aria-hidden="true">→</span>
              </a>
              <a
                href="/siccai-cape-town-summit-brochure.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.cta}
              >
                Download Programme{' '}
                <span className={styles.ctaArrow} aria-hidden="true">↓</span>
              </a>
            </div>
          </div>

          {/* ── Right column: accordion — content lives inside each panel ── */}
          <div className={styles.rightCol}>
            <div
              className={styles.accordion}
              role="list"
              aria-label="Summit pillars"
            >
              {PILLARS.map(({ id, number, name, accentColor, variantClass, description, topics, Icon }, i) => {
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
                    aria-expanded={isActive}
                  >
                    {/* Background pattern */}
                    <div className={styles.panelBg} aria-hidden="true" />
                    {/* Gradient overlay */}
                    <div className={styles.panelGradient} aria-hidden="true" />

                    {/* Ghost index number */}
                    <span className={styles.ghostIndex} aria-hidden="true">
                      {number}
                    </span>

                    {/* Collapsed label — rotated name, fades out when expanded */}
                    <div className={styles.collapsedLabel} aria-hidden="true">
                      <span
                        className={styles.labelIcon}
                        style={{ color: accentColor }}
                      >
                        <Icon />
                      </span>
                      <span className={styles.rotatedName}>{name}</span>
                    </div>

                    {/* Expanded content — fades in when panel is active */}
                    <div className={styles.expandedContent}>
                      <span
                        className={styles.contentPillarNum}
                        style={{ color: accentColor }}
                      >
                        Pillar {number}
                      </span>
                      <h3 className={styles.contentTitle}>{name}</h3>
                      <p className={styles.contentDesc}>{description}</p>
                      <ul
                        className={styles.topicList}
                        aria-label={`${name} sub-topics`}
                      >
                        {topics.map(topic => (
                          <li key={topic} className={styles.topicItem}>
                            <span
                              className={styles.topicDash}
                              style={{ background: accentColor }}
                              aria-hidden="true"
                            />
                            {topic}
                          </li>
                        ))}
                      </ul>
                    </div>
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
