'use client'

import { useState, useCallback } from 'react'
import styles from './RegistrationForm.module.css'

/* ─── Types ──────────────────────────────────────────────────────────────────── */
interface FormValues {
  /* Step 1 — Qualify */
  role:         '' | 'ceo' | 'director' | 'policy' | 'cyber' | 'other'
  orgType:      '' | 'government' | 'finance' | 'telecom' | 'health' | 'education' | 'ngo' | 'private'
  region:       '' | 'comesa' | 'sadc' | 'au_other' | 'outside'
  priority:     '' | 'availability' | 'breach' | 'policy' | 'ai' | 'compliance'
  seats:        '' | '1' | '2-5' | '6-15' | '16+'

  /* Step 2 — Budget + Contact preference */
  budgetStatus: '' | 'approved' | 'in-progress' | 'not-yet'
  timeframe:    '' | '0-30' | '31-90' | '90+'
  contactPref:  '' | 'whatsapp' | 'email' | 'assistant'
  invoiceNeeded: boolean

  /* Step 3 — Contact details */
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
  role: '', orgType: '', region: '', priority: '', seats: '',
  budgetStatus: '', timeframe: '', contactPref: '', invoiceNeeded: false,
  fullName: '', jobTitle: '', organization: '', country: '', email: '',
  whatsapp: '', teamSize: '', execAssistName: '', execAssistWhatsapp: '',
  execAssistEmail: '', showExecAssist: false,
}

/* ─── Lane routing ───────────────────────────────────────────────────────────── */
type Lane = 'individual' | 'team' | 'partner'

function getLane(values: FormValues): Lane {
  if (values.role === 'policy' || values.seats === '16+') return 'partner'
  if (values.seats === '1' || values.seats === '') return 'individual'
  return 'team'
}

/* ─── Validation ─────────────────────────────────────────────────────────────── */
function validateStep1(v: FormValues): Errors {
  const e: Errors = {}
  if (!v.role)     e.role     = 'Please select your role'
  if (!v.orgType)  e.orgType  = 'Please select your organisation type'
  if (!v.region)   e.region   = 'Please select your region'
  if (!v.priority) e.priority = 'Please select your main priority'
  if (!v.seats)    e.seats    = 'Please select the number of seats needed'
  return e
}

function validateStep2(v: FormValues): Errors {
  const e: Errors = {}
  if (!v.budgetStatus) e.budgetStatus = 'Please select a budget status'
  if (!v.timeframe)    e.timeframe    = 'Please select a timeframe'
  if (!v.contactPref)  e.contactPref  = 'Please select a contact preference'
  return e
}

function validateStep3(v: FormValues): Errors {
  const e: Errors = {}
  if (!v.fullName.trim())     e.fullName     = 'Full name is required'
  if (!v.jobTitle.trim())     e.jobTitle     = 'Job title is required'
  if (!v.organization.trim()) e.organization = 'Organisation is required'
  if (!v.country.trim())      e.country      = 'Country is required'
  if (!v.email.trim())
    e.email = 'Email address is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email))
    e.email = 'Enter a valid email address'
  if (!v.whatsapp.trim())     e.whatsapp     = 'WhatsApp number is required'
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
      <p className={styles.laneOutcomeTitle}>Partnership &amp; Membership Inquiry</p>
      <p className={styles.laneOutcomeBody}>
        Your inquiry has been flagged for a Partnership / Membership call (30 min). Our team will be in touch within 24 hours to discuss institutional engagement, MoU opportunities, and ongoing capability building.
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

  const advance = () => {
    const errs = step === 1 ? validateStep1(values) : step === 2 ? validateStep2(values) : {}
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
      <section id="register" className={styles.section} aria-label="Registration confirmed">
        <div className={styles.inner}>
          <div className={styles.success}>
            <div className={styles.successIcon}><SuccessIcon /></div>
            <h2 className={styles.successHeading}>
              {lane === 'individual' ? 'Seat Reserved' : lane === 'team' ? 'Briefing Requested' : 'Inquiry Received'}
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

  const laneLabel =
    lane === 'individual' ? 'Individual Seat — USD 3,000' :
    lane === 'team'       ? 'Team / Institution — Executive Briefing' :
                            'Partnership / Membership Inquiry'

  return (
    <section id="register" className={styles.section} aria-labelledby="form-heading">
      <div className={styles.inner}>

        <header className={styles.header}>
          <h2 id="form-heading" className={styles.heading}>Reserve Your Place</h2>
          <p className={styles.subText}>
            Complete the qualification form below. Our team responds within 24 hours.
          </p>
        </header>

        <div className={styles.formWrap}>

          {/* Lane indicator */}
          {step >= 2 && values.seats && (
            <div className={styles.laneIndicator} aria-live="polite">
              <span className={styles.laneDot} aria-hidden="true" />
              <span className={styles.laneLabel}>{laneLabel}</span>
            </div>
          )}

          {/* Progress */}
          <nav className={styles.progress} aria-label="Registration steps">
            {[{ num: 1, label: 'Qualify' }, { num: 2, label: 'Budget' }, { num: 3, label: 'Contact' }].map(
              ({ num, label }, i, arr) => (
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
                    <div className={`${styles.progressLine} ${step > num ? styles.progressLineFilled : ''}`} aria-hidden="true" />
                  )}
                </div>
              )
            )}
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

              {/* ── Step 1: Qualify ── */}
              {step === 1 && (
                <>
                  <p className={styles.stepTitle}>Tell us about yourself</p>

                  <SelectField
                    label="Your role" required
                    value={values.role} onChange={v => set('role', v as FormValues['role'])}
                    placeholder="Select your role…"
                    error={errors.role}
                  >
                    <option value="ceo">CEO / MD</option>
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
                    <option value="ngo">NGO / Development</option>
                    <option value="private">Private Company</option>
                  </SelectField>

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
                    <option value="policy">Build Cybersecurity policy and controls</option>
                    <option value="ai">Govern AI adoption / misinformation risk</option>
                    <option value="compliance">Meet regulatory and cross-border compliance</option>
                  </SelectField>

                  <SelectField
                    label="Training seats needed" required
                    value={values.seats} onChange={v => set('seats', v as FormValues['seats'])}
                    placeholder="Select number of seats…"
                    error={errors.seats}
                  >
                    <option value="1">1 seat — Individual</option>
                    <option value="2-5">2–5 seats — Team</option>
                    <option value="6-15">6–15 seats — Institutional</option>
                    <option value="16+">16+ seats — Partnership</option>
                  </SelectField>

                  {values.seats === '1' && (
                    <p className={styles.routeHint}>→ Individual seat path: checkout + invoice option</p>
                  )}
                  {(values.seats === '2-5' || values.seats === '6-15') && (
                    <p className={styles.routeHint}>→ Team path: we will schedule your Executive Briefing (20 min)</p>
                  )}
                  {values.seats === '16+' && (
                    <p className={styles.routeHint}>→ Partnership path: we will schedule a Membership / MoU call (30 min)</p>
                  )}

                  <div className={styles.stepFooter}>
                    <span />
                    <button type="button" className={styles.continueBtn} onClick={advance}>
                      Continue →
                    </button>
                  </div>
                </>
              )}

              {/* ── Step 2: Budget + Contact preference ── */}
              {step === 2 && (
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
                    label="When do you need this implemented?" required
                    value={values.timeframe} onChange={v => set('timeframe', v as FormValues['timeframe'])}
                    placeholder="Select timeframe…"
                    error={errors.timeframe}
                  >
                    <option value="0-30">Within 30 days</option>
                    <option value="31-90">31–90 days</option>
                    <option value="90+">90+ days</option>
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

                  {lane === 'individual' && (
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

              {/* ── Step 3: Contact details ── */}
              {step === 3 && (
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
                    <Field label="Number of team members attending" error={undefined}>
                      <input
                        className={styles.input}
                        type="number"
                        min="2"
                        value={values.teamSize}
                        onChange={e => set('teamSize', e.target.value)}
                        placeholder="e.g. 5"
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
                      lane === 'team'       ? 'Request Executive Briefing' :
                                             'Submit Partnership Inquiry'
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
