'use client'

import { useState } from 'react'
import styles from './ObjectionHandling.module.css'

const OBJECTIONS = [
  {
    id: 'not-ict',
    tag: 'Objection 01',
    title: 'This is not only for ICT professionals',
    summary:
      'This is executive governance training — not a technical ICT course.',
    body: `The Summit Training is designed specifically for leaders who are
accountable for digital risk, not for those who manage it technically.
The modules address governance, policy, incident leadership, and AI
oversight — the decisions only C-suite and board-level leaders can make.

Modules covered for executives include:
• Cybersecurity governance frameworks and board-level oversight
• Policy design and regulatory alignment (COMESA / SADC / AU)
• Incident leadership — who decides, who communicates, who acts
• Responsible AI adoption policy and ethics for leadership teams
• Budget and risk justification for digital resilience programmes

Your IT team is not your audience — you are.`,
  },
  {
    id: 'budget',
    tag: 'Objection 02',
    title: 'How do I justify this investment?',
    summary:
      'The cost of one incident far exceeds the cost of this training.',
    body: `Consider the real cost of inaction:

• Average cost of a single data breach in Africa: USD 2.3M+ (IBM, 2024)
• Service downtime for a bank or government body: USD 5,000–50,000 per hour
• Regulatory fines for non-compliance under new cross-border frameworks:
  significant and increasing
• Reputational loss from an AI misinformation incident: unquantifiable

Your Summit seat (from USD 2,270 for corporates / USD 2,740 for individuals) includes:
• Executive workbook + governance templates you apply immediately
• Certificate + institutional letter for budget approval processes
• Clarity Guarantee: full refund in writing before Day 2 if you cannot
  identify at least 5 priority actions for your institution

Many institutions use the certificate and institutional letter to unlock
internal training budgets. Contact us for an invoice and procurement-
friendly documentation.`,
  },
  {
    id: 'ai-jobs',
    tag: 'Objection 03',
    title: '"AI is taking jobs" — why adopt it at all?',
    summary:
      'Responsible adoption = productivity + control. Fear is not a strategy.',
    body: `The question is not whether AI will change your institution — it already
is. The question is whether your leadership team is directing that change
or reacting to it.

Unregulated AI adoption creates:
• Misinformation risks that damage institutional credibility
• Legal exposure when AI-generated outputs are used in decisions
• Insider and vendor risks when AI tools are adopted without oversight
• Compliance gaps when AI intersects with data protection law

The Summit Training gives your leadership team:
• A responsible AI adoption policy framework
• Decision rights: who approves, who monitors, who can halt AI use
• Practical controls leaders can enforce — not theoretical guidelines
• A governance playbook aligned to African regulatory realities

Leaders who govern AI adoption become innovation-ready. Those who avoid
the conversation become risk-exposed.`,
  },
]

export default function ObjectionHandling() {
  const [open, setOpen] = useState<string | null>(null)

  const toggle = (id: string) => setOpen(prev => (prev === id ? null : id))

  return (
    <section className={styles.section} aria-labelledby="objections-heading">
      <div className={styles.inner}>

        <div className={styles.header}>
          <p className={styles.eyebrow}>Common Questions</p>
          <h2 id="objections-heading" className={styles.heading}>
            Addressing Your Concerns Directly
          </h2>
          <p className={styles.sub}>
            These are the three questions we hear most from senior leaders
            before they commit. We answer them honestly.
          </p>
        </div>

        <div className={styles.list} role="list">
          {OBJECTIONS.map(({ id, tag, title, summary, body }) => {
            const isOpen = open === id
            return (
              <div
                key={id}
                className={`${styles.item} ${isOpen ? styles.itemOpen : ''}`}
                role="listitem"
              >
                <button
                  className={styles.trigger}
                  onClick={() => toggle(id)}
                  aria-expanded={isOpen}
                  aria-controls={`objection-body-${id}`}
                >
                  <div className={styles.triggerLeft}>
                    <span className={styles.triggerTag}>{tag}</span>
                    <span className={styles.triggerTitle}>{title}</span>
                    <span className={styles.triggerSummary}>{summary}</span>
                  </div>
                  <span
                    className={styles.chevron}
                    aria-hidden="true"
                    style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M3 6l5 5 5-5"
                        stroke="var(--color-gold)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>

                <div
                  id={`objection-body-${id}`}
                  className={`${styles.body} ${isOpen ? styles.bodyOpen : ''}`}
                  aria-hidden={!isOpen}
                >
                  <div className={styles.bodyInner}>
                    <p className={styles.bodyText}>{body}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
