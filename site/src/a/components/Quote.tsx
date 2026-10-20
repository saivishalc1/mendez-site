import { useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, m, useReducedMotion } from 'motion/react'
import { ArrowLeft, ArrowRight, Camera, Check, Mail, MessageCircle, MessageSquare, Phone, Plus, X } from 'lucide-react'
import { useLang } from '@shared/i18n'
import { business } from '@shared/business'
import { useQuote, type QuoteApi } from '@shared/useQuote'
import { EASE, Kicker, Reveal, Title } from './ui'

function TruckFill({ fill }: { fill: number }) {
  return (
    <svg viewBox="0 0 100 50" className="h-[38px] w-[76px] flex-none sm:h-[44px] sm:w-[88px]" aria-hidden>
      <rect x="4" y="6" width="62" height="29" rx="1.5" fill="none" strokeWidth="2" className="truck-line stroke-[#6a6a62]" />
      {fill > 0 ? (
        <rect x="7" y="9" width="56" height="23" className="fill" style={{ ['--f' as string]: fill }} />
      ) : (
        <text x="35" y="28.5" textAnchor="middle" className="q-mark font-display text-[19px]">
          ?
        </text>
      )}
      <path d="M69 15h15l10 11v9H69z" fill="none" strokeWidth="2" className="truck-line stroke-[#6a6a62]" strokeLinejoin="round" />
      <path d="M74 19h8l6 7H74z" className="fill-[#3a3a36]" />
      <circle cx="20" cy="40" r="5.5" className="fill-[#0b0b0a] stroke-[#6a6a62]" strokeWidth="2" />
      <circle cx="50" cy="40" r="5.5" className="fill-[#0b0b0a] stroke-[#6a6a62]" strokeWidth="2" />
      <circle cx="82" cy="40" r="5.5" className="fill-[#0b0b0a] stroke-[#6a6a62]" strokeWidth="2" />
    </svg>
  )
}

function Field({ id, label, error, required, children, className = '' }: { id: string; label: string; error?: string; required?: boolean; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="flabel">
        {label}
        {required && (
          <span className="ml-1 text-vis" aria-hidden>
            *
          </span>
        )}
      </label>
      {children}
      {error && (
        <p id={`${id}-err`} className="ferr">
          {error}
        </p>
      )}
    </div>
  )
}

function FormStep({ api }: { api: QuoteApi }) {
  const { t: q, values, set, photos, addPhotos, removePhoto, maxPhotos, errors, status, submit } = api
  const fileRef = useRef<HTMLInputElement>(null)
  const [drag, setDrag] = useState(false)
  const pick = () => fileRef.current?.click()
  const err = (k: 'name' | 'phone') => (errors[k] ? { 'aria-invalid': true as const, 'aria-describedby': `q-${k}-err` } : {})

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-9">
      <fieldset aria-describedby={errors.job ? 'q-job-err' : undefined}>
        <legend className="flabel">
          <span className="display mr-2 text-[15px] tracking-normal text-vis">01</span>
          {q.jobLabel}
          <span className="ml-1 text-vis" aria-hidden>
            *
          </span>
        </legend>
        <div className="mt-4 flex flex-wrap gap-2">
          {q.jobs.map((j) => (
            <label key={j.id} className="relative">
              <input type="radio" name="job" value={j.id} checked={values.job === j.id} onChange={() => set('job', j.id)} className="peer sr-only" />
              <span className="chip-face">
                {values.job === j.id && <Check size={16} strokeWidth={3} aria-hidden />}
                {j.label}
              </span>
            </label>
          ))}
        </div>
        {errors.job && (
          <p id="q-job-err" className="ferr">
            {errors.job}
          </p>
        )}
      </fieldset>

      <fieldset>
        <legend className="flabel">
          <span className="display mr-2 text-[15px] tracking-normal text-vis">02</span>
          {q.loadLabel}
        </legend>
        <div className="mt-4 grid gap-2 sm:grid-cols-5">
          {q.loads.map((l) => (
            <label key={l.id} className="relative block">
              <input type="radio" name="load" value={l.id} checked={values.load === l.id} onChange={() => set('load', l.id)} className="peer sr-only" />
              <span className="load-face">
                <TruckFill fill={l.fill} />
                <span className="flex min-w-0 flex-1 items-baseline justify-between gap-3 sm:flex-col sm:items-start sm:gap-0.5">
                  <span className="text-[15px] font-bold text-bone">{l.label}</span>
                  <span className="text-[12.5px] text-stone">{l.hint}</span>
                </span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <p className="flabel" id="q-photos-label">
          <span className="display mr-2 text-[15px] tracking-normal text-vis">03</span>
          {q.photosLabel}
          <span className="ml-2 tracking-normal text-stone normal-case">
            {photos.length}/{maxPhotos}
          </span>
        </p>
        <div
          className={`drop mt-4 p-3 ${drag ? 'is-drag' : ''}`}
          onDragOver={(e) => {
            e.preventDefault()
            setDrag(true)
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDrag(false)
            addPhotos(e.dataTransfer.files)
          }}
        >
          {photos.length === 0 ? (
            <button
              type="button"
              onClick={pick}
              aria-describedby="q-photos-hint"
              className="flex w-full flex-col items-center gap-3 px-4 py-7 text-center sm:flex-row sm:gap-5 sm:text-left"
            >
              <span className="grid h-14 w-14 flex-none place-items-center rounded-full bg-vis text-ink">
                <Camera size={24} strokeWidth={2.2} aria-hidden />
              </span>
              <span>
                <span className="block text-[17px] font-bold text-bone">{q.addPhotos}</span>
                <span id="q-photos-hint" className="mt-1 block text-[14px] leading-[1.5] text-stone">
                  {q.photosHint}
                </span>
              </span>
            </button>
          ) : (
            <ul className="grid grid-cols-4 gap-2 sm:grid-cols-6" aria-labelledby="q-photos-label">
              {photos.map((p) => (
                <li key={p.id} className="relative aspect-square overflow-hidden rounded-[2px] bg-coal">
                  <img src={p.url} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(p.id)}
                    aria-label={`${q.removePhoto} ${p.file.name}`}
                    className="absolute top-1 right-1 grid h-8 w-8 place-items-center rounded-full bg-ink/85 text-bone before:absolute before:-inset-1.5 before:content-[''] hover:bg-vis hover:text-ink"
                  >
                    <X size={15} strokeWidth={2.6} aria-hidden />
                  </button>
                </li>
              ))}
              {photos.length < maxPhotos && (
                <li>
                  <button
                    type="button"
                    onClick={pick}
                    className="flex aspect-square w-full flex-col items-center justify-center gap-1 rounded-[2px] border-[1.5px] border-[#3a3a36] text-[12px] font-semibold text-bone hover:border-vis"
                  >
                    <Plus size={20} className="text-vis" aria-hidden />
                    {q.addMore}
                  </button>
                </li>
              )}
            </ul>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => {
              addPhotos(e.target.files)
              e.target.value = ''
            }}
          />
        </div>
      </div>

      <div className="grid gap-x-4 gap-y-6 sm:grid-cols-2">
        <Field id="q-name" label={q.nameLabel} error={errors.name} required>
          <input id="q-name" className="finput" autoComplete="name" value={values.name} onChange={(e) => set('name', e.target.value)} {...err('name')} />
        </Field>
        <Field id="q-phone" label={q.phoneLabel} error={errors.phone} required>
          <input
            id="q-phone"
            className="finput"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={(e) => set('phone', e.target.value)}
            {...err('phone')}
          />
        </Field>
        <Field id="q-town" label={q.townLabel}>
          <input id="q-town" className="finput" autoComplete="address-level2" value={values.town} onChange={(e) => set('town', e.target.value)} />
        </Field>
        <Field id="q-when" label={q.whenLabel}>
          <select id="q-when" className="finput" value={values.when} onChange={(e) => set('when', e.target.value)}>
            <option value="">—</option>
            {q.whenOptions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </Field>
        <Field id="q-notes" label={q.notesLabel} className="sm:col-span-2">
          <textarea
            id="q-notes"
            rows={3}
            className="finput resize-y leading-[1.5]"
            placeholder={q.notesPlaceholder}
            value={values.notes}
            onChange={(e) => set('notes', e.target.value)}
          />
        </Field>
      </div>

      <div>
        <button type="submit" disabled={status === 'sending'} className="btn btn-vis min-h-[64px] w-full text-[18px] disabled:opacity-60">
          {status === 'sending' ? q.sending : q.submit}
          <ArrowRight className="arrow" size={20} strokeWidth={2.4} aria-hidden />
        </button>
        {status === 'error' && (
          <p role="alert" className="mt-4 text-[15px] font-semibold text-vis">
            {q.error}{' '}
            <a className="underline" href={`tel:${business.phoneE164}`}>
              {business.phoneDisplay}
            </a>
          </p>
        )}
        <p className="mt-4 text-center text-[13px] text-stone">{q.privacy}</p>
      </div>
    </form>
  )
}

function ChooseStep({ api }: { api: QuoteApi }) {
  const { t: q, links, markSent, back, photos, message } = api
  const ref = useRef<HTMLHeadingElement>(null)
  useEffect(() => ref.current?.focus(), [])
  const opts = [
    { href: links.sms, label: q.viaText, Icon: MessageSquare, primary: true },
    { href: links.whatsapp, label: q.viaWhatsApp, Icon: MessageCircle, external: true },
    { href: links.email, label: q.viaEmail, Icon: Mail },
  ]
  return (
    <div>
      <h3 ref={ref} tabIndex={-1} className="display text-[clamp(40px,4.4vw,64px)] outline-none">
        {q.chooseTitle}
      </h3>
      <p className="mt-4 max-w-[40ch] text-[17px] leading-[1.6] text-[#c9c7bf]">{q.chooseBody}</p>
      <div className="mt-8 grid gap-3">
        {opts.map(({ href, label, Icon, primary, external }) => (
          <a
            key={label}
            href={href}
            onClick={markSent}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className={`btn min-h-[64px] justify-between text-[17px] ${primary ? 'btn-vis' : 'btn-ghost'}`}
          >
            <span className="flex items-center gap-3">
              <Icon size={20} strokeWidth={2.2} aria-hidden />
              {label}
            </span>
            <ArrowRight className="arrow" size={19} aria-hidden />
          </a>
        ))}
      </div>
      {photos.length > 0 && (
        <ul className="mt-6 flex gap-2" aria-hidden>
          {photos.map((p) => (
            <li key={p.id} className="h-12 w-12 overflow-hidden rounded-[2px]">
              <img src={p.url} alt="" className="h-full w-full object-cover" />
            </li>
          ))}
        </ul>
      )}
      <pre className="mt-6 max-h-44 overflow-auto rounded-[2px] border border-line bg-coal p-4 font-sans text-[13px] leading-[1.55] whitespace-pre-wrap text-[#b9b7af]">
        {message}
      </pre>
      <button type="button" onClick={back} className="mt-6 inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-bone hover:text-vis">
        <ArrowLeft size={17} aria-hidden /> {q.back}
      </button>
    </div>
  )
}

function SentStep({ api }: { api: QuoteApi }) {
  const { t } = useLang()
  const { t: q, back } = api
  const ref = useRef<HTMLHeadingElement>(null)
  useEffect(() => ref.current?.focus(), [])
  return (
    <div className="py-6 md:py-12">
      <span className="grid h-20 w-20 place-items-center rounded-full bg-vis text-ink">
        <Check size={38} strokeWidth={3} aria-hidden />
      </span>
      <h3 ref={ref} tabIndex={-1} className="display mt-8 text-[clamp(48px,5.4vw,80px)] outline-none">
        {q.successTitle}
      </h3>
      <p className="mt-4 max-w-[36ch] text-[18px] leading-[1.6] text-[#c9c7bf]">{q.successBody}</p>
      <div className="mt-9 flex flex-col gap-3 sm:flex-row">
        <a href={`tel:${business.phoneE164}`} className="btn btn-vis">
          <Phone size={18} aria-hidden /> {t.nav.call} {business.phoneDisplay}
        </a>
        <button type="button" onClick={back} className="btn btn-ghost">
          <ArrowLeft size={17} aria-hidden /> {q.back}
        </button>
      </div>
    </div>
  )
}

export function Quote() {
  const { t } = useLang()
  const api = useQuote()
  const reduce = useReducedMotion()
  const q = api.t
  const step = api.status === 'choose' ? 'choose' : api.status === 'sent' ? 'sent' : 'form'

  return (
    <section id="quote" aria-labelledby="quote-title" className="surface-light relative bg-vis py-20 text-ink md:py-32">
      <div className="wrap grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <Reveal className="lg:sticky lg:top-[110px]">
            <Kicker tone="vis">{q.kicker}</Kicker>
            <Title id="quote-title" tone="vis" text={q.title} className="mt-6 text-[clamp(64px,7.6vw,120px)] leading-[0.9]" />
            <p className="mt-7 max-w-[26rem] text-[18px] leading-[1.55] font-medium text-ink/80 md:text-[20px]">{q.sub}</p>
            <div className="mt-10 hidden border-t-2 border-ink pt-6 lg:block">
              <p className="label text-[11px] text-ink/70">{t.hero.secondary}</p>
              <a href={`tel:${business.phoneE164}`} className="display mt-2 inline-block text-[44px] hover:underline">
                {business.phoneDisplay}
              </a>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <div className="surface-dark relative rounded-[3px] bg-ink p-5 text-bone shadow-[0_30px_80px_rgba(11,11,10,.28)] sm:p-8 md:p-11">
            <AnimatePresence mode="wait" initial={false}>
              <m.div
                key={step}
                initial={reduce ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                {step === 'form' && <FormStep api={api} />}
                {step === 'choose' && <ChooseStep api={api} />}
                {step === 'sent' && <SentStep api={api} />}
              </m.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
