'use client'

import styles from './OfferClarity.module.css'

const INCLUSIONS = [
  {
    num: '01',
    title: 'Summit Training Seat',
    desc: '5 days of executive-level instruction at The Bay Hotel, Cape Town — 11–15 May 2026. Plenary sessions, facilitated workshops, and peer exchange with senior leaders across Africa.',
  },
  {
    num: '02',
    title: 'Executive Workbook + Governance Templates',
    desc: 'A structured, practical workbook covering Cybersecurity governance, Responsible AI policy, and incident leadership. Templates you can adapt and implement in your institution immediately.',
  },
  {
    num: '03',
    title: '30-Day Post-Event Implementation Clinic',
    desc: 'Two group Q&A sessions within 30 days of the Summit. Bring your implementation questions, blockers, and progress. Designed to ensure the playbook moves from paper to practice.',
  },
  {
    num: '04',
    title: 'Certificate + Institutional Approval Letter',
    desc: 'A formal certificate of completion and an institutional letter — designed to help government bodies, financial institutions, and corporates process training budgets and internal approvals.',
  },
]

const GUARANTEE = {
  title: 'Clarity Guarantee',
  body: 'If, by the end of Day 1, you cannot identify at least 5 priority actions to improve availability, integrity, confidentiality, and responsible AI governance in your institution, you may request a full refund in writing before Day 2 begins.',
}

export default function OfferClarity() {
  return (
    <section className={styles.section} aria-labelledby="offer-heading">
      <div className={styles.inner}>

        <div className={styles.header}>
          <p className={styles.eyebrow}>What You Receive</p>
          <h2 id="offer-heading" className={styles.heading}>
            Everything Included in Your Seat
          </h2>
          <p className={styles.sub}>
            One seat. Four components. A governance playbook you apply immediately.
          </p>
        </div>

        <div className={styles.grid}>
          {INCLUSIONS.map(({ num, title, desc }) => (
            <div key={num} className={styles.card}>
              <span className={styles.cardNum} aria-hidden="true">{num}</span>
              <h3 className={styles.cardTitle}>{title}</h3>
              <p className={styles.cardDesc}>{desc}</p>
            </div>
          ))}
        </div>

        {/* Guarantee */}
        <div className={styles.guarantee} role="note" aria-label="Clarity guarantee">
          <div className={styles.guaranteeIcon} aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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
          <div className={styles.guaranteeContent}>
            <p className={styles.guaranteeTitle}>{GUARANTEE.title}</p>
            <p className={styles.guaranteeBody}>{GUARANTEE.body}</p>
          </div>
        </div>

        {/* CTA */}
        <div className={styles.ctaBlock}>
          <div className={styles.priceGrid}>
            <div className={styles.priceItem}>
              <span className={styles.priceLabel}>Main Event · Individuals</span>
              <p className={styles.ctaPrice}>
                <span className={styles.ctaCurrency}>USD</span>
                <span className={styles.ctaAmount}>2,740</span>
              </p>
            </div>
            <div className={styles.priceDivider} aria-hidden="true" />
            <div className={styles.priceItem}>
              <span className={styles.priceLabel}>Main Event · Corporates</span>
              <p className={styles.ctaPrice}>
                <span className={styles.ctaCurrency}>USD</span>
                <span className={styles.ctaAmount}>2,270</span>
                <span className={styles.ctaNote}>per seat</span>
              </p>
            </div>
            <div className={styles.priceDivider} aria-hidden="true" />
            <div className={styles.priceItem}>
              <span className={styles.priceLabel}>Networking Event Only</span>
              <p className={styles.ctaPrice}>
                <span className={styles.ctaCurrency}>USD</span>
                <span className={styles.ctaAmount}>1,175</span>
              </p>
            </div>
          </div>
          <div className={styles.ctaRow}>
            <a href="#register" className={styles.ctaPrimary}>
              Reserve My Seat
            </a>
            <a href="#pricing" className={styles.ctaSecondary}>
              View All Pricing
            </a>
          </div>
          <p className={styles.ctaInvoice}>
            Need an invoice for procurement? Select &ldquo;Invoice Request&rdquo; in the registration form below.
          </p>
        </div>

      </div>
    </section>
  )
}
