'use client'

/* `inert` is boolean | undefined in React 18's type definitions */

import { useState, useCallback } from 'react'
import styles from './RegistrationForm.module.css'

/* ─── Types ──────────────────────────────────────────────────────────────────── */
interface FormValues {
  firstName:            string
  lastName:             string
  nationality:          string
  organization:         string
  jobTitle:             string
  email:                string
  countryCode:          string
  phone:                string
  accessibilityNeeds:   '' | 'yes' | 'no'
  accessibilityDetails: string
  ticketType:           '' | 'networking' | 'corporate' | 'individual'
  consent1:             boolean
  consent2:             boolean
  consent3:             boolean
}

type Errors = Partial<Record<keyof FormValues, string>>

/* ─── Constants ──────────────────────────────────────────────────────────────── */
const INITIAL: FormValues = {
  firstName: '', lastName: '', nationality: '', organization: '', jobTitle: '',
  email: '', countryCode: '+254', phone: '',
  accessibilityNeeds: '', accessibilityDetails: '',
  ticketType: '', consent1: false, consent2: false, consent3: false,
}

const COUNTRY_CODES = [
  { code: '+254', label: '+254  Kenya'          },
  { code: '+27',  label: '+27   South Africa'   },
  { code: '+234', label: '+234  Nigeria'         },
  { code: '+233', label: '+233  Ghana'           },
  { code: '+256', label: '+256  Uganda'          },
  { code: '+255', label: '+255  Tanzania'        },
  { code: '+260', label: '+260  Zambia'          },
  { code: '+263', label: '+263  Zimbabwe'        },
  { code: '+237', label: '+237  Cameroon'        },
  { code: '+225', label: '+225  Côte d\'Ivoire'  },
  { code: '+221', label: '+221  Senegal'         },
  { code: '+212', label: '+212  Morocco'         },
  { code: '+20',  label: '+20   Egypt'           },
  { code: '+251', label: '+251  Ethiopia'        },
  { code: '+1',   label: '+1    US / Canada'     },
  { code: '+44',  label: '+44   United Kingdom'  },
  { code: '+33',  label: '+33   France'          },
  { code: '+49',  label: '+49   Germany'         },
  { code: '+971', label: '+971  UAE'             },
  { code: '+91',  label: '+91   India'           },
  { code: '+61',  label: '+61   Australia'       },
]

/* Prices verbatim from PDF */
const TICKETS = [
  { id: 'networking' as const, label: 'Networking Event Only',  price: '1,175', date: '15 May 2026'       },
  { id: 'corporate'  as const, label: 'Main Event · Corporate', price: '2,270', date: '11–14 May 2026'    },
  { id: 'individual' as const, label: 'Main Event · Individual',price: '2,740', date: '11–14 May 2026'    },
]

const CONSENTS = [
  { field: 'consent1' as const, text: 'I confirm my registration for this non-technical training.', required: true  },
  { field: 'consent2' as const, text: 'I agree to receive training materials and updates via email.', required: true  },
  { field: 'consent3' as const, text: 'I consent to the use of training session photos/videos for internal or promotional purposes.', required: false, optional: true },
]

/* ─── Validation ─────────────────────────────────────────────────────────────── */
function validateStep1(v: FormValues): Errors {
  const e: Errors = {}
  if (!v.firstName.trim())    e.firstName    = 'First name is required'
  if (!v.lastName.trim())     e.lastName     = 'Last name is required'
  if (!v.nationality.trim())  e.nationality  = 'Country / nationality is required'
  if (!v.organization.trim()) e.organization = 'Organisation is required'
  if (!v.jobTitle.trim())     e.jobTitle     = 'Job title is required'
  return e
}

function validateStep2(v: FormValues): Errors {
  const e: Errors = {}
  if (!v.email.trim())
    e.email = 'Email address is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email))
    e.email = 'Enter a valid email address'
  if (!v.phone.trim())
    e.phone = 'Phone number is required'
  if (!v.accessibilityNeeds)
    e.accessibilityNeeds = 'Please select an option'
  return e
}

function validateStep3(v: FormValues): Errors {
  const e: Errors = {}
  if (!v.ticketType) e.ticketType = 'Please select a ticket type to continue'
  if (!v.consent1)   e.consent1   = 'This confirmation is required to register'
  if (!v.consent2)   e.consent2   = 'This agreement is required to register'
  return e
}

/* ─── Sub-components ─────────────────────────────────────────────────────────── */
function Field({
  label, required, error, children,
}: {
  label: string; required?: boolean; error?: string; children: React.ReactNode
}) {
  return (
    <div className={styles.fieldWrap}>
      <label className={styles.fieldLabel}>
        {label}
        {required && <span className={styles.fieldRequired} aria-hidden="true"> *</span>}
      </label>
      {children}
      {error && <p className={styles.errorMsg} role="alert">{error}</p>}
    </div>
  )
}

function SuccessIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="32" cy="32" r="30" stroke="var(--color-gold)" strokeWidth="1" opacity="0.25"/>
      <circle cx="32" cy="32" r="22" stroke="var(--color-gold)" strokeWidth="1.25"/>
      <path
        d="M21 32l8 8 14-16"
        stroke="var(--color-gold)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CheckDot() {
  return (
    <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
      <path d="M1 4l3 3 5-6" stroke="var(--color-bg)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

/* ─── Main component ─────────────────────────────────────────────────────────── */
export default function RegistrationForm() {
  const [step,        setStep]        = useState(1)
  const [exitingStep, setExitingStep] = useState<number | null>(null)
  const [direction,   setDirection]   = useState<'fwd' | 'bwd'>('fwd')
  const [values,      setValues]      = useState<FormValues>(INITIAL)
  const [errors,      setErrors]      = useState<Errors>({})
  const [submitting,  setSubmitting]  = useState(false)
  const [submitted,   setSubmitted]   = useState(false)

  const set = useCallback((field: keyof FormValues, value: string | boolean) => {
    setValues(prev => ({ ...prev, [field]: value }))
    setErrors(prev => { const n = { ...prev }; delete n[field]; return n })
  }, [])

  const advance = () => {
    const errs = step === 1 ? validateStep1(values) : validateStep2(values)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setDirection('fwd')
    setExitingStep(step)
    setStep(s => s + 1)
  }

  const back = () => {
    setErrors({})
    setDirection('bwd')
    setExitingStep(step)
    setStep(s => s - 1)
  }

  const handleSubmit = () => {
    const errs = validateStep3(values)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setSubmitting(true)
    setTimeout(() => { setSubmitting(false); setSubmitted(true) }, 1500)
  }

  /* ── Success state ── */
  if (submitted) {
    return (
      <section className={styles.section} aria-label="Registration confirmed">
        <div className={styles.inner}>
          <div className={styles.success}>
            <div className={styles.successIcon}><SuccessIcon /></div>
            <h2 className={styles.successHeading}>You&apos;re Registered</h2>
            <p className={styles.successMessage}>
              Thank you, {values.firstName}. We&apos;ll be in touch within 24 hours
              with payment details and logistics for the Continental Summit on
              Cybersecurity &amp; AI — Cape Town 2026.
            </p>
          </div>
        </div>
      </section>
    )
  }

  /* ── Main form ── */
  return (
    <section className={styles.section} aria-labelledby="form-heading">
      <div className={styles.inner}>

        {/* Header */}
        <header className={styles.header}>
          <h2 id="form-heading" className={styles.heading}>
            Secure Your Place at the Summit
          </h2>
          <p className={styles.subText}>
            Complete the form below. Our team will confirm your registration
            within 24 hours.
          </p>
        </header>

        <div className={styles.formWrap}>

          {/* ── Progress indicator ── */}
          <nav className={styles.progress} aria-label="Registration steps">
            {[
              { num: 1, label: 'About You'     },
              { num: 2, label: 'Contact'        },
              { num: 3, label: 'Registration'   },
            ].map(({ num, label }, i, arr) => (
              <div key={num} className={styles.progressItem}>
                <div
                  className={`${styles.progressDot} ${step >= num ? styles.progressDotActive : ''}`}
                  aria-current={step === num ? 'step' : undefined}
                >
                  {step > num ? <CheckDot /> : <span>{num}</span>}
                </div>
                <span className={`${styles.progressLabel} ${step === num ? styles.progressLabelActive : ''}`}>
                  {label}
                </span>
                {i < arr.length - 1 && (
                  <div
                    className={`${styles.progressLine} ${step > num ? styles.progressLineFilled : ''}`}
                    aria-hidden="true"
                  />
                )}
              </div>
            ))}
          </nav>

          {/* ── Step panels ── */}
          <div className={styles.stepOuter}>

            {/* Exiting panel — absolute overlay, animated away */}
            {exitingStep !== null && (() => {
              const n = exitingStep
              return (
                <div
                  className={styles.stepExiting}
                  data-dir={direction}
                  onAnimationEnd={() => setExitingStep(null)}
                  aria-hidden="true"
                >
                  {n === 1 && (
                    <>
                      <p className={styles.stepTitle}>About You</p>
                      <div className={styles.fieldRow}>
                        <Field label="First Name" required><input className={styles.input} value={values.firstName} readOnly /></Field>
                        <Field label="Last Name"  required><input className={styles.input} value={values.lastName}  readOnly /></Field>
                      </div>
                      <Field label="Country / Nationality" required><input className={styles.input} value={values.nationality}  readOnly /></Field>
                      <Field label="Organisation / Company" required><input className={styles.input} value={values.organization} readOnly /></Field>
                      <Field label="Job Title / Role" required><input className={styles.input} value={values.jobTitle} readOnly /></Field>
                    </>
                  )}
                  {n === 2 && (
                    <>
                      <p className={styles.stepTitle}>Contact Details</p>
                      <Field label="Email Address" required><input className={styles.input} value={values.email} readOnly /></Field>
                      <Field label="Phone Number"  required><input className={styles.input} value={`${values.countryCode} ${values.phone}`} readOnly /></Field>
                    </>
                  )}
                  {n === 3 && (
                    <p className={styles.stepTitle}>Your Registration</p>
                  )}
                </div>
              )
            })()}

            {/* Active panel */}
            <div
              className={styles.stepActive}
              data-dir={direction}
              key={step}
            >

              {/* ── Step 1: About You ── */}
              {step === 1 && (
                <>
                  <p className={styles.stepTitle}>About You</p>

                  <div className={styles.fieldRow}>
                    <Field label="First Name" required error={errors.firstName}>
                      <input
                        className={`${styles.input} ${errors.firstName ? styles.inputError : ''}`}
                        value={values.firstName}
                        onChange={e => set('firstName', e.target.value)}
                        autoComplete="given-name"
                        placeholder="Amara"
                      />
                    </Field>
                    <Field label="Last Name" required error={errors.lastName}>
                      <input
                        className={`${styles.input} ${errors.lastName ? styles.inputError : ''}`}
                        value={values.lastName}
                        onChange={e => set('lastName', e.target.value)}
                        autoComplete="family-name"
                        placeholder="Osei"
                      />
                    </Field>
                  </div>

                  <Field label="Country / Nationality" required error={errors.nationality}>
                    <input
                      className={`${styles.input} ${errors.nationality ? styles.inputError : ''}`}
                      value={values.nationality}
                      onChange={e => set('nationality', e.target.value)}
                      autoComplete="country-name"
                      placeholder="e.g. Kenya"
                    />
                  </Field>

                  <Field label="Organisation / Company" required error={errors.organization}>
                    <input
                      className={`${styles.input} ${errors.organization ? styles.inputError : ''}`}
                      value={values.organization}
                      onChange={e => set('organization', e.target.value)}
                      autoComplete="organization"
                      placeholder="e.g. East Africa Development Bank"
                    />
                  </Field>

                  <Field label="Job Title / Role" required error={errors.jobTitle}>
                    <input
                      className={`${styles.input} ${errors.jobTitle ? styles.inputError : ''}`}
                      value={values.jobTitle}
                      onChange={e => set('jobTitle', e.target.value)}
                      autoComplete="organization-title"
                      placeholder="e.g. Chief Executive Officer"
                    />
                  </Field>

                  <div className={styles.stepFooter}>
                    <span />
                    <button type="button" className={styles.continueBtn} onClick={advance}>
                      Continue
                    </button>
                  </div>
                </>
              )}

              {/* ── Step 2: Contact Details ── */}
              {step === 2 && (
                <>
                  <p className={styles.stepTitle}>Contact Details</p>

                  <Field label="Email Address" required error={errors.email}>
                    <input
                      className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                      type="email"
                      value={values.email}
                      onChange={e => set('email', e.target.value)}
                      autoComplete="email"
                      placeholder="you@organisation.com"
                    />
                  </Field>

                  <Field label="Phone Number" required error={errors.phone}>
                    <div className={styles.phoneRow}>
                      <select
                        className={styles.countryCodeSelect}
                        value={values.countryCode}
                        onChange={e => set('countryCode', e.target.value)}
                        aria-label="Country calling code"
                      >
                        {COUNTRY_CODES.map(({ code, label }) => (
                          <option key={code} value={code}>{label}</option>
                        ))}
                      </select>
                      <input
                        className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                        type="tel"
                        value={values.phone}
                        onChange={e => set('phone', e.target.value)}
                        autoComplete="tel-national"
                        placeholder="712 345 678"
                        style={{ flex: 1 }}
                      />
                    </div>
                  </Field>

                  {/* Accessibility needs */}
                  <div className={styles.fieldGroup}>
                    <p className={styles.fieldLabel}>
                      Do you have any accessibility or accommodation needs?
                      <span className={styles.fieldRequired} aria-hidden="true"> *</span>
                    </p>
                    <div className={styles.toggleRow} role="group" aria-label="Accessibility or accommodation needs">
                      {(['no', 'yes'] as const).map(opt => (
                        <button
                          key={opt}
                          type="button"
                          className={`${styles.toggleBtn} ${values.accessibilityNeeds === opt ? styles.toggleBtnActive : ''}`}
                          onClick={() => set('accessibilityNeeds', opt)}
                          aria-pressed={values.accessibilityNeeds === opt}
                        >
                          {opt === 'yes' ? 'Yes' : 'No'}
                        </button>
                      ))}
                    </div>
                    {errors.accessibilityNeeds && (
                      <p className={styles.errorMsg} role="alert">{errors.accessibilityNeeds}</p>
                    )}

                    <div className={`${styles.expandable} ${values.accessibilityNeeds === 'yes' ? styles.expandableOpen : ''}`}>
                      <div className={styles.expandableInner}>
                        <Field label="Please describe your needs" error={undefined}>
                          <textarea
                            className={styles.textarea}
                            rows={3}
                            value={values.accessibilityDetails}
                            onChange={e => set('accessibilityDetails', e.target.value)}
                            placeholder="Please specify any accessibility or accommodation requirements…"
                          />
                        </Field>
                      </div>
                    </div>
                  </div>

                  <div className={styles.stepFooter}>
                    <button type="button" className={styles.backBtn} onClick={back}>
                      ← Back
                    </button>
                    <button type="button" className={styles.continueBtn} onClick={advance}>
                      Continue
                    </button>
                  </div>
                </>
              )}

              {/* ── Step 3: Your Registration ── */}
              {step === 3 && (
                <>
                  <p className={styles.stepTitle}>Your Registration</p>

                  {/* Ticket selector */}
                  <div className={styles.fieldGroup}>
                    <p className={styles.fieldLabel}>
                      Ticket Type
                      <span className={styles.fieldRequired} aria-hidden="true"> *</span>
                    </p>
                    <div
                      className={styles.ticketGrid}
                      role="radiogroup"
                      aria-label="Select ticket type"
                    >
                      {TICKETS.map(({ id, label, price, date }) => (
                        <div
                          key={id}
                          className={`${styles.ticketCard} ${values.ticketType === id ? styles.ticketCardSelected : ''}`}
                          onClick={() => set('ticketType', id)}
                          role="radio"
                          aria-checked={values.ticketType === id}
                          tabIndex={0}
                          onKeyDown={e => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              set('ticketType', id)
                            }
                          }}
                        >
                          <p className={styles.ticketLabel}>{label}</p>
                          <div className={styles.ticketPrice}>
                            <span className={styles.ticketCurrency}>USD</span>
                            <span className={styles.ticketAmount}>{price}</span>
                          </div>
                          <p className={styles.ticketDate}>{date}</p>
                          {values.ticketType === id && (
                            <span className={styles.ticketCheck} aria-hidden="true">✓</span>
                          )}
                        </div>
                      ))}
                    </div>
                    {errors.ticketType && (
                      <p className={styles.errorMsg} role="alert">{errors.ticketType}</p>
                    )}
                  </div>

                  {/* Consent checkboxes */}
                  <div className={styles.consentGroup} role="group" aria-label="Registration agreements">
                    {CONSENTS.map(({ field, text, required, optional }) => (
                      <label key={field} className={styles.checkboxRow}>
                        <input
                          type="checkbox"
                          className={styles.checkboxInput}
                          checked={values[field] as boolean}
                          onChange={e => set(field, e.target.checked)}
                          required={required}
                        />
                        <span className={styles.checkboxCustom} />
                        <span className={styles.checkboxLabel}>
                          {text}
                          {optional && <span className={styles.optionalTag}> (optional)</span>}
                        </span>
                        {errors[field] && (
                          <span className={styles.checkboxError} role="alert">{errors[field]}</span>
                        )}
                      </label>
                    ))}
                  </div>

                  {/* Submit */}
                  <button
                    type="button"
                    className={styles.submitBtn}
                    onClick={handleSubmit}
                    disabled={submitting}
                    aria-busy={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className={styles.spinner} aria-hidden="true" />
                        <span>Processing…</span>
                      </>
                    ) : (
                      'Complete Registration'
                    )}
                  </button>

                  <div className={styles.stepFooter} style={{ marginTop: 'var(--space-sm)' }}>
                    <button type="button" className={styles.backBtn} onClick={back}>
                      ← Back
                    </button>
                  </div>
                </>
              )}

            </div>{/* end .stepActive */}
          </div>{/* end .stepOuter */}

        </div>{/* end .formWrap */}
      </div>
    </section>
  )
}
