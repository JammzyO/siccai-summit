'use client'

import { useState, useCallback } from 'react'
import styles from './RegistrationForm.module.css'

/* ─── Types ──────────────────────────────────────────────────────────────────── */
type TicketType = '' | 'individual' | 'corporate' | 'institutional' | 'networking'

interface FormValues {
  /* Step 1 — Ticket */
  ticketType: TicketType

  /* Step 2 — Qualify */
  role:           '' | 'ceo' | 'director' | 'policy' | 'cyber' | 'other'
  orgType:        '' | 'government' | 'finance' | 'telecom' | 'health' | 'education' | 'ngo' | 'private' | 'other'
  orgTypeOther:   string
  region:         '' | 'comesa' | 'sadc' | 'au_other' | 'outside'
  priority:       '' | 'availability' | 'breach' | 'policy' | 'ai' | 'compliance' | 'other'
  priorityOther:  string
  seats:          '' | '2-5' | '6-15' | '16+'   /* only for corporate/institutional */

  /* Step 3 — Budget + contact pref */
  budgetStatus:  '' | 'approved' | 'in-progress' | 'not-yet'
  timeframe:     '' | '0-30' | '31-90' | '90+'
  contactPref:   '' | 'whatsapp' | 'email' | 'assistant'
  invoiceNeeded: boolean

  /* Step 4 — Contact details */
  fullName:           string
  jobTitle:           string
  organization:       string
  country:            string
  email:              string
  whatsapp:           string
  teamSize:           string
  execAssistName:     string
  execAssistWhatsapp: string
  execAssistEmail:    string
  showExecAssist:     boolean
}

type Errors = Partial<Record<keyof FormValues, string>>

const INITIAL: FormValues = {
  ticketType: '',
  role: '', orgType: '', orgTypeOther: '', region: '', priority: '', priorityOther: '', seats: '',
  budgetStatus: '', timeframe: '', contactPref: '', invoiceNeeded: false,
  fullName: '', jobTitle: '', organization: '', country: '', email: '',
  whatsapp: '', teamSize: '', execAssistName: '', execAssistWhatsapp: '',
  execAssistEmail: '', showExecAssist: false,
}

/* ─── Lane routing ───────────────────────────────────────────────────────────── */
type Lane = 'individual' | 'team' | 'partner' | 'networking'

function getLane(values: FormValues): Lane {
  if (values.ticketType === 'networking') return 'networking'
  if (values.ticketType === 'institutional' || values.seats === '16+') return 'partner'
  if (values.ticketType === 'corporate') return 'team'
  return 'individual'
}

/* ─── Ticket options ─────────────────────────────────────────────────────────── */
const TICKETS: { id: TicketType; label: string; sub: string; price: string | null; note: string }[] = [
  {
    id:    'individual',
    label: 'Main Event · Individual',
    sub:   '11–14 May 2026 · 4 days',
    price: '2,740',
    note:  'per seat',
  },
  {
    id:    'corporate',
    label: 'Main Event · Corporate',
    sub:   '2–5 seats · 11–14 May 2026',
    price: '2,270',
    note:  'per seat',
  },
  {
    id:    'institutional',
    label: 'Institutional Package',
    sub:   '6–15 seats · contact us',
    price: null,
    note:  '',
  },
  {
    id:    'networking',
    label: 'Networking Event Only',
    sub:   '15 May 2026',
    price: '1,175',
    note:  'per person',
  },
]

/* ─── Validation ─────────────────────────────────────────────────────────────── */
function validateStep1(v: FormValues): Errors {
  const e: Errors = {}
  if (!v.ticketType) e.ticketType = 'Please select a ticket type'
  return e
}

function validateStep2(v: FormValues): Errors {
  const e: Errors = {}
  if (!v.role)     e.role     = 'Please select your role'
  if (!v.orgType)  e.orgType  = 'Please select your organisation type'
  if (v.orgType === 'other' && !v.orgTypeOther.trim()) e.orgTypeOther = 'Please describe your organisation'
  if (!v.region)   e.region   = 'Please select your region'
  if (!v.priority) e.priority = 'Please select your main priority'
  if (v.priority === 'other' && !v.priorityOther.trim()) e.priorityOther = 'Please describe your priority'
  if ((v.ticketType === 'corporate' || v.ticketType === 'institutional') && !v.seats)
    e.seats = 'Please select the number of seats'
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
    e.email = 'Enter a valid email address'
  if (!v.whatsapp.trim()) e.whatsapp = 'WhatsApp number is required'
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

function SelectField({
  label, required, error, value, onChange, placeholder, children,
}: {
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

function SuccessIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
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
  if (lane === 'networking') {
    return (
      <div className={styles.laneOutcome}>
        <p className={styles.laneOutcomeTitle}>Your next step</p>
        <p className={styles.laneOutcomeBody}>
          Our team will contact you within 24 hours with payment details and logistics for your Networking Event seat on 15 May 2026.
        </p>
      </div>
    )
  }
  if (lane === 'individual') {
    return (
      <div className={styles.laneOutcome}>
        <p className={styles.laneOutcomeTitle}>Your next step</p>
        <p className={styles.laneOutcomeBody}>
          {values.invoiceNeeded
            ? 'Our team will send you a formal invoice and procurement documentation within 24 hours. Your seat will be reserved upon payment confirmation.'
            : 'Our team will contact you within 24 hours with payment details and logistics for your individual seat at the Summit.'}
        </p>
      </div>
    )
  }
  if (lane === 'team') {
    return (
      <div className={styles.laneOutcome}>
        <p className={styles.laneOutcomeTitle}>We will schedule your Executive Briefing</p>
        <p className={styles.laneOutcomeBody}>
          A 20-minute &ldquo;Secure &amp; Innovation-Ready Executive Briefing&rdquo; will be arranged for your team. Our team will reach out within 24 hours to confirm timing and share a calendar invite.
        </p>
      </div>
    )
  }
  return (
    <div className={styles.laneOutcome}>
      <p className={styles.laneOutcomeTitle}>Institutional &amp; Partnership Inquiry</p>
      <p className={styles.laneOutcomeBody}>
        Your inquiry has been received. Our team will be in touch within 24 hours to discuss institutional seat allocation, invoice arrangements, and any MoU or partnership opportunities.
      </p>
    </div>
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

  const lane = getLane(values)

  const set = useCallback(<K extends keyof FormValues>(field: K, value: FormValues[K]) => {
    setValues(prev => ({ ...prev, [field]: value }))
    setErrors(prev => { const n = { ...prev }; delete n[field]; return n })
  }, [])

  /* Ticket card click — auto-advance, reset if switching ticket type */
  const selectTicket = (id: TicketType) => {
    const isSame = values.ticketType === id
    if (isSame) {
      /* Already on a later step with the same ticket — just advance to step 2 */
      setErrors({})
      setDirection('fwd')
      setExitingStep(1)
      setStep(2)
      return
    }
    /* Different ticket selected — reset all answers, keep only new ticket */
    setValues({ ...INITIAL, ticketType: id })
    setErrors({})
    setDirection('fwd')
    setExitingStep(1)
    setStep(2)
  }

  const STEPS = 4

  const advance = () => {
    const errs =
      step === 1 ? validateStep1(values) :
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
      const seatsValue =
        values.ticketType === 'individual' ? '1' :
        values.ticketType === 'networking' ? 'networking only' :
        values.seats

      await fetch('https://hook.eu2.make.com/9ui6srn3z482gs9k1wsnu3abdggtcpjp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketType:    values.ticketType,
          fullName:      values.fullName,
          jobTitle:      values.jobTitle,
          organization:  values.organization,
          country:       values.country,
          email:         values.email,
          whatsapp:      values.whatsapp,
          role:          values.role,
          orgType:       values.orgType === 'other' ? `Other: ${values.orgTypeOther}` : values.orgType,
          region:        values.region,
          priority:      values.priority === 'other' ? `Other: ${values.priorityOther}` : values.priority,
          seats:         seatsValue,
          budgetStatus:  values.budgetStatus,
          timeframe:     values.timeframe,
          contactPref:   values.contactPref,
          invoiceNeeded: values.invoiceNeeded,
          teamSize:      values.teamSize || '',
          execAssistName:     values.showExecAssist ? values.execAssistName     : '',
          execAssistWhatsapp: values.showExecAssist ? values.execAssistWhatsapp : '',
          execAssistEmail:    values.showExecAssist ? values.execAssistEmail    : '',
        }),
      })

      if (values.contactPref === 'whatsapp') {
        const TICKET_LABELS: Record<string, string> = {
          individual:    'Main Event · Individual (USD 2,740)',
          corporate:     'Main Event · Corporate (USD 2,270 per seat)',
          institutional: 'Institutional Package (6–15 seats)',
          networking:    'Networking Event Only (USD 1,175)',
        }
        const ROLE_LABELS: Record<string, string> = {
          ceo: 'Chief Executive Officer / Managing Director',
          director: 'Director / Head of Department',
          policy: 'Policy Maker / Regulator',
          cyber: 'Cybersecurity / IT Lead',
          other: 'Other Senior Role',
        }
        const ORG_LABELS: Record<string, string> = {
          government: 'Government / Agency', finance: 'Bank / Financial Services',
          telecom: 'Telecom / ISP', health: 'Healthcare', education: 'Education',
          ngo: 'NGO / Development', private: 'Private Company',
        }
        const REGION_LABELS: Record<string, string> = {
          comesa: 'COMESA Member State', sadc: 'SADC Member State',
          au_other: 'Other AU Member State', outside: 'Outside Africa',
        }
        const PRIORITY_LABELS: Record<string, string> = {
          availability: 'Reduce service disruption / downtime',
          breach: 'Prevent data loss / breach',
          policy: 'Build Cybersecurity policy and controls',
          ai: 'Govern AI adoption / misinformation risk',
          compliance: 'Meet regulatory and cross-border compliance',
        }
        const SEATS_LABELS: Record<string, string> = {
          '2-5': '2–5 seats', '6-15': '6–15 seats', '16+': '16+ seats',
        }
        const BUDGET_LABELS: Record<string, string> = {
          approved: 'Budget approved',
          'in-progress': 'Budget approval in progress',
          'not-yet': 'Not yet budgeted',
        }
        const TIMEFRAME_LABELS: Record<string, string> = {
          '0-30': 'Ready to register now',
          '31-90': 'Within the next month',
          '90+': 'Still exploring options',
        }

        const orgTypeDisplay =
          values.orgType === 'other'
            ? `Other — ${values.orgTypeOther}`
            : (ORG_LABELS[values.orgType] || values.orgType)

        const priorityDisplay =
          values.priority === 'other'
            ? `Other — ${values.priorityOther}`
            : (PRIORITY_LABELS[values.priority] || values.priority)

        const seatsDisplay =
          values.ticketType === 'individual' ? '1 seat' :
          values.ticketType === 'networking' ? 'Networking only' :
          (SEATS_LABELS[values.seats] || values.seats)

        const msg = [
          `New registration — SICC AI Cape Town Summit`,
          ``,
          `Ticket: ${TICKET_LABELS[values.ticketType] || values.ticketType}`,
          ``,
          `Name: ${values.fullName}`,
          `Job Title: ${values.jobTitle}`,
          `Organisation: ${values.organization}`,
          `Country: ${values.country}`,
          `Email: ${values.email}`,
          `WhatsApp: ${values.whatsapp}`,
          ``,
          `Role: ${ROLE_LABELS[values.role] || values.role}`,
          `Organisation Type: ${orgTypeDisplay}`,
          `Region: ${REGION_LABELS[values.region] || values.region}`,
          `Main Priority: ${priorityDisplay}`,
          values.ticketType !== 'individual' && values.ticketType !== 'networking'
            ? `Seats Required: ${seatsDisplay}` : '',
          ``,
          `Budget Status: ${BUDGET_LABELS[values.budgetStatus] || values.budgetStatus}`,
          `Registration Timeline: ${TIMEFRAME_LABELS[values.timeframe] || values.timeframe}`,
          `Preferred Contact: WhatsApp`,
          `Invoice Required: ${values.invoiceNeeded ? 'Yes' : 'No'}`,
          values.teamSize ? `Team Size Confirmed: ${values.teamSize}` : '',
          values.showExecAssist && values.execAssistName ? [
            ``,
            `Executive Assistant`,
            `Name: ${values.execAssistName}`,
            values.execAssistWhatsapp ? `WhatsApp: ${values.execAssistWhatsapp}` : '',
            values.execAssistEmail    ? `Email: ${values.execAssistEmail}`        : '',
          ].filter(Boolean).join('\n') : '',
        ].filter(Boolean).join('\n').replace(/\n{3,}/g, '\n\n').trim()

        window.open(
          `https://wa.me/254720343201?text=${encodeURIComponent(msg)}`,
          '_blank',
        )
      }

      setSubmitted(true)
    } catch {
      setErrors({ fullName: 'Submission failed — please try again or email training@siccai.org' })
    } finally {
      setSubmitting(false)
    }
  }

  /* ── Success state ── */
  if (submitted) {
    return (
      <section id="register" className={styles.section} aria-label="Registration confirmed">
        <div className={styles.inner}>
          <div className={styles.success}>
            <div className={styles.successIcon}><SuccessIcon /></div>
            <h2 className={styles.successHeading}>
              {lane === 'individual' ? 'Seat Reserved' :
               lane === 'team'      ? 'Briefing Requested' :
               lane === 'networking'? 'Place Reserved' : 'Inquiry Received'}
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

  return (
    <section id="register" className={styles.section} aria-labelledby="form-heading">
      <div className={styles.inner}>

        <header className={styles.header}>
          <h2 id="form-heading" className={styles.heading}>Reserve Your Place</h2>
          <p className={styles.subText}>
            Complete the form below. Our team responds within 24 hours.
          </p>
        </header>

        <div className={styles.formWrap}>

          {/* Lane indicator */}
          {step >= 2 && values.ticketType && (
            <div className={styles.laneIndicator} aria-live="polite">
              <span className={styles.laneDot} aria-hidden="true" />
              <span className={styles.laneLabel}>
                {values.ticketType === 'individual'    ? 'Main Event · Individual — USD 2,740' :
                 values.ticketType === 'corporate'     ? 'Main Event · Corporate — USD 2,270 per seat' :
                 values.ticketType === 'institutional' ? 'Institutional Package — contact us for pricing' :
                                                         'Networking Event Only — USD 1,175'}
              </span>
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
                  <span className={`${styles.progressLabel} ${step === num ? styles.progressLabelActive : ''}`}>
                    {label}
                  </span>
                  {i < STEP_LABELS.length - 1 && (
                    <div className={`${styles.progressLine} ${step > num ? styles.progressLineFilled : ''}`} aria-hidden="true" />
                  )}
                </div>
              )
            })}
          </nav>

          {/* Step panels */}
          <div className={styles.stepOuter}>
            {exitingStep !== null && (
              <div
                className={styles.stepExiting}
                data-dir={direction}
                onAnimationEnd={() => setExitingStep(null)}
                aria-hidden="true"
              />
            )}

            <div className={styles.stepActive} data-dir={direction} key={step}>

              {/* ── Step 1: Ticket selection ── */}
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
                        <span className={styles.ticketLabel}>{t.label}</span>
                        <span className={styles.ticketSub}>{t.sub}</span>
                        {t.price ? (
                          <span className={styles.ticketPrice}>
                            <span className={styles.ticketCurrency}>USD</span>
                            {t.price}
                            <span className={styles.ticketNote}> {t.note}</span>
                          </span>
                        ) : (
                          <span className={styles.ticketPriceContact}>Contact Us</span>
                        )}
                      </button>
                    ))}
                  </div>

                  <p className={styles.ticketHint}>Select a ticket to continue</p>
                </>
              )}

              {/* ── Step 2: Qualify ── */}
              {step === 2 && (
                <>
                  <p className={styles.stepTitle}>
                    {values.ticketType === 'corporate'     ? 'About Your Organisation' :
                     values.ticketType === 'institutional' ? 'About Your Institution' :
                                                             'Tell us about yourself'}
                  </p>

                  <SelectField
                    label="Your role" required
                    value={values.role} onChange={v => set('role', v as FormValues['role'])}
                    placeholder="Select your role…"
                    error={errors.role}
                  >
                    <option value="ceo">CEO / Managing Director</option>
                    <option value="director">Director / Head of Department</option>
                    <option value="policy">Policy Maker / Regulator</option>
                    <option value="cyber">Cybersecurity / IT Lead</option>
                    <option value="other">Other Senior Role</option>
                  </SelectField>

                  <SelectField
                    label="Organisation type" required
                    value={values.orgType} onChange={v => set('orgType', v as FormValues['orgType'])}
                    placeholder="Select organisation type…"
                    error={errors.orgType}
                  >
                    <option value="government">Government / Agency</option>
                    <option value="finance">Bank / Financial Services</option>
                    <option value="telecom">Telecom / ISP</option>
                    <option value="health">Healthcare</option>
                    <option value="education">Education</option>
                    <option value="ngo">NGO / Development Organisation</option>
                    <option value="private">Private Company</option>
                    <option value="other">Other</option>
                  </SelectField>

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

                  {(values.ticketType === 'corporate' || values.ticketType === 'institutional') && (
                    <SelectField
                      label={values.ticketType === 'corporate'
                        ? 'How many delegates will your organisation be sending?'
                        : 'How many seats does your institution require?'}
                      required
                      value={values.seats} onChange={v => set('seats', v as FormValues['seats'])}
                      placeholder="Select number of delegates…"
                      error={errors.seats}
                    >
                      {values.ticketType === 'corporate' && (
                        <option value="2-5">2–5 seats</option>
                      )}
                      {values.ticketType === 'institutional' && (
                        <>
                          <option value="6-15">6–15 seats</option>
                          <option value="16+">16+ seats</option>
                        </>
                      )}
                    </SelectField>
                  )}

                  <div className={styles.stepFooter}>
                    <button type="button" className={styles.backBtn} onClick={back}>← Back</button>
                    <button type="button" className={styles.continueBtn} onClick={advance}>Continue →</button>
                  </div>
                </>
              )}

              {/* ── Step 3: Budget + Contact preference ── */}
              {step === 3 && (
                <>
                  <p className={styles.stepTitle}>Budget &amp; Contact Preference</p>

                  <SelectField
                    label="Training budget status" required
                    value={values.budgetStatus} onChange={v => set('budgetStatus', v as FormValues['budgetStatus'])}
                    placeholder="Select budget status…"
                    error={errors.budgetStatus}
                  >
                    <option value="approved">Budget approved</option>
                    <option value="in-progress">In progress / pending approval</option>
                    <option value="not-yet">Not yet allocated</option>
                  </SelectField>

                  <SelectField
                    label="When are you planning to register?" required
                    value={values.timeframe} onChange={v => set('timeframe', v as FormValues['timeframe'])}
                    placeholder="Select timeframe…"
                    error={errors.timeframe}
                  >
                    <option value="0-30">Ready to register now</option>
                    <option value="31-90">Within the next month</option>
                    <option value="90+">Still exploring options</option>
                  </SelectField>

                  <SelectField
                    label="Preferred contact method" required
                    value={values.contactPref} onChange={v => set('contactPref', v as FormValues['contactPref'])}
                    placeholder="Select contact method…"
                    error={errors.contactPref}
                  >
                    <option value="whatsapp">WhatsApp (fastest)</option>
                    <option value="email">Email</option>
                    <option value="assistant">Via my Executive Assistant</option>
                  </SelectField>

                  {(values.ticketType === 'individual' || values.ticketType === 'corporate' || values.ticketType === 'institutional') && (
                    <div className={styles.fieldGroup}>
                      <label className={styles.checkboxRow}>
                        <input
                          type="checkbox"
                          className={styles.checkboxInput}
                          checked={values.invoiceNeeded}
                          onChange={e => set('invoiceNeeded', e.target.checked)}
                        />
                        <span className={styles.checkboxCustom} />
                        <span className={styles.checkboxLabel}>
                          I need a formal invoice for procurement / budget approval
                        </span>
                      </label>
                    </div>
                  )}

                  <div className={styles.stepFooter}>
                    <button type="button" className={styles.backBtn} onClick={back}>← Back</button>
                    <button type="button" className={styles.continueBtn} onClick={advance}>Continue →</button>
                  </div>
                </>
              )}

              {/* ── Step 4: Contact details ── */}
              {step === 4 && (
                <>
                  <p className={styles.stepTitle}>Your Contact Details</p>

                  <Field label="Full Name" required error={errors.fullName}>
                    <input
                      className={`${styles.input} ${errors.fullName ? styles.inputError : ''}`}
                      value={values.fullName}
                      onChange={e => set('fullName', e.target.value)}
                      autoComplete="name"
                      placeholder="e.g. Amara Osei"
                    />
                  </Field>

                  <Field label="Job Title" required error={errors.jobTitle}>
                    <input
                      className={`${styles.input} ${errors.jobTitle ? styles.inputError : ''}`}
                      value={values.jobTitle}
                      onChange={e => set('jobTitle', e.target.value)}
                      autoComplete="organization-title"
                      placeholder="e.g. Chief Executive Officer"
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

                  <Field label="Country" required error={errors.country}>
                    <input
                      className={`${styles.input} ${errors.country ? styles.inputError : ''}`}
                      value={values.country}
                      onChange={e => set('country', e.target.value)}
                      autoComplete="country-name"
                      placeholder="e.g. Kenya"
                    />
                  </Field>

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

                  <Field label="WhatsApp Number (with country code)" required error={errors.whatsapp}>
                    <input
                      className={`${styles.input} ${errors.whatsapp ? styles.inputError : ''}`}
                      type="tel"
                      value={values.whatsapp}
                      onChange={e => set('whatsapp', e.target.value)}
                      placeholder="+254 712 345 678"
                    />
                  </Field>

                  {(lane === 'team' || lane === 'partner') && (
                    <Field label="Exact number of team members attending" error={undefined}>
                      <input
                        className={styles.input}
                        type="number"
                        min="2"
                        value={values.teamSize}
                        onChange={e => set('teamSize', e.target.value)}
                        placeholder="e.g. 4"
                      />
                    </Field>
                  )}

                  {/* Executive assistant */}
                  <div className={styles.fieldGroup}>
                    <label className={styles.checkboxRow}>
                      <input
                        type="checkbox"
                        className={styles.checkboxInput}
                        checked={values.showExecAssist}
                        onChange={e => set('showExecAssist', e.target.checked)}
                      />
                      <span className={styles.checkboxCustom} />
                      <span className={styles.checkboxLabel}>
                        CC my Executive Assistant on follow-up communications
                      </span>
                    </label>

                    <div className={`${styles.expandable} ${values.showExecAssist ? styles.expandableOpen : ''}`}>
                      <div className={styles.expandableInner}>
                        <div style={{ marginTop: 'var(--space-sm)' }}>
                          <Field label="Assistant's Full Name" error={undefined}>
                            <input
                              className={styles.input}
                              value={values.execAssistName}
                              onChange={e => set('execAssistName', e.target.value)}
                              placeholder="Assistant name"
                            />
                          </Field>
                          <Field label="Assistant's WhatsApp" error={undefined}>
                            <input
                              className={styles.input}
                              type="tel"
                              value={values.execAssistWhatsapp}
                              onChange={e => set('execAssistWhatsapp', e.target.value)}
                              placeholder="+254 7XX XXX XXX"
                            />
                          </Field>
                          <Field label="Assistant's Email" error={undefined}>
                            <input
                              className={styles.input}
                              type="email"
                              value={values.execAssistEmail}
                              onChange={e => set('execAssistEmail', e.target.value)}
                              placeholder="assistant@organisation.com"
                            />
                          </Field>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className={styles.submitBtn}
                    onClick={handleSubmit}
                    disabled={submitting}
                    aria-busy={submitting}
                  >
                    {submitting ? (
                      <><span className={styles.spinner} aria-hidden="true" /><span>Submitting…</span></>
                    ) : (
                      lane === 'individual' ? 'Reserve My Seat' :
                      lane === 'networking' ? 'Reserve Networking Place' :
                      lane === 'team'       ? 'Book Team Seats' :
                                             'Submit Institutional Inquiry'
                    )}
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
