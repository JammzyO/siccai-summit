'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import styles from './RegistrationForm.module.css'

/* ─── Types ──────────────────────────────────────────────────────────────────── */
type TicketType = '' | 'individual' | 'corporate' | 'institutional' | 'networking'

interface FormValues {
  ticketType:     TicketType
  /* Step 2 — Qualify */
  orgType:        '' | 'government' | 'finance' | 'telecom' | 'health' | 'education' | 'ngo' | 'private' | 'other'
  orgTypeOther:   string
  region:         '' | 'comesa' | 'sadc' | 'au_other' | 'outside'
  priority:       '' | 'availability' | 'breach' | 'policy' | 'ai' | 'compliance' | 'other'
  priorityOther:  string
  delegateCount:  string
  /* Step 3 — Budget */
  budgetStatus:   '' | 'approved' | 'in-progress' | 'not-yet'
  timeframe:      '' | '0-30' | '31-90' | '90+'
  contactPref:    '' | 'whatsapp' | 'email' | 'assistant'
  invoiceNeeded:  boolean
  /* Step 4 — Contact */
  fullName:           string
  jobTitle:           string
  organization:       string
  country:            string
  email:              string
  whatsapp:           string
  execAssistName:     string
  execAssistWhatsapp: string
  execAssistEmail:    string
  showExecAssist:     boolean
}

type Errors = Partial<Record<keyof FormValues, string>>

const INITIAL: FormValues = {
  ticketType: '',
  orgType: '', orgTypeOther: '', region: '',
  priority: '', priorityOther: '', delegateCount: '',
  budgetStatus: '', timeframe: '', contactPref: '', invoiceNeeded: false,
  fullName: '', jobTitle: '', organization: '', country: '',
  email: '', whatsapp: '',
  execAssistName: '', execAssistWhatsapp: '', execAssistEmail: '',
  showExecAssist: false,
}

/* ─── Lane routing ───────────────────────────────────────────────────────────── */
type Lane = 'individual' | 'team' | 'partner' | 'networking'
function getLane(t: TicketType): Lane {
  if (t === 'networking')    return 'networking'
  if (t === 'institutional') return 'partner'
  if (t === 'corporate')     return 'team'
  return 'individual'
}

/* ─── Ticket config ──────────────────────────────────────────────────────────── */
const TICKET_CONFIG: Record<string, { name: string; price: string | null; note: string; sub: string }> = {
  individual:    { name: 'Main Event · Individual',    price: '2,740', note: 'per seat',   sub: '11–14 May 2026 · 4 days' },
  corporate:     { name: 'Main Event · Corporate',     price: '2,270', note: 'per seat',   sub: '2–5 seats · 11–14 May 2026' },
  institutional: { name: 'Institutional Package',      price: null,    note: '',           sub: '6–15 seats · contact us' },
  networking:    { name: 'Networking Event Only',      price: '1,175', note: 'per person', sub: '15 May 2026' },
}

const TICKETS = Object.entries(TICKET_CONFIG).map(([id, v]) => ({ id: id as TicketType, ...v }))

/* ─── Validation ─────────────────────────────────────────────────────────────── */
function validateStep2(v: FormValues): Errors {
  const e: Errors = {}
  if (!v.region) e.region = 'Please select your region'
  if (v.ticketType !== 'networking') {
    if (!v.orgType) e.orgType = 'Please select your organisation type'
    if (v.orgType === 'other' && !v.orgTypeOther.trim()) e.orgTypeOther = 'Please describe your organisation'
    if (!v.priority) e.priority = 'Please select your main priority'
    if (v.priority === 'other' && !v.priorityOther.trim()) e.priorityOther = 'Please describe your priority'
  }
  if (v.ticketType === 'corporate') {
    const n = parseInt(v.delegateCount, 10)
    if (!v.delegateCount || isNaN(n) || n < 2) e.delegateCount = 'Minimum 2 delegates for corporate tickets'
    else if (n > 5) e.delegateCount = 'For 6 or more delegates, choose the Institutional Package'
  }
  if (v.ticketType === 'institutional') {
    const n = parseInt(v.delegateCount, 10)
    if (!v.delegateCount || isNaN(n) || n < 6) e.delegateCount = 'Minimum 6 delegates for institutional tickets'
  }
  return e
}

function validateStep3(v: FormValues): Errors {
  const e: Errors = {}
  if (!v.budgetStatus) e.budgetStatus = 'Please select a budget status'
  if (!v.timeframe)    e.timeframe    = 'Please select a timeframe'
  if (!v.contactPref)  e.contactPref  = 'Please select a contact preference'
  return e
}

function validateStep4(v: FormValues): Errors {
  const e: Errors = {}
  if (!v.fullName.trim())     e.fullName     = 'Full name is required'
  if (!v.jobTitle.trim())     e.jobTitle     = 'Job title is required'
  if (!v.organization.trim()) e.organization = 'Organisation is required'
  if (!v.country.trim())      e.country      = 'Country is required'
  if (!v.email.trim())
    e.email = 'Email address is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email))
    e.email = 'Enter a valid email address (e.g. name@organisation.com)'
  const cleanPhone = v.whatsapp.replace(/[\s\-().]/g, '')
  if (!v.whatsapp.trim())
    e.whatsapp = 'WhatsApp number is required'
  else if (!/^\+[1-9]\d{6,14}$/.test(cleanPhone))
    e.whatsapp = 'Enter a valid international number starting with + (e.g. +254 712 345 678)'
  return e
}

/* ─── Sub-components ─────────────────────────────────────────────────────────── */
function Field({ label, required, error, children }: {
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

function RadioCards({ label, required, error, options, value, onChange }: {
  label: string; required?: boolean; error?: string
  options: { id: string; label: string }[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className={styles.fieldWrap}>
      <label className={styles.fieldLabel}>
        {label}
        {required && <span className={styles.fieldRequired} aria-hidden="true"> *</span>}
      </label>
      <div className={styles.radioGrid} role="group" aria-label={label}>
        {options.map(opt => (
          <button
            key={opt.id}
            type="button"
            className={`${styles.radioCard} ${value === opt.id ? styles.radioCardSelected : ''}`}
            onClick={() => onChange(opt.id)}
            aria-pressed={value === opt.id}
          >
            <span className={styles.radioCheck} aria-hidden="true">
              {value === opt.id && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4l3 3 5-6" stroke="var(--color-bg)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </span>
            <span className={styles.radioLabel}>{opt.label}</span>
          </button>
        ))}
      </div>
      {error && <p className={styles.errorMsg} role="alert">{error}</p>}
    </div>
  )
}

function SelectField({ label, required, error, value, onChange, placeholder, children }: {
  label: string; required?: boolean; error?: string
  value: string; onChange: (v: string) => void
  placeholder: string; children: React.ReactNode
}) {
  return (
    <Field label={label} required={required} error={error}>
      <select
        className={`${styles.selectField} ${error ? styles.inputError : ''}`}
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        <option value="" disabled>{placeholder}</option>
        {children}
      </select>
    </Field>
  )
}

function NumberStepper({ value, onChange, min, max, error }: {
  value: string; onChange: (v: string) => void
  min: number; max: number; error?: string
}) {
  const n = parseInt(value, 10)
  return (
    <div className={`${styles.stepper} ${error ? styles.stepperError : ''}`}>
      <button type="button" className={styles.stepperBtn}
        onClick={() => { if (!isNaN(n) && n > min) onChange(String(n - 1)) }}
        aria-label="Decrease" disabled={!isNaN(n) && n <= min}>−</button>
      <input
        className={styles.stepperInput}
        type="text" inputMode="numeric"
        value={value} placeholder={String(min)}
        onChange={e => onChange(e.target.value.replace(/[^0-9]/g, ''))}
        onBlur={e => {
          const v = parseInt(e.target.value, 10)
          if (!isNaN(v)) onChange(String(Math.min(max, Math.max(min, v))))
        }}
      />
      <button type="button" className={styles.stepperBtn}
        onClick={() => { if (isNaN(n)) onChange(String(min)); else if (n < max) onChange(String(n + 1)) }}
        aria-label="Increase" disabled={!isNaN(n) && n >= max}>+</button>
    </div>
  )
}

function SuccessIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <circle cx="32" cy="32" r="30" stroke="var(--color-gold)" strokeWidth="1" opacity="0.25"/>
      <circle cx="32" cy="32" r="22" stroke="var(--color-gold)" strokeWidth="1.25"/>
      <path d="M21 32l8 8 14-16" stroke="var(--color-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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

function LaneOutcome({ lane, values }: { lane: Lane; values: FormValues }) {
  if (lane === 'networking') return (
    <div className={styles.laneOutcome}>
      <p className={styles.laneOutcomeTitle}>Your next step</p>
      <p className={styles.laneOutcomeBody}>Our team will contact you within 24 hours with payment details and logistics for the Networking Event on 15 May 2026.</p>
    </div>
  )
  if (lane === 'individual') return (
    <div className={styles.laneOutcome}>
      <p className={styles.laneOutcomeTitle}>Your next step</p>
      <p className={styles.laneOutcomeBody}>
        {values.invoiceNeeded
          ? 'Our team will send a formal invoice and procurement documentation within 24 hours. Your seat will be reserved upon payment confirmation.'
          : 'Our team will contact you within 24 hours with payment details and logistics for your individual seat at the Summit.'}
      </p>
    </div>
  )
  if (lane === 'team') return (
    <div className={styles.laneOutcome}>
      <p className={styles.laneOutcomeTitle}>We will schedule your Executive Briefing</p>
      <p className={styles.laneOutcomeBody}>A 20-minute &ldquo;Secure &amp; Innovation-Ready Executive Briefing&rdquo; will be arranged for your team. Our team will reach out within 24 hours to confirm timing and share a calendar invite.</p>
    </div>
  )
  return (
    <div className={styles.laneOutcome}>
      <p className={styles.laneOutcomeTitle}>Institutional &amp; Partnership Inquiry</p>
      <p className={styles.laneOutcomeBody}>Your inquiry has been received. Our team will be in touch within 24 hours to discuss institutional seat allocation, invoice arrangements, and any MoU or partnership opportunities.</p>
    </div>
  )
}

/* ─── Label maps (used in webhook payload + WhatsApp message) ────────────────── */
const BUDGET_LABELS: Record<string, string> = {
  approved:     'Budget approved',
  'in-progress':'Budget approval in progress',
  'not-yet':    'Not yet budgeted',
}
const TIMEFRAME_LABELS: Record<string, string> = {
  '0-30': 'Ready to register now',
  '31-90':'Within the next month',
  '90+':  'Still exploring options',
}
const CONTACT_LABELS: Record<string, string> = {
  whatsapp:  'WhatsApp',
  email:     'Email',
  assistant: 'Via Executive Assistant',
}
const ORG_LABELS: Record<string, string> = {
  government: 'Government / Agency',
  finance:    'Bank / Financial Services',
  telecom:    'Telecom / ISP',
  health:     'Healthcare',
  education:  'Education',
  ngo:        'NGO / Development',
  private:    'Private Company',
}
const PRIORITY_LABELS: Record<string, string> = {
  availability: 'Reduce service disruption / downtime',
  breach:       'Prevent data loss / breach',
  policy:       'Build cybersecurity policy and controls',
  ai:           'Govern AI adoption / misinformation risk',
  compliance:   'Meet regulatory and cross-border compliance',
}
const REGION_LABELS: Record<string, string> = {
  comesa:   'COMESA Member State',
  sadc:     'SADC Member State',
  au_other: 'Other AU Member State',
  outside:  'Outside Africa',
}

/* ─── Org type options ───────────────────────────────────────────────────────── */
const ORG_TYPE_OPTIONS = [
  { id: 'government', label: 'Government / Agency' },
  { id: 'finance',    label: 'Bank / Financial Services' },
  { id: 'telecom',    label: 'Telecom / ISP' },
  { id: 'health',     label: 'Healthcare' },
  { id: 'education',  label: 'Education' },
  { id: 'ngo',        label: 'NGO / Development' },
  { id: 'private',    label: 'Private Company' },
  { id: 'other',      label: 'Other' },
]

/* ─── Main component ─────────────────────────────────────────────────────────── */
export default function RegistrationForm() {
  const [step,        setStep]        = useState(1)
  const [exitingStep, setExitingStep] = useState<number | null>(null)
  const [direction,   setDirection]   = useState<'fwd' | 'bwd'>('fwd')
  const [values,      setValues]      = useState<FormValues>(INITIAL)
  const [errors,      setErrors]      = useState<Errors>({})
  const [submitting,  setSubmitting]  = useState(false)
  const [submitted,   setSubmitted]   = useState(false)

  /* Refs for stale-closure-safe event handler */
  const ticketRef = useRef<TicketType>('')
  const stepRef   = useRef(1)
  useEffect(() => { ticketRef.current = values.ticketType }, [values.ticketType])
  useEffect(() => { stepRef.current   = step },              [step])

  /* Listen for preselect-ticket events fired by any CTA on the page */
  useEffect(() => {
    const handler = (e: Event) => {
      const ticket = (e as CustomEvent<{ ticket: TicketType }>).detail.ticket
      if (!['individual','corporate','institutional','networking'].includes(ticket)) return
      const isSame = ticketRef.current === ticket
      setValues(isSame ? prev => prev : { ...INITIAL, ticketType: ticket })
      setErrors({})
      setDirection('fwd')
      setExitingStep(stepRef.current > 1 ? stepRef.current : null)
      setStep(2)
    }
    window.addEventListener('preselect-ticket', handler)
    return () => window.removeEventListener('preselect-ticket', handler)
  }, [])

  /* Also handle sessionStorage on first mount (direct page load with stored ticket) */
  useEffect(() => {
    const stored = sessionStorage.getItem('preselected_ticket') as TicketType | null
    if (stored && ['individual','corporate','institutional','networking'].includes(stored)) {
      sessionStorage.removeItem('preselected_ticket')
      setValues({ ...INITIAL, ticketType: stored })
      setStep(2)
    }
  }, [])

  const lane = getLane(values.ticketType)

  const set = useCallback(<K extends keyof FormValues>(field: K, value: FormValues[K]) => {
    setValues(prev => ({ ...prev, [field]: value }))
    setErrors(prev => { const n = { ...prev }; delete n[field]; return n })
  }, [])

  /* Ticket card click on step 1 — auto-advance */
  const selectTicket = (id: TicketType) => {
    const isSame = values.ticketType === id
    setValues(isSame ? prev => prev : { ...INITIAL, ticketType: id })
    setErrors({})
    setDirection('fwd')
    setExitingStep(1)
    setStep(2)
  }

  const advance = () => {
    const errs =
      step === 2 ? validateStep2(values) :
      step === 3 ? validateStep3(values) : {}
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

  const handleSubmit = async () => {
    const errs = validateStep4(values)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setSubmitting(true)
    try {
      const tc = TICKET_CONFIG[values.ticketType]
      const delegateCount =
        values.ticketType === 'individual' ? '1' :
        values.ticketType === 'networking' ? '1' :
        values.delegateCount || (values.ticketType === 'corporate' ? '2' : '6')
      const orgTypeLabel     = values.orgType === 'other'     ? `Other: ${values.orgTypeOther}`     : (ORG_LABELS[values.orgType]         || values.orgType)
      const priorityLabel    = values.priority === 'other'    ? `Other: ${values.priorityOther}`    : (PRIORITY_LABELS[values.priority]    || values.priority)

      await fetch('https://hook.eu2.make.com/9ui6srn3z482gs9k1wsnu3abdggtcpjp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName:        values.fullName,
          jobTitle:        values.jobTitle,
          organization:    values.organization,
          country:         values.country,
          email:           values.email,
          whatsapp:        values.whatsapp,
          ticketType:      tc?.name || values.ticketType,
          orgType:         orgTypeLabel,
          region:          REGION_LABELS[values.region]         || values.region,
          priority:        priorityLabel,
          seats:           delegateCount,
          budgetStatus:    BUDGET_LABELS[values.budgetStatus]   || values.budgetStatus,
          timeframe:       TIMEFRAME_LABELS[values.timeframe]   || values.timeframe,
          contactPref:     CONTACT_LABELS[values.contactPref]   || values.contactPref,
          invoiceNeeded:   values.invoiceNeeded ? 'Yes' : 'No',
          execAssistName:     values.showExecAssist ? values.execAssistName     : '',
          execAssistWhatsapp: values.showExecAssist ? values.execAssistWhatsapp : '',
          execAssistEmail:    values.showExecAssist ? values.execAssistEmail    : '',
          submittedAt:     new Date().toISOString(),
          source:          'Landing Page',
        }),
      })

      if (values.contactPref === 'whatsapp') {
        const ticketLabel = tc ? `${tc.name}${tc.price ? ` (USD ${tc.price} ${tc.note})` : ''}` : values.ticketType

        const delegatesLine = values.ticketType === 'individual' ? '1 seat' : values.ticketType === 'networking' ? '1 person' : `${delegateCount} delegates`

        const lines = [
          `New registration — SICC AI Cape Town Summit`,
          `Ticket: ${ticketLabel}`,
          `Delegates: ${delegatesLine}`,
          ``,
          `Name: ${values.fullName}`,
          `Job Title: ${values.jobTitle}`,
          `Organisation: ${values.organization}`,
          `Country: ${values.country}`,
          `Email: ${values.email}`,
          `WhatsApp: ${values.whatsapp}`,
          ``,
          values.ticketType !== 'networking' ? `Organisation Type: ${orgTypeLabel}` : '',
          `Region: ${REGION_LABELS[values.region] || values.region}`,
          values.ticketType !== 'networking' ? `Main Priority: ${priorityLabel}` : '',
          ``,
          `Budget Status: ${BUDGET_LABELS[values.budgetStatus] || values.budgetStatus}`,
          `Registration Timeline: ${TIMEFRAME_LABELS[values.timeframe] || values.timeframe}`,
          `Preferred Contact: WhatsApp`,
          `Invoice Required: ${values.invoiceNeeded ? 'Yes' : 'No'}`,
          values.showExecAssist && values.execAssistName ? [
            ``, `Executive Assistant`,
            `Name: ${values.execAssistName}`,
            values.execAssistWhatsapp ? `WhatsApp: ${values.execAssistWhatsapp}` : '',
            values.execAssistEmail    ? `Email: ${values.execAssistEmail}`        : '',
          ].filter(Boolean).join('\n') : '',
        ].filter(Boolean).join('\n').replace(/\n{3,}/g, '\n\n').trim()

        window.open(`https://wa.me/254720343201?text=${encodeURIComponent(lines)}`, '_blank')
      }

      setSubmitted(true)
    } catch {
      setErrors({ fullName: 'Submission failed — please try again or email training@siccai.org' })
    } finally {
      setSubmitting(false)
    }
  }

  /* ── Success ── */
  if (submitted) {
    return (
      <section id="register" className={styles.section} aria-label="Registration confirmed">
        <div className={styles.inner}>
          <div className={styles.success}>
            <div className={styles.successIcon}><SuccessIcon /></div>
            <h2 className={styles.successHeading}>
              {lane === 'individual' ? 'Seat Reserved' : lane === 'team' ? 'Briefing Requested' : lane === 'networking' ? 'Place Reserved' : 'Inquiry Received'}
            </h2>
            <p className={styles.successMessage}>
              Thank you, {values.fullName.split(' ')[0]}. Our team will be in touch within 24 hours with payment and logistics details.
            </p>
            <LaneOutcome lane={lane} values={values} />
          </div>
        </div>
      </section>
    )
  }

  const STEP_LABELS = ['Ticket', 'About You', 'Budget', 'Contact']
  const tc = values.ticketType ? TICKET_CONFIG[values.ticketType] : null

  const step2Title =
    values.ticketType === 'corporate'     ? 'About Your Organisation' :
    values.ticketType === 'institutional' ? 'About Your Institution'  :
    values.ticketType === 'networking'    ? 'A Few Quick Details'     : 'Tell us about yourself'

  return (
    <section id="register" className={styles.section} aria-labelledby="form-heading">
      <div className={styles.inner}>

        <header className={styles.header}>
          <h2 id="form-heading" className={styles.heading}>Reserve Your Place</h2>
          <p className={styles.subText}>Complete the form below. Our team responds within 24 hours.</p>
        </header>

        <div className={styles.formWrap}>

          {/* ── Ticket banner — shown when on step 2+ ── */}
          {step >= 2 && tc && (
            <div className={styles.ticketBanner}>
              <div className={styles.ticketBannerLeft}>
                <p className={styles.ticketBannerName}>{tc.name}</p>
                {tc.price
                  ? <p className={styles.ticketBannerPrice}><span className={styles.ticketBannerCurrency}>USD </span>{tc.price}<span className={styles.ticketBannerNote}> {tc.note}</span></p>
                  : <p className={styles.ticketBannerPriceContact}>Contact Us for Pricing</p>
                }
                <p className={styles.ticketBannerSub}>{tc.sub}</p>
              </div>
              <button
                type="button"
                className={styles.ticketBannerChange}
                onClick={() => {
                  setErrors({})
                  setDirection('bwd')
                  setExitingStep(step)
                  setStep(1)
                }}
              >
                ← Change ticket
              </button>
            </div>
          )}

          {/* Progress */}
          <nav className={styles.progress} aria-label="Registration steps">
            {STEP_LABELS.map((label, i) => {
              const num = i + 1
              return (
                <div key={num} className={styles.progressItem}>
                  <div
                    className={`${styles.progressDot} ${step >= num ? styles.progressDotActive : ''}`}
                    aria-current={step === num ? 'step' : undefined}
                  >
                    {step > num ? <CheckDot /> : <span>{num}</span>}
                  </div>
                  <span className={`${styles.progressLabel} ${step === num ? styles.progressLabelActive : ''}`}>{label}</span>
                  {i < STEP_LABELS.length - 1 && (
                    <div className={`${styles.progressLine} ${step > num ? styles.progressLineFilled : ''}`} aria-hidden="true" />
                  )}
                </div>
              )
            })}
          </nav>

          <div className={styles.stepOuter}>
            {exitingStep !== null && (
              <div className={styles.stepExiting} data-dir={direction} onAnimationEnd={() => setExitingStep(null)} aria-hidden="true" />
            )}
            <div className={styles.stepActive} data-dir={direction} key={`${step}-${values.ticketType}`}>

              {/* ── Step 1: Ticket ── */}
              {step === 1 && (
                <>
                  <p className={styles.stepTitle}>Which ticket are you interested in?</p>
                  <div className={styles.ticketGrid} role="group" aria-label="Ticket type">
                    {TICKETS.map(t => (
                      <button
                        key={t.id}
                        type="button"
                        className={`${styles.ticketCard} ${values.ticketType === t.id ? styles.ticketCardSelected : ''}`}
                        onClick={() => selectTicket(t.id)}
                        aria-pressed={values.ticketType === t.id}
                      >
                        <span className={styles.ticketLabel}>{t.name}</span>
                        <span className={styles.ticketSub}>{t.sub}</span>
                        {t.price
                          ? <span className={styles.ticketPrice}><span className={styles.ticketCurrency}>USD </span>{t.price}<span className={styles.ticketNote}> {t.note}</span></span>
                          : <span className={styles.ticketPriceContact}>Contact Us</span>
                        }
                      </button>
                    ))}
                  </div>
                  <p className={styles.ticketHint}>Select a ticket to continue</p>
                </>
              )}

              {/* ── Step 2: Qualify ── */}
              {step === 2 && (
                <>
                  <p className={styles.stepTitle}>{step2Title}</p>

                  {values.ticketType !== 'networking' && (
                    <>
                      <RadioCards
                        label="Organisation type" required
                        options={ORG_TYPE_OPTIONS}
                        value={values.orgType}
                        onChange={v => set('orgType', v as FormValues['orgType'])}
                        error={errors.orgType}
                      />
                      {values.orgType === 'other' && (
                        <Field label="Please describe your organisation" required error={errors.orgTypeOther}>
                          <input
                            className={`${styles.input} ${errors.orgTypeOther ? styles.inputError : ''}`}
                            value={values.orgTypeOther}
                            onChange={e => set('orgTypeOther', e.target.value)}
                            placeholder="e.g. Regional development bank"
                          />
                        </Field>
                      )}
                    </>
                  )}

                  <SelectField
                    label="Your region" required
                    value={values.region} onChange={v => set('region', v as FormValues['region'])}
                    placeholder="Select your region…"
                    error={errors.region}
                  >
                    <option value="comesa">COMESA member state</option>
                    <option value="sadc">SADC member state</option>
                    <option value="au_other">Other AU member state</option>
                    <option value="outside">Outside Africa</option>
                  </SelectField>

                  {values.ticketType !== 'networking' && (
                    <>
                      <SelectField
                        label="Main priority right now" required
                        value={values.priority} onChange={v => set('priority', v as FormValues['priority'])}
                        placeholder="Select your main priority…"
                        error={errors.priority}
                      >
                        <option value="availability">Reduce service disruption / downtime</option>
                        <option value="breach">Prevent data loss / breach</option>
                        <option value="policy">Build cybersecurity policy and controls</option>
                        <option value="ai">Govern AI adoption / misinformation risk</option>
                        <option value="compliance">Meet regulatory and cross-border compliance</option>
                        <option value="other">Other</option>
                      </SelectField>
                      {values.priority === 'other' && (
                        <Field label="Please describe your main priority" required error={errors.priorityOther}>
                          <input
                            className={`${styles.input} ${errors.priorityOther ? styles.inputError : ''}`}
                            value={values.priorityOther}
                            onChange={e => set('priorityOther', e.target.value)}
                            placeholder="e.g. Board-level AI governance framework"
                          />
                        </Field>
                      )}
                    </>
                  )}

                  {(values.ticketType === 'corporate' || values.ticketType === 'institutional') && (
                    <Field
                      label={values.ticketType === 'corporate'
                        ? 'How many delegates will your organisation be sending?'
                        : 'How many seats does your institution require?'}
                      required error={errors.delegateCount}
                    >
                      <NumberStepper
                        value={values.delegateCount}
                        onChange={v => set('delegateCount', v)}
                        min={values.ticketType === 'corporate' ? 2 : 6}
                        max={values.ticketType === 'corporate' ? 5 : 99}
                        error={errors.delegateCount}
                      />
                    </Field>
                  )}

                  <div className={styles.stepFooter}>
                    <button type="button" className={styles.backBtn} onClick={back}>← Back</button>
                    <button type="button" className={styles.continueBtn} onClick={advance}>Continue →</button>
                  </div>
                </>
              )}

              {/* ── Step 3: Budget ── */}
              {step === 3 && (
                <>
                  <p className={styles.stepTitle}>Budget &amp; Contact Preference</p>

                  <SelectField label="Training budget status" required
                    value={values.budgetStatus} onChange={v => set('budgetStatus', v as FormValues['budgetStatus'])}
                    placeholder="Select budget status…" error={errors.budgetStatus}>
                    <option value="approved">Budget approved</option>
                    <option value="in-progress">In progress / pending approval</option>
                    <option value="not-yet">Not yet allocated</option>
                  </SelectField>

                  <SelectField label="When are you planning to register?" required
                    value={values.timeframe} onChange={v => set('timeframe', v as FormValues['timeframe'])}
                    placeholder="Select timeframe…" error={errors.timeframe}>
                    <option value="0-30">Ready to register now</option>
                    <option value="31-90">Within the next month</option>
                    <option value="90+">Still exploring options</option>
                  </SelectField>

                  <SelectField label="Preferred contact method" required
                    value={values.contactPref} onChange={v => set('contactPref', v as FormValues['contactPref'])}
                    placeholder="Select contact method…" error={errors.contactPref}>
                    <option value="whatsapp">WhatsApp (fastest)</option>
                    <option value="email">Email</option>
                    <option value="assistant">Via my Executive Assistant</option>
                  </SelectField>

                  {values.ticketType !== 'networking' && (
                    <div className={styles.fieldGroup}>
                      <label className={styles.checkboxRow}>
                        <input type="checkbox" className={styles.checkboxInput}
                          checked={values.invoiceNeeded}
                          onChange={e => set('invoiceNeeded', e.target.checked)} />
                        <span className={styles.checkboxCustom} />
                        <span className={styles.checkboxLabel}>I need a formal invoice for procurement / budget approval</span>
                      </label>
                    </div>
                  )}

                  <div className={styles.stepFooter}>
                    <button type="button" className={styles.backBtn} onClick={back}>← Back</button>
                    <button type="button" className={styles.continueBtn} onClick={advance}>Continue →</button>
                  </div>
                </>
              )}

              {/* ── Step 4: Contact ── */}
              {step === 4 && (
                <>
                  <p className={styles.stepTitle}>Your Contact Details</p>

                  <Field label="Full Name" required error={errors.fullName}>
                    <input className={`${styles.input} ${errors.fullName ? styles.inputError : ''}`}
                      value={values.fullName} onChange={e => set('fullName', e.target.value)}
                      autoComplete="name" placeholder="e.g. Amara Osei" />
                  </Field>

                  <Field label="Job Title" required error={errors.jobTitle}>
                    <input className={`${styles.input} ${errors.jobTitle ? styles.inputError : ''}`}
                      value={values.jobTitle} onChange={e => set('jobTitle', e.target.value)}
                      autoComplete="organization-title" placeholder="e.g. Chief Executive Officer" />
                  </Field>

                  <Field label="Organisation / Company" required error={errors.organization}>
                    <input className={`${styles.input} ${errors.organization ? styles.inputError : ''}`}
                      value={values.organization} onChange={e => set('organization', e.target.value)}
                      autoComplete="organization" placeholder="e.g. East Africa Development Bank" />
                  </Field>

                  <Field label="Country" required error={errors.country}>
                    <input className={`${styles.input} ${errors.country ? styles.inputError : ''}`}
                      value={values.country} onChange={e => set('country', e.target.value)}
                      autoComplete="country-name" placeholder="e.g. Kenya" />
                  </Field>

                  <Field label="Email Address" required error={errors.email}>
                    <input className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                      type="email" value={values.email} onChange={e => set('email', e.target.value)}
                      autoComplete="email" placeholder="you@organisation.com" />
                  </Field>

                  <Field label="WhatsApp Number (with country code)" required error={errors.whatsapp}>
                    <input className={`${styles.input} ${errors.whatsapp ? styles.inputError : ''}`}
                      type="tel" value={values.whatsapp} onChange={e => set('whatsapp', e.target.value)}
                      autoComplete="tel" placeholder="+254 712 345 678" />
                  </Field>

                  <div className={styles.fieldGroup}>
                    <label className={styles.checkboxRow}>
                      <input type="checkbox" className={styles.checkboxInput}
                        checked={values.showExecAssist}
                        onChange={e => set('showExecAssist', e.target.checked)} />
                      <span className={styles.checkboxCustom} />
                      <span className={styles.checkboxLabel}>CC my Executive Assistant on follow-up communications</span>
                    </label>
                    <div className={`${styles.expandable} ${values.showExecAssist ? styles.expandableOpen : ''}`}>
                      <div className={styles.expandableInner}>
                        <div style={{ marginTop: 'var(--space-sm)' }}>
                          <Field label="Assistant's Full Name" error={undefined}>
                            <input className={styles.input} value={values.execAssistName}
                              onChange={e => set('execAssistName', e.target.value)} placeholder="Assistant name" />
                          </Field>
                          <Field label="Assistant's WhatsApp" error={undefined}>
                            <input className={styles.input} type="tel" value={values.execAssistWhatsapp}
                              onChange={e => set('execAssistWhatsapp', e.target.value)} placeholder="+254 7XX XXX XXX" />
                          </Field>
                          <Field label="Assistant's Email" error={undefined}>
                            <input className={styles.input} type="email" value={values.execAssistEmail}
                              onChange={e => set('execAssistEmail', e.target.value)} placeholder="assistant@organisation.com" />
                          </Field>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button type="button" className={styles.submitBtn} onClick={handleSubmit}
                    disabled={submitting} aria-busy={submitting}>
                    {submitting
                      ? <><span className={styles.spinner} aria-hidden="true" /><span>Submitting…</span></>
                      : lane === 'individual' ? 'Reserve My Seat'
                      : lane === 'networking' ? 'Reserve Networking Place'
                      : lane === 'team'       ? 'Book Team Seats'
                      :                         'Submit Institutional Inquiry'
                    }
                  </button>

                  <div className={styles.stepFooter} style={{ marginTop: 'var(--space-sm)' }}>
                    <button type="button" className={styles.backBtn} onClick={back}>← Back</button>
                  </div>
                </>
              )}

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
