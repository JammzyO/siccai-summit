import Image from 'next/image'
import Link from 'next/link'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer} aria-label="Site footer">

      {/* ── Main columns ── */}
      <div className={styles.body}>

        {/* Brand */}
        <div className={styles.brand}>
          <Link href="/" className={styles.logoWrap} aria-label="SICC AI — home">
            <Image
              src="/logo.png"
              alt="SICC AI"
              width={451}
              height={370}
              style={{ height: '52px', width: 'auto' }}
            />
          </Link>
          <p className={styles.tagline}>
            Securisee International Centre for AI Technologies Ltd
          </p>
        </div>

        {/* Contact */}
        <div className={styles.col}>
          <p className={styles.colHeading}>Contact</p>
          <a
            href="tel:+254107025582"
            className={styles.colItem}
          >
            +254 107 025 582
          </a>
          <a
            href="tel:+254720343201"
            className={styles.colItem}
          >
            +254 720 343 201
          </a>
          <a
            href="mailto:training@siccai.org"
            className={styles.colItem}
          >
            training@siccai.org
          </a>
          <a
            href="mailto:info@siccai.org"
            className={styles.colItem}
          >
            info@siccai.org
          </a>
          <a
            href="https://www.siccai.org"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.colItem}
          >
            www.siccai.org
          </a>
        </div>

        {/* Event */}
        <div className={styles.col}>
          <p className={styles.colHeading}>Event</p>
          <span className={styles.colItem}>The Bay Hotel</span>
          <span className={styles.colItem}>Cape Town, South Africa</span>
          <span className={`${styles.colItem} ${styles.colItemAccent}`}>
            11–15 May 2026
          </span>
          <span className={styles.colItem}>9:00am – 4:00pm daily</span>
          <span className={styles.hashtag}>#siccai2026</span>
        </div>

        {/* Register */}
        <div className={styles.col}>
          <p className={styles.colHeading}>Register</p>
          <a
            href="https://www.siccai.org/south-africa-summit-registration/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.colItem}
          >
            Register Online →
          </a>
          <a
            href="/siccai-cape-town-summit-brochure.pdf"
            download="SICCAI-Cape-Town-Summit-2026.pdf"
            className={styles.colItem}
          >
            Download Brochure
          </a>
          <p className={styles.partnerNote}>
            In partnership with ArtinTech,<br />Toronto, Canada
          </p>
        </div>

      </div>

      {/* ── Bottom bar ── */}
      <div className={styles.bottomBar}>
        <div className={styles.bottomInner}>
          <span className={styles.copyright}>
            © 2026 SICC AI · Nairobi, Kenya
          </span>
          <div className={styles.bottomLinks}>
            <a
              href="mailto:training@siccai.org"
              className={styles.bottomLink}
            >
              training@siccai.org
            </a>
            <a
              href="https://www.siccai.org"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.bottomLink}
            >
              siccai.org
            </a>
          </div>
        </div>
      </div>

    </footer>
  )
}
