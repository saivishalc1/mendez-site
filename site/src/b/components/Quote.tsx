import { useEffect, useRef, useState, type DragEvent, type ReactNode } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { ImagePlus, Mail, MessageCircle, MessageSquareText, Phone, X } from 'lucide-react'
import { useLang } from '@shared/i18n'
import { business } from '@shared/business'
import { useQuote } from '@shared/useQuote'
import { Label, Title, ease } from './ui'

/** The only string this direction adds (fieldset legend for the contact fields). */
const DETAILS = { en: 'Your details', es: 'Sus datos' } as const

function Step({ n, legend, error, errorId, children }: { n: string; legend: string; error?: string; errorId?: string; children: ReactNode }) {
  return (
    <fieldset className="border-t border-rule pt-6 pb-9 first:border-t-0 first:pt-0" aria-describedby={error ? errorId : undefined}>
      <legend className="float-left mb-5 flex w-full items-baseline gap-3">
        <span className="text-[11px] tracking-[0.2em] text-stone tabular-nums">{n}</span>
        <span className="text-[15px] font-medium text-ink">{legend}</span>
        {error && (
          <span id={errorId} role="alert" className="ml-auto text-[13px] text-rust">
            {error}
          </span>
        )}
      </legend>
      <div className="clear-both">{children}</div>
    </fieldset>
  )
}

function Field({
  id,
  label,
  error,
  children,
  className = '',
}: {
  id: string
  label: string
  error?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="flex items-baseline justify-between gap-3 text-[11px] tracking-[0.2em] text-stone uppercase">
        {label}
        {error && (
          <span id={`${id}-err`} role="alert" className="text-[12px] tracking-normal text-rust normal-case">
            {error}
          </span>
        )}
      </label>
      {children}
    </div>
  )
}

export function Quote() {
  const { t, lang } = useLang()
  const q = useQuote()
  const c = q.t
  const fileRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [drag, setDrag] = useState(false)
  const first = useRef(true)

  // Bring the next step into view (long form on phones).
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    if (q.status === 'choose' || q.status === 'sent' || q.status === 'error') {
      const el = panelRef.current
      if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      el?.querySelector<HTMLElement>('[data-autofocus]')?.focus({ preventScroll: true })
    }
  }, [q.status])

  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    setDrag(false)
    q.addPhotos(e.dataTransfer.files)
  }

  const err = q.errors

  return (
    <section id="quote" aria-labelledby="quote-title" className="relative bg-paper-2">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-12 px-5 py-24 sm:px-8 lg:grid-cols-12 lg:gap-14 lg:px-16 lg:py-36">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[120px]">
            <Label>{c.kicker}</Label>
            <Title id="quote-title" text={c.title} className="mt-6 text-[3.1rem] sm:text-[4rem] lg:text-[clamp(4rem,5.4vw,5.6rem)]" />
            <p className="mt-6 max-w-[24rem] text-[17px] leading-[1.6] text-body">{c.sub}</p>

            <ol className="mt-10 hidden max-w-[24rem] border-t border-ink lg:block">
              {t.process.steps.map((s) => (
                <li key={s.n} className="flex items-baseline gap-4 border-b border-rule py-4">
                  <span className="text-[11px] tracking-[0.2em] text-stone">{s.n}</span>
                  <span className="font-serif text-[24px] leading-none tracking-[-0.01em]">{s.title}</span>
                </li>
              ))}
            </ol>
            <a href={q.links.call} className="link-u mt-8 hidden lg:inline-flex">
              <Phone size={15} strokeWidth={1.5} /> {t.hero.secondary} · {business.phoneDash}
            </a>
          </div>
        </div>

        <div ref={panelRef} className="scroll-mt-24 lg:col-span-7">
          <div className="rounded-[3px] border border-rule bg-paper p-6 shadow-[0_40px_80px_-50px_rgba(23,22,20,.35)] sm:p-10 lg:p-14">
            <AnimatePresence mode="wait" initial={false}>
              {(q.status === 'idle' || q.status === 'sending') && (
                <m.form
                  key="form"
                  noValidate
                  onSubmit={q.submit}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.5, ease }}
                >
                  {/* 01 Job */}
                  <Step n="01" legend={c.jobLabel} error={err.job} errorId="job-err">
                    <div className="flex flex-wrap gap-2.5">
                      {c.jobs.map((j) => (
                        <label
                          key={j.id}
                          className="relative inline-flex min-h-11 cursor-pointer items-center rounded-full border border-rule px-5 text-[14px] text-ink transition-colors duration-300 select-none hover:border-ink has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-paper has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-rust"
                        >
                          <input
                            type="radio"
                            name="job"
                            value={j.id}
                            checked={q.values.job === j.id}
                            onChange={() => q.set('job', j.id)}
                            className="sr-only"
                          />
                          {j.label}
                        </label>
                      ))}
                    </div>
                  </Step>

                  {/* 02 Load */}
                  <Step n="02" legend={c.loadLabel}>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-5 sm:gap-x-3">
                      {c.loads.map((l) => (
                        <label
                          key={l.id}
                          className="group relative flex min-h-[64px] cursor-pointer flex-col justify-end rounded-[2px] py-2 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-rust"
                        >
                          <input
                            type="radio"
                            name="load"
                            value={l.id}
                            checked={q.values.load === l.id}
                            onChange={() => q.set('load', l.id)}
                            className="peer sr-only"
                          />
                          <span className="text-[14px] font-medium text-stone transition-colors peer-checked:text-ink group-hover:text-ink">
                            {l.label}
                          </span>
                          <span className="text-[12px] text-stone">{l.hint}</span>
                          <span
                            aria-hidden
                            className={`relative mt-2.5 block h-[3px] overflow-hidden rounded-full ${l.fill ? 'bg-rule' : 'border-t border-dashed border-stone/60 bg-transparent'}`}
                          >
                            <span
                              className={`absolute inset-y-0 left-0 rounded-full transition-[background-color] duration-500 ${
                                q.values.load === l.id ? 'bg-rust' : 'bg-stone/55 group-hover:bg-ink'
                              }`}
                              style={{ width: `${l.fill * 100}%` }}
                            />
                          </span>
                        </label>
                      ))}
                    </div>
                  </Step>

                  {/* 03 Photos */}
                  <Step n="03" legend={c.photosLabel}>
                    <div
                      onDragOver={(e) => {
                        e.preventDefault()
                        setDrag(true)
                      }}
                      onDragLeave={() => setDrag(false)}
                      onDrop={onDrop}
                      className={`rounded-[3px] border border-dashed p-5 transition-colors duration-300 sm:p-6 ${
                        drag ? 'border-ink bg-paper-2' : 'border-stone/50'
                      }`}
                    >
                      <input
                        ref={fileRef}
                        id="q-photos"
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          q.addPhotos(e.target.files)
                          e.target.value = ''
                        }}
                      />
                      {q.photos.length > 0 && (
                        <ul className="mb-5 grid grid-cols-4 gap-2.5 sm:grid-cols-6">
                          {q.photos.map((p) => (
                            <li key={p.id} className="relative aspect-square">
                              <img src={p.url} alt="" className="size-full rounded-[2px] object-cover" />
                              <button
                                type="button"
                                onClick={() => q.removePhoto(p.id)}
                                aria-label={`${c.removePhoto}: ${p.file.name}`}
                                className="absolute -top-2 -right-2 inline-flex size-7 items-center justify-center rounded-full bg-ink text-paper after:absolute after:-inset-2 after:content-['']"
                              >
                                <X size={13} strokeWidth={2} />
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="max-w-[24rem] text-[14px] leading-[1.55] text-stone">{c.photosHint}</p>
                        {q.photos.length < q.maxPhotos && (
                          <button
                            type="button"
                            onClick={() => fileRef.current?.click()}
                            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-ink px-5 text-[14px] font-medium transition-colors duration-300 hover:bg-ink hover:text-paper"
                          >
                            <ImagePlus size={16} strokeWidth={1.5} />
                            {q.photos.length ? c.addMore : c.addPhotos}
                            {q.photos.length > 0 && (
                              <span className="text-stone tabular-nums">
                                {q.photos.length}/{q.maxPhotos}
                              </span>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </Step>

                  {/* 04 Details */}
                  <Step n="04" legend={DETAILS[lang]}>
                    <div className="grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2">
                      <Field id="q-name" label={c.nameLabel} error={err.name}>
                        <input
                          id="q-name"
                          className="field"
                          autoComplete="name"
                          value={q.values.name}
                          onChange={(e) => q.set('name', e.target.value)}
                          aria-invalid={err.name ? true : undefined}
                          aria-describedby={err.name ? 'q-name-err' : undefined}
                          required
                        />
                      </Field>
                      <Field id="q-phone" label={c.phoneLabel} error={err.phone}>
                        <input
                          id="q-phone"
                          className="field"
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          value={q.values.phone}
                          onChange={(e) => q.set('phone', e.target.value)}
                          aria-invalid={err.phone ? true : undefined}
                          aria-describedby={err.phone ? 'q-phone-err' : undefined}
                          required
                        />
                      </Field>
                      <Field id="q-town" label={c.townLabel}>
                        <input
                          id="q-town"
                          className="field"
                          autoComplete="address-level2"
                          value={q.values.town}
                          onChange={(e) => q.set('town', e.target.value)}
                        />
                      </Field>
                      <Field id="q-when" label={c.whenLabel}>
                        <select id="q-when" className="field" value={q.values.when} onChange={(e) => q.set('when', e.target.value)}>
                          <option value="">—</option>
                          {c.whenOptions.map((o) => (
                            <option key={o} value={o}>
                              {o}
                            </option>
                          ))}
                        </select>
                      </Field>
                      <Field id="q-notes" label={c.notesLabel} className="sm:col-span-2">
                        <textarea
                          id="q-notes"
                          rows={2}
                          className="field resize-none leading-[1.5]"
                          placeholder={c.notesPlaceholder}
                          value={q.values.notes}
                          onChange={(e) => q.set('notes', e.target.value)}
                        />
                      </Field>
                    </div>
                  </Step>

                  <div className="flex flex-col gap-4 border-t border-ink pt-7 sm:flex-row sm:items-center sm:justify-between">
                    <p className="max-w-[22rem] text-[13px] leading-[1.5] text-stone">{c.privacy}</p>
                    <button type="submit" className="btn-ink min-h-[58px] w-full px-9 sm:w-auto" disabled={q.status === 'sending'}>
                      {q.status === 'sending' ? c.sending : c.submit}
                    </button>
                  </div>
                </m.form>
              )}

              {q.status === 'choose' && (
                <m.div
                  key="choose"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.5, ease }}
                  aria-live="polite"
                >
                  <Label>{c.kicker}</Label>
                  <h3 tabIndex={-1} data-autofocus className="display mt-4 text-[2.4rem] leading-[1.02] outline-none sm:text-[3.2rem]">
                    {c.chooseTitle}
                  </h3>
                  <p className="mt-4 max-w-[30rem] text-[16px] leading-[1.6] text-body">{c.chooseBody}</p>
                  <div className="mt-9 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {[
                      { href: q.links.sms, label: c.viaText, Icon: MessageSquareText, ext: false },
                      { href: q.links.whatsapp, label: c.viaWhatsApp, Icon: MessageCircle, ext: true },
                      { href: q.links.email, label: c.viaEmail, Icon: Mail, ext: false },
                    ].map(({ href, label, Icon, ext }, i) => (
                      <a
                        key={label}
                        href={href}
                        onClick={q.markSent}
                        target={ext ? '_blank' : undefined}
                        rel={ext ? 'noopener noreferrer' : undefined}
                        className={`group flex min-h-[64px] items-center justify-between gap-3 rounded-full px-6 text-[15px] font-medium transition-colors duration-300 ${
                          i === 0 ? 'bg-ink text-paper hover:bg-rust' : 'border border-ink text-ink hover:bg-ink hover:text-paper'
                        }`}
                      >
                        {label}
                        <Icon size={18} strokeWidth={1.5} />
                      </a>
                    ))}
                  </div>
                  <pre className="mt-9 max-h-48 overflow-auto rounded-[2px] border border-rule bg-paper-2/60 p-4 font-sans text-[13px] leading-[1.6] whitespace-pre-wrap text-body">
                    {q.message}
                  </pre>
                  <button type="button" onClick={q.back} className="link-u mt-6 text-[14px]">
                    ← {c.back}
                  </button>
                </m.div>
              )}

              {(q.status === 'sent' || q.status === 'error') && (
                <m.div
                  key="done"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease }}
                  aria-live="polite"
                  className="py-4"
                >
                  <svg aria-hidden viewBox="0 0 64 64" className="size-16 text-rust">
                    <m.circle
                      cx="32"
                      cy="32"
                      r="30"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.1, ease }}
                    />
                    {q.status === 'sent' && (
                      <m.path
                        d="M20 33l8 8 16-17"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.7, ease, delay: 0.6 }}
                      />
                    )}
                  </svg>
                  <h3 tabIndex={-1} data-autofocus className="display mt-8 text-[2.6rem] leading-[1.02] outline-none sm:text-[3.4rem]">
                    {q.status === 'sent' ? c.successTitle : c.error}
                  </h3>
                  {q.status === 'sent' && <p className="mt-4 max-w-[28rem] text-[16px] leading-[1.6] text-body">{c.successBody}</p>}
                  <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3">
                    <a href={q.links.call} className="btn-ink">
                      <Phone size={16} strokeWidth={1.5} /> {t.nav.call} · {business.phoneDash}
                    </a>
                    <button type="button" onClick={q.back} className="link-u text-[14px]">
                      ← {c.back}
                    </button>
                  </div>
                </m.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
