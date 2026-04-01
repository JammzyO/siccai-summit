'use client'

import styles from './CredibilityStack.module.css'

const TESTIMONIALS = [
  {
    quote:
      'The training gave our board a structured way to discuss digital risk. We left with a shared language and an action plan — not just another awareness session.',
    name: 'Board Member',
    org: 'NGCDF Board, Kenya',
  },
  {
    quote:
      'Our SACCOs face real cybersecurity threats every week. This programme gave our leadership team the governance framework we needed to respond decisively.',
    name: 'Director',
    org: 'Kenya SACCOs Sector',
  },
  {
    quote:
      'As county government leaders, we needed practical, regionally relevant guidance — not theory. SICC AI delivered exactly that.',
    name: 'Senior Official',
    org: 'Kenya County Government',
  },
]

const PARTNERS = [
  'Public Sector Institutions',
  'Financial Services',
  'County Governments',
  'SACCOs & Cooperatives',
  'Regulatory Bodies',
  'Development Organisations',
]

export default function CredibilityStack() {
  return (
    <section id="credibility" className={styles.section} aria-labelledby="credibility-heading">
      <div className={styles.inner}>

        {/* Trust line */}
        <p className={styles.trustLine}>
          Trusted by public and private sector institutions across East, Central,
          and Southern Africa
        </p>

        {/* Partner tags */}
        <div className={styles.partnerRow} aria-label="Sectors served">
          {PARTNERS.map((p) => (
            <span key={p} className={styles.partnerTag}>{p}</span>
          ))}
        </div>

        {/* Divider */}
        <div className={styles.divider} aria-hidden="true" />

        {/* Section heading */}
        <h2 id="credibility-heading" className={styles.heading}>
          What Past Participants Say
        </h2>

        {/* Testimonials */}
        <div className={styles.grid} role="list">
          {TESTIMONIALS.map(({ quote, name, org }) => (
            <figure key={org} className={styles.card} role="listitem">
              <span className={styles.quoteGlyph} aria-hidden="true">&ldquo;</span>
              <blockquote className={styles.quote}>{quote}</blockquote>
              <figcaption className={styles.attribution}>
                <span className={styles.attributionName}>{name}</span>
                <span className={styles.attributionOrg}>{org}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Authority note */}
        <div className={styles.authorityRow}>
          <div className={styles.authorityItem}>
            <span className={styles.authorityNumber}>COMESA</span>
            <span className={styles.authorityLabel}>Regional alignment</span>
          </div>
          <div className={styles.authorityDivider} aria-hidden="true" />
          <div className={styles.authorityItem}>
            <span className={styles.authorityNumber}>SADC</span>
            <span className={styles.authorityLabel}>Policy framework</span>
          </div>
          <div className={styles.authorityDivider} aria-hidden="true" />
          <div className={styles.authorityItem}>
            <span className={styles.authorityNumber}>AU</span>
            <span className={styles.authorityLabel}>Continental mandate</span>
          </div>
          <div className={styles.authorityDivider} aria-hidden="true" />
          <div className={styles.authorityItem}>
            <span className={styles.authorityNumber}>ArtinTech</span>
            <span className={styles.authorityLabel}>Partner · Toronto, Canada</span>
          </div>
        </div>

      </div>
    </section>
  )
}
