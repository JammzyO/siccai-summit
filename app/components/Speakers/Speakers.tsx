'use client'

import { useState } from 'react'
import styles from './Speakers.module.css'

/* ─── Speaker data ───────────────────────────────────────────────────────────── */
const SPEAKERS = [
  {
    id: 'francis',
    day: 'Day 1',
    dayLabel: 'June 11',
    slot: 'Opening Keynote',
    theme: 'Cyber Security',
    name: 'Francis',
    title: 'Keynote Speaker',
    org: 'Cybersecurity',
    bio: null,
    initials: 'F',
  },
  {
    id: 'muganda',
    day: 'Day 1',
    dayLabel: 'June 11',
    slot: 'Mid-Morning Keynote',
    theme: 'Cyber Security',
    name: 'Joseph Muganda',
    title: 'Keynote Speaker',
    org: 'Cybersecurity',
    bio: null,
    initials: 'JM',
  },
  {
    id: 'odinga',
    day: 'Day 2',
    dayLabel: 'June 12',
    slot: 'Policy Keynote',
    theme: 'Policy & Leadership',
    name: 'Hon. Jaoko Oburu Odinga',
    title: 'Special Advisor to the President on Economic Empowerment & Sustainable Livelihoods',
    org: 'Patron — E.L.E.V.A.T.E Kenya',
    bio: `Hon. Jaoko Oburu Odinga is the Special Advisor to the President of Kenya on Economic Empowerment and Sustainable Livelihoods, where he provides strategic leadership on policy development, digital transformation, and inclusive economic growth. He plays a central role in shaping national and regional frameworks that leverage technology to drive sustainable livelihoods, job creation, and economic resilience.

With extensive experience in governance and multi-sectoral coordination, Hon. Jaoko Oburu Odinga works at the intersection of policy, cybersecurity, and artificial intelligence, advancing strategies that strengthen digital trust, data protection, and institutional readiness in an increasingly connected world.

At the Cybersecurity & AI Conference in Cape Town, Hon. Odinga brings a forward-looking perspective on Africa's readiness to address emerging cyber threats while harnessing AI for transformative economic impact.`,
    initials: 'JO',
  },
  {
    id: 'harandi',
    day: 'Day 3',
    dayLabel: 'June 13',
    slot: 'AI Keynote',
    theme: 'Artificial Intelligence',
    name: 'Dr. Amir Harandi',
    title: 'University Professor · Corporate Trainer · CEO, Artintech · Co-Founder, Beaver Robotics & dx.training',
    org: 'Artintech, Toronto, Canada',
    bio: `Dr. Amir Harandi is a globally experienced AI expert, technology entrepreneur, and academic based in Toronto, Canada, with over 20 years of experience in artificial intelligence, robotics, and digital innovation. He holds a Ph.D., an MBA, and is a certified Project Management Professional (PMP), combining deep technical knowledge with strategic business insight.

He leads the design and deployment of AI-driven solutions and intelligent systems that enhance automation, efficiency, and data-driven decision-making across industries. As a university professor and corporate trainer since 2001, Dr. Harandi has played a key role in shaping the next generation of AI professionals.

At the Cybersecurity & AI Conference in Cape Town, Dr. Harandi will share insights on the transformative power of artificial intelligence in driving economic growth and digital transformation, while addressing the importance of secure, ethical, and responsible AI adoption.`,
    initials: 'AH',
  },
]

/* ─── Speakers ───────────────────────────────────────────────────────────────── */
export default function Speakers() {
  const [expanded, setExpanded] = useState<string | null>(null)

  const toggle = (id: string) => setExpanded(prev => prev === id ? null : id)

  return (
    <section id="speakers" className={styles.section} aria-labelledby="speakers-heading">

      <header className={styles.header}>
        <span className={styles.label}>Keynote Faculty</span>
        <h2 id="speakers-heading" className={styles.heading}>Summit Speakers</h2>
        <p className={styles.sub}>
          Distinguished experts, policymakers, and innovators delivering the keynote programme
          across Cybersecurity, Policy &amp; Leadership, and Artificial Intelligence.
        </p>
      </header>

      <div className={styles.grid}>
        {SPEAKERS.map((s, i) => {
          const isOpen = expanded === s.id
          return (
            <article
              key={s.id}
              className={`${styles.card} reveal`}
              style={{ animationDelay: `${i * 80}ms` }}
              aria-label={`${s.name} — ${s.slot}`}
            >
              {/* Day + slot badge */}
              <div className={styles.badges}>
                <span className={styles.dayBadge}>{s.day} · {s.dayLabel}</span>
                <span className={styles.slotBadge}>{s.slot}</span>
              </div>

              {/* Avatar + identity */}
              <div className={styles.identity}>
                <div className={styles.avatar} aria-hidden="true">
                  <span className={styles.avatarInitials}>{s.initials}</span>
                  <div className={styles.avatarRing} />
                </div>
                <div className={styles.nameBlock}>
                  <p className={styles.theme}>{s.theme}</p>
                  <h3 className={styles.name}>{s.name}</h3>
                  <p className={styles.title}>{s.title}</p>
                  <p className={styles.org}>{s.org}</p>
                </div>
              </div>

              {/* Bio toggle */}
              {s.bio && (
                <div className={styles.bioWrap}>
                  <button
                    type="button"
                    className={styles.bioToggle}
                    onClick={() => toggle(s.id)}
                    aria-expanded={isOpen}
                    aria-controls={`bio-${s.id}`}
                  >
                    {isOpen ? 'Hide biography' : 'Read biography'}
                    <svg
                      className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <div
                    id={`bio-${s.id}`}
                    className={`${styles.bioBody} ${isOpen ? styles.bioBodyOpen : ''}`}
                  >
                    <div className={styles.bioInner}>
                      {s.bio.split('\n\n').map((para, pi) => (
                        <p key={pi} className={styles.bioPara}>{para}</p>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* No bio placeholder */}
              {!s.bio && (
                <p className={styles.bioPlaceholder}>Biography to be announced.</p>
              )}
            </article>
          )
        })}
      </div>

      <p className={styles.footnote}>
        Additional speakers will be announced. Enquiries: <a href="mailto:training@siccai.org">training@siccai.org</a>
      </p>

    </section>
  )
}
