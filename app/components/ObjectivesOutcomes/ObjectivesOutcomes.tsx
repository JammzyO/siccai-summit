'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './ObjectivesOutcomes.module.css'

/* ─── Data — verbatim from PDF ───────────────────────────────────────────────── */

const OBJECTIVES = [
  'Build practical cybersecurity and AI skills across Africa',
  'Support policy makers and leaders in understanding cyber and AI risks',
  'Promote responsible, ethical, and secure AI adoption',
  'Strengthen regional collaboration and knowledge sharing',
  'Bridge the gap between technical experts and decision-makers',
] as const

const OUTCOMES = [
  'Improved cyber and AI readiness across institutions',
  'Better-informed leaders and boards',
  'Practical skills transferred to participants',
  'Stronger regional networks and partnerships',
  'Actionable policy and strategy recommendations',
] as const

/* ─── Checkmark SVG ──────────────────────────────────────────────────────────── */
function CheckIcon() {
  return (
    <svg
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M1.5 5l2.5 2.5 4.5-4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* ─── Component ──────────────────────────────────────────────────────────────── */
export default function ObjectivesOutcomes() {
  const objListRef  = useRef<HTMLUListElement>(null)
  const outGridRef  = useRef<HTMLDivElement>(null)

  const [objRevealed, setObjRevealed]   = useState(false)
  const [outRevealed, setOutRevealed]   = useState(false)

  /* Objectives observer */
  useEffect(() => {
    const el = objListRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setObjRevealed(true)
          obs.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  /* Outcomes observer */
  useEffect(() => {
    const el = outGridRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setOutRevealed(true)
          obs.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  /* Total objectives animation window = 4 × 80ms + 500ms duration = 820ms.
     Outcomes base delay adds a gap so on tall viewports they still cascade. */
  const OBJ_STAGGER    = 80
  const OUTCOMES_BASE  = OBJECTIVES.length * OBJ_STAGGER + 100  // 500ms
  const OUT_STAGGER    = 80

  return (
    <section
      className={styles.section}
      aria-labelledby="objectives-heading outcomes-heading"
    >
      <div className={styles.inner}>

        {/* ── Dual heading ── */}
        <div className={styles.dualHeading} aria-hidden="false">
          <div className={styles.headingBlock}>
            <span className={styles.headingLabel}>Summit Goals</span>
            <h2 id="objectives-heading" className={styles.headingText}>
              Objectives
            </h2>
          </div>

          <div className={styles.headingRule} aria-hidden="true" />

          <div className={styles.headingBlock}>
            <span className={styles.headingLabel}>What You Gain</span>
            <h2 id="outcomes-heading" className={styles.headingText}>
              Expected Outcomes
            </h2>
          </div>
        </div>

        {/* ── Objectives list ── */}
        <ul
          ref={objListRef}
          className={styles.objectivesList}
          aria-label="Summit objectives"
        >
          {OBJECTIVES.map((text, i) => {
            const num = String(i + 1).padStart(2, '0')
            return (
              <li
                key={num}
                className={`${styles.objectiveItem} ${objRevealed ? styles.animate : ''}`}
                style={objRevealed ? { animationDelay: `${i * OBJ_STAGGER}ms` } : undefined}
              >
                {/* Ghost number — aria-hidden so screen readers skip it */}
                <span className={styles.ghostNum} aria-hidden="true">
                  {num}
                </span>
                <p className={styles.objectiveText}>{text}</p>
              </li>
            )
          })}
        </ul>

        {/* ── Outcomes grid ── */}
        <div
          ref={outGridRef}
          className={styles.outcomesGrid}
          role="list"
          aria-label="Expected outcomes"
        >
          {OUTCOMES.map((text, i) => (
            <div
              key={text}
              role="listitem"
              className={`${styles.outcomeCard} ${outRevealed ? styles.animate : ''}`}
              style={
                outRevealed
                  ? { animationDelay: `${OUTCOMES_BASE + i * OUT_STAGGER}ms` }
                  : undefined
              }
            >
              <div className={styles.checkWrap}>
                <CheckIcon />
              </div>
              <p className={styles.outcomeText}>{text}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
