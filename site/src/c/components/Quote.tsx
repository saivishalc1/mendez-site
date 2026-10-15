import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, ArrowRight, Check, Mail, MessageCircle, MessageSquare, Phone } from 'lucide-react'
import { useLang } from '@shared/i18n'
import { business } from '@shared/business'
import type { QuoteApi } from '@shared/useQuote'
import { local } from '../local'
import { JobChips, LoadBars, PhotoPicker, titleLines } from './QuoteParts'
import { Kicker, MaskLines } from './ui'

const swap = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
  transition: { duration: 0.45, ease: [0.2, 0.8, 0.2, 1] as const },
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <div className={`field input ${error ? 'has-err' : ''}`}>
      <label htmlFor={id} className="flabel">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-err`} className="ferr" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export function Quote({ q }: { q: QuoteApi }) {
  const { t, lang } = useLang()
  const L = local(lang)
  const f = q.t
  const err = q.errors

  return (
    <section id="quote" className="quote light" aria-labelledby="quote-title">
      <div className="wrap quote-grid">
        <div className="quote-side">
          <Kicker>{f.kicker}</Kicker>
          <h2 id="quote-title" className="sec-title d-cond">
            <MaskLines lines={titleLines(f.title)} />
          </h2>
          <p className="quote-sub">{f.sub}</p>
          <ol className="quote-steps">
            {t.process.steps.map((s) => (
              <li key={s.n}>
                <span>{s.n}</span>
                {s.title}
              </li>
            ))}
          </ol>
          <div className="quote-call">
            <p className="flabel">{t.contact.phoneLabel}</p>
            <a href={q.links.call} className="d-wide">
              {business.phoneDash}
            </a>
          </div>
        </div>

        <div className="qcard">
          <div className="qcard-tape tape" aria-hidden="true" />
          <AnimatePresence mode="wait" initial={false}>
            {(q.status === 'idle' || q.status === 'sending' || q.status === 'error') && (
              <motion.form key="form" className="qform" noValidate onSubmit={q.submit} {...swap}>
                <p className="qcard-step">{L.step2}</p>
                <JobChips q={q} name="q-job" size="lg" />
                <LoadBars q={q} name="q-load" />
                <PhotoPicker q={q} id="q-photos" dropText={L.drop} />

                <div className="qrow">
                  <Field id="q-name" label={f.nameLabel} error={err.name}>
                    <input
                      id="q-name"
                      type="text"
                      autoComplete="name"
                      value={q.values.name}
                      onChange={(e) => q.set('name', e.target.value)}
                      aria-invalid={!!err.name}
                      aria-describedby={err.name ? 'q-name-err' : undefined}
                      required
                    />
                  </Field>
                  <Field id="q-phone" label={f.phoneLabel} error={err.phone}>
                    <input
                      id="q-phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={q.values.phone}
                      onChange={(e) => q.set('phone', e.target.value)}
                      aria-invalid={!!err.phone}
                      aria-describedby={err.phone ? 'q-phone-err' : undefined}
                      required
                    />
                  </Field>
                </div>
                <Field id="q-town" label={f.townLabel}>
                  <input id="q-town" type="text" autoComplete="address-level2" value={q.values.town} onChange={(e) => q.set('town', e.target.value)} />
                </Field>

                <fieldset className="field">
                  <legend className="flabel">{f.whenLabel}</legend>
                  <div className="chips chips-md">
                    {f.whenOptions.map((w) => (
                      <label key={w} className="chip">
                        <input type="radio" name="q-when" value={w} checked={q.values.when === w} onChange={() => q.set('when', w)} />
                        <span>{w}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <Field id="q-notes" label={f.notesLabel}>
                  <textarea id="q-notes" rows={3} placeholder={f.notesPlaceholder} value={q.values.notes} onChange={(e) => q.set('notes', e.target.value)} />
                </Field>

                {q.status === 'error' && (
                  <p className="qerror" role="alert">
                    {f.error}{' '}
                    <a href={q.links.call}>{business.phoneDisplay}</a>
                  </p>
                )}

                <button type="submit" className="btn btn-red btn-block btn-xl" disabled={q.status === 'sending'}>
                  {q.status === 'sending' ? f.sending : f.submit}
                  <ArrowRight size={22} strokeWidth={2.5} aria-hidden="true" />
                </button>
                <p className="qprivacy">{f.privacy}</p>
              </motion.form>
            )}

            {q.status === 'choose' && (
              <motion.div key="choose" className="qstate" {...swap}>
                <h3 className="qstate-title d-cond">{f.chooseTitle}</h3>
                <p className="qstate-body">{f.chooseBody}</p>
                <div className="qchoose">
                  <a href={q.links.sms} onClick={q.markSent} className="btn btn-red btn-block btn-xl">
                    <MessageSquare size={20} aria-hidden="true" />
                    {f.viaText}
                  </a>
                  <a href={q.links.whatsapp} onClick={q.markSent} target="_blank" rel="noopener noreferrer" className="btn btn-ink btn-block btn-xl">
                    <MessageCircle size={20} aria-hidden="true" />
                    {f.viaWhatsApp}
                  </a>
                  <a href={q.links.email} onClick={q.markSent} className="btn btn-line btn-block btn-xl">
                    <Mail size={20} aria-hidden="true" />
                    {f.viaEmail}
                  </a>
                </div>
                <p className="flabel">{L.preview}</p>
                <pre className="qpreview">{q.message}</pre>
                <button type="button" className="qback" onClick={q.back}>
                  <ArrowLeft size={18} aria-hidden="true" />
                  {f.back}
                </button>
              </motion.div>
            )}

            {q.status === 'sent' && (
              <motion.div key="sent" className="qstate qsent" {...swap} role="status">
                <span className="qsent-check" aria-hidden="true">
                  <Check size={34} strokeWidth={3} />
                </span>
                <h3 className="qstate-title d-cond">{f.successTitle}</h3>
                <p className="qstate-body">{f.successBody}</p>
                <a href={q.links.call} className="btn btn-ink btn-block btn-xl">
                  <Phone size={20} aria-hidden="true" />
                  {business.phoneDisplay}
                </a>
                <button type="button" className="qback" onClick={q.back}>
                  <ArrowLeft size={18} aria-hidden="true" />
                  {f.back}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
