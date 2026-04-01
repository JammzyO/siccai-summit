'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './Nav.module.css'

/* ─── Nav links ──────────────────────────────────────────────────────────────── */
const NAV_LINKS = [
  { label: 'Overview',    href: '#overview'     },
  { label: 'Programme',   href: '#programme'    },
  { label: 'Why Attend',  href: '#credibility'  },
  { label: 'Pricing',     href: '#pricing'      },
]

/* ─── Countdown ──────────────────────────────────────────────────────────────── */
const SUMMIT_DATE = new Date('2026-05-11T09:00:00+02:00')

function getTimeLeft() {
  const diff = SUMMIT_DATE.getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days:    Math.floor(diff / 86400000),
    hours:   Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  }
}

function pad(n: number) { return String(n).padStart(2, '0') }

function Countdown({ compact = false }: { compact?: boolean }) {
  const [time, setTime] = useState<ReturnType<typeof getTimeLeft> | null>(null)

  useEffect(() => {
    setTime(getTimeLeft())
    const id = setInterval(() => setTime(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  if (!time) return null

  const units = [
    { value: time.days,    label: 'Days' },
    { value: time.hours,   label: 'Hrs'  },
    { value: time.minutes, label: 'Min'  },
    { value: time.seconds, label: 'Sec'  },
  ]

  return (
    <div
      className={compact ? styles.mobileCountdown : styles.countdown}
      role="timer"
      aria-label="Time until summit"
    >
      {units.map((u, i) => (
        <div key={u.label} style={{ display: 'contents' }}>
          <div className={styles.countUnit}>
            <span className={styles.countNum}>{pad(u.value)}</span>
            <span className={styles.countLabel}>{u.label}</span>
          </div>
          {i < units.length - 1 && (
            <span className={styles.countSep} aria-hidden="true">:</span>
          )}
        </div>
      ))}
    </div>
  )
}

/* ─── Smooth-scroll helper ───────────────────────────────────────────────────── */
function scrollTo(href: string, closeMenu?: () => void) {
  if (!href.startsWith('#')) return
  const el = document.querySelector(href)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    closeMenu?.()
  }
}

/* ─── Nav ────────────────────────────────────────────────────────────────────── */
export default function Nav() {
  const [scrolled,      setScrolled]      = useState(false)
  const [ctaHighlight,  setCtaHighlight]  = useState(false)
  const [menuOpen,      setMenuOpen]      = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const navRef = useRef<HTMLElement>(null)

  /* Scroll state */
  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 80)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  /* Highlight CTA after hero leaves viewport */
  useEffect(() => {
    const hero = document.getElementById('hero')
    if (!hero) return
    const obs = new IntersectionObserver(
      ([e]) => setCtaHighlight(!e.isIntersecting),
      { threshold: 0 }
    )
    obs.observe(hero)
    return () => obs.disconnect()
  }, [])

  /* Active section tracker */
  useEffect(() => {
    const ids = ['hero', 'overview', 'programme', 'credibility', 'pricing', 'register']
    const observers: IntersectionObserver[] = []

    ids.forEach(id => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setActiveSection(id) },
        { rootMargin: '-40% 0px -55% 0px' }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach(o => o.disconnect())
  }, [])

  /* Close menu on resize */
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 900) setMenuOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  /* Lock body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const close = () => setMenuOpen(false)

  const navClass = [
    styles.nav,
    scrolled     ? styles.scrolled    : '',
    ctaHighlight ? styles.ctaHighlight : '',
  ].filter(Boolean).join(' ')

  return (
    <>
      <nav ref={navRef} className={navClass} aria-label="Primary navigation">
        <div className={styles.inner}>

          {/* Logo */}
          <div className={styles.logoWrap}>
            <Link href="/" aria-label="SICC AI — home" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <Image
                src="/logo.png"
                alt="SICC AI"
                width={341}
                height={356}
                style={{ height: '40px', width: 'auto' }}
                priority
              />
            </Link>
          </div>

          {/* Desktop links */}
          <ul className={styles.links} role="list">
            {NAV_LINKS.map(({ label, href }) => {
              const sectionId = href.slice(1)
              const isActive = activeSection === sectionId
              return (
                <li key={href}>
                  <a
                    href={href}
                    className={`${styles.link} ${isActive ? styles.linkActive : ''}`}
                    onClick={e => { e.preventDefault(); scrollTo(href) }}
                    aria-current={isActive ? 'location' : undefined}
                  >
                    {label}
                  </a>
                </li>
              )
            })}
          </ul>

          {/* Countdown — desktop */}
          <div className={styles.countdownWrap}>
            <Countdown />
          </div>

          {/* CTA */}
          <div className={styles.ctaWrap}>
            <a
              href="#register"
              className={styles.cta}
              onClick={e => { e.preventDefault(); scrollTo('#register') }}
            >
              Register Now
            </a>
          </div>

          {/* Hamburger */}
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

      {/* Mobile drawer */}
      <div
        id="mobile-nav"
        className={`${styles.mobileMenu} ${menuOpen ? styles.open : ''}`}
        aria-hidden={!menuOpen}
      >
        <ul className={styles.mobileLinks} role="list">
          {NAV_LINKS.map(({ label, href }) => {
            const sectionId = href.slice(1)
            const isActive = activeSection === sectionId
            return (
              <li key={href}>
                <a
                  href={href}
                  className={`${styles.mobileLink} ${isActive ? styles.mobileLinkActive : ''}`}
                  onClick={e => { e.preventDefault(); scrollTo(href, close) }}
                  aria-current={isActive ? 'location' : undefined}
                >
                  {label}
                </a>
              </li>
            )
          })}
        </ul>

        <div className={styles.mobileDivider} aria-hidden="true" />
        <Countdown compact />

        <a
          href="#register"
          className={styles.mobileCta}
          onClick={e => { e.preventDefault(); scrollTo('#register', close) }}
        >
          Reserve My Seat
        </a>
      </div>

      {/* Backdrop */}
      {menuOpen && (
        <div className={styles.backdrop} onClick={close} aria-hidden="true" />
      )}
    </>
  )
}
