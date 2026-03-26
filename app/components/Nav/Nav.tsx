'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './Nav.module.css'

/* ─── Types ──────────────────────────────────────────────────────────────────── */
interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

/* ─── Summit target date ─────────────────────────────────────────────────────── */
const SUMMIT_DATE = new Date('2026-05-11T09:00:00+02:00') // SAST (UTC+2)

function getTimeLeft(): TimeLeft {
  const diff = SUMMIT_DATE.getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  const days    = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  return { days, hours, minutes, seconds }
}

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

/* ─── Countdown atom ─────────────────────────────────────────────────────────── */
function CountdownDisplay({ compact = false }: { compact?: boolean }) {
  const [time, setTime] = useState<TimeLeft | null>(null)

  useEffect(() => {
    setTime(getTimeLeft())
    const id = setInterval(() => setTime(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  if (!time) return null // avoid hydration mismatch

  const units = [
    { value: time.days,    label: 'Days'    },
    { value: time.hours,   label: 'Hours'   },
    { value: time.minutes, label: 'Mins'    },
    { value: time.seconds, label: 'Secs'    },
  ]

  const wrapClass = compact ? styles.mobileCountdown : styles.countdown

  return (
    <div className={wrapClass} role="timer" aria-label="Time until summit">
      {units.map((u, i) => (
        <div key={u.label} style={{ display: 'contents' }}>
          <div className={styles.countUnit}>
            <span className={styles.countNum}>{pad(u.value)}</span>
            <span className={styles.countLabel}>{u.label}</span>
          </div>
          {i < units.length - 1 && (
            <span className={styles.countDivider} aria-hidden="true">:</span>
          )}
        </div>
      ))}
    </div>
  )
}

/* ─── Nav ────────────────────────────────────────────────────────────────────── */
export default function Nav() {
  const [scrolled, setScrolled]       = useState(false)
  const [ctaHighlight, setCtaHighlight] = useState(false)
  const [menuOpen, setMenuOpen]       = useState(false)
  const navRef = useRef<HTMLElement>(null)

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 80)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  /* Highlight CTA once hero section leaves viewport */
  useEffect(() => {
    const hero = document.getElementById('hero')
    if (!hero) return
    const obs = new IntersectionObserver(
      ([entry]) => setCtaHighlight(!entry.isIntersecting),
      { threshold: 0 }
    )
    obs.observe(hero)
    return () => obs.disconnect()
  }, [])

  // Close mobile menu on resize above breakpoint
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768) setMenuOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const navClass = [
    styles.nav,
    scrolled      ? styles.scrolled     : '',
    ctaHighlight  ? styles.ctaHighlight  : '',
  ].filter(Boolean).join(' ')

  return (
    <>
      <nav ref={navRef} className={navClass} aria-label="Primary navigation">
        <div className={styles.inner}>

          {/* ── Logo ── */}
          <div className={styles.logoWrap}>
            <Link href="/" aria-label="SICC AI — home">
              <Image
                src="/logo.png"
                alt="SICC AI"
                width={341}
                height={356}
                style={{ height: '44px', width: 'auto' }}
                priority
              />
            </Link>
          </div>

          {/* ── Countdown (desktop) ── */}
          <CountdownDisplay />

          {/* ── CTA + hamburger ── */}
          <div className={styles.ctaWrap}>
            <a
              href="https://www.siccai.org/south-africa-summit-registration/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.cta}
            >
              Register Now
            </a>
          </div>

          {/* ── Hamburger (mobile only) ── */}
          <button
            className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen(prev => !prev)}
          >
            <span />
            <span />
            <span />
          </button>

        </div>
      </nav>

      {/* ── Mobile drawer ── */}
      <div
        id="mobile-nav"
        className={`${styles.mobileMenu} ${menuOpen ? styles.open : ''}`}
        aria-hidden={!menuOpen}
      >
        <CountdownDisplay compact />
        <a
          href="https://www.siccai.org/south-africa-summit-registration/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.mobileCta}
          onClick={() => setMenuOpen(false)}
        >
          Register Now
        </a>
      </div>
    </>
  )
}
