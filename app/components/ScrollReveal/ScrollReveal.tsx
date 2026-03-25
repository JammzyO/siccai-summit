'use client'

import { useEffect } from 'react'

/**
 * Mounts once in the root layout.
 * Observes all elements with class "reveal" and toggles "visible"
 * when they enter the viewport — triggering the fade-up animation
 * defined in globals.css.
 */
export default function ScrollReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>('.reveal')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            // Unobserve after reveal — animation plays once
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )

    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return null
}
