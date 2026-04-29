'use client'

import styles from './Sponsorship.module.css'

/* ─── Sponsorship tiers ──────────────────────────────────────────────────────── */
const TIERS = [
  {
    id: 'keynote',
    tier: 'Keynote Sponsor',
    icon: '◈',
    desc: 'Brand your organisation as the presenting sponsor of a day\'s keynote address. Maximum visibility — logo on screen, printed programme, and stage introduction.',
    benefits: [
      'Exclusive naming rights to one keynote session',
      'Stage introduction by conference host',
      'Premium logo placement — stage backdrop, event website & programme',
      '4 complimentary delegate seats',
      'Branded speaking opportunity (5 min)',
    ],
  },
  {
    id: 'lunch',
    tier: 'Lunch Sponsor',
    icon: '◇',
    desc: 'Host one of the summit\'s daily executive lunches. An intimate setting to network directly with C-suite delegates, policymakers, and regional heads.',
    benefits: [
      'Naming rights to one executive lunch session',
      'Table banners and branded materials in dining area',
      'Dedicated sponsor table with senior delegates',
      '2 complimentary delegate seats',
      'Acknowledgement in opening and closing remarks',
    ],
  },
  {
    id: 'coffee',
    tier: 'Coffee Break Sponsor',
    icon: '○',
    desc: 'Keep delegates energised and your brand front-of-mind during summit breaks. High-frequency exposure throughout the day.',
    benefits: [
      'Branding at all refreshment stations',
      'Branded napkins and takeaway materials',
      '1 complimentary delegate seat',
      'Social media mention as break sponsor',
    ],
  },
  {
    id: 'workshop',
    tier: 'Workshop Sponsor',
    icon: '◉',
    desc: 'Align your brand with practical, hands-on training. Ideal for technology vendors and solution providers seeking direct engagement with technical decision-makers.',
    benefits: [
      'Naming rights to one technical workshop',
      'Opportunity to co-present or introduce the session',
      'Branded workbooks and session materials',
      '2 complimentary delegate seats',
      'Delegate list (opt-in registrants) from the session',
    ],
  },
  {
    id: 'media',
    tier: 'Media Partner',
    icon: '▣',
    desc: 'Amplify the summit reach and position your media platform as the voice of Africa\'s cybersecurity and AI leadership conversation.',
    benefits: [
      'Co-branded promotional content across channels',
      'On-site media access and press area',
      'Logo on summit website and printed collateral',
      'Interview access to speakers and delegates',
      '1 complimentary delegate seat',
    ],
  },
]

/* ─── Sponsorship ────────────────────────────────────────────────────────────── */
export default function Sponsorship() {
  return (
    <section id="sponsorship" className={styles.section} aria-labelledby="sponsor-heading">

      {/* Header */}
      <header className={styles.header}>
        <span className={styles.label}>Partnership Opportunities</span>
        <h2 id="sponsor-heading" className={styles.heading}>Sponsor the Summit</h2>
        <p className={styles.sub}>
          Position your organisation at the centre of Africa's most senior cybersecurity
          and AI leadership conversation. Bespoke packages are available — reach out to discuss
          what works for your objectives.
        </p>
      </header>

      {/* Tiers grid */}
      <div className={styles.grid}>
        {TIERS.map((t, i) => (
          <article
            key={t.id}
            className={`${styles.card} reveal`}
            style={{ animationDelay: `${i * 80}ms` }}
            aria-label={t.tier}
          >
            <div className={styles.cardTop}>
              <span className={styles.icon} aria-hidden="true">{t.icon}</span>
              <span className={styles.tier}>{t.tier}</span>
            </div>

            <p className={styles.desc}>{t.desc}</p>

            <ul className={styles.benefits}>
              {t.benefits.map(b => (
                <li key={b} className={styles.benefit}>
                  <span className={styles.dot} aria-hidden="true" />
                  {b}
                </li>
              ))}
            </ul>

            <a
              href="mailto:training@siccai.org?subject=Sponsorship%20Enquiry%20%E2%80%94%20SICC%20AI%20Cape%20Town%20Summit%202026"
              className={styles.cta}
            >
              Enquire About This Package
            </a>
          </article>
        ))}
      </div>

      {/* Bespoke CTA */}
      <div className={styles.bespoke} role="note">
        <div className={styles.bespokeInner}>
          <p className={styles.bespokeTitle}>Custom Sponsorship Package</p>
          <p className={styles.bespokeBody}>
            Have a specific objective in mind? We build bespoke packages around your
            brand goals, audience, and budget. Contact our partnerships team to discuss.
          </p>
          <a
            href="mailto:training@siccai.org?subject=Bespoke%20Sponsorship%20Enquiry%20%E2%80%94%20SICC%20AI%202026"
            className={styles.bespokeBtn}
          >
            Contact Partnerships Team →
          </a>
        </div>
      </div>

    </section>
  )
}
