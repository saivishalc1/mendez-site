import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { business, FORM_ENDPOINT } from './business'
import type { JobId, LoadId } from './content/en'
import { useLang } from './i18n'

export type QuoteValues = {
  job: JobId | null
  load: LoadId | null
  name: string
  phone: string
  town: string
  when: string
  notes: string
}

export type QuotePhoto = { id: string; file: File; url: string }
export type QuoteStatus = 'idle' | 'sending' | 'choose' | 'sent' | 'error'
export type QuoteErrors = Partial<Record<'job' | 'name' | 'phone', string>>

const EMPTY: QuoteValues = { job: null, load: null, name: '', phone: '', town: '', when: '', notes: '' }
const MAX_PHOTOS = 8
const QUOTE_EVENT = 'mv:quote'

/**
 * Opens the quote section from anywhere (service rows, nav, sticky bar) and
 * optionally preselects the job type.
 */
export function openQuote(job?: JobId) {
  window.dispatchEvent(new CustomEvent(QUOTE_EVENT, { detail: { job } }))
  document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function digits(s: string) {
  return s.replace(/\D/g, '')
}

/**
 * All quote-form state and logic, shared by the three design directions.
 * Each direction renders its own UI on top of this.
 */
export function useQuote() {
  const { t, lang } = useLang()
  const q = t.quote
  const [values, setValues] = useState<QuoteValues>(EMPTY)
  const [photos, setPhotos] = useState<QuotePhoto[]>([])
  const [errors, setErrors] = useState<QuoteErrors>({})
  const [status, setStatus] = useState<QuoteStatus>('idle')
  const photosRef = useRef(photos)
  photosRef.current = photos

  useEffect(() => {
    const onOpen = (e: Event) => {
      const job = (e as CustomEvent<{ job?: JobId }>).detail?.job
      if (job) setValues((v) => ({ ...v, job }))
      setStatus((s) => (s === 'sent' ? 'idle' : s))
    }
    window.addEventListener(QUOTE_EVENT, onOpen)
    return () => window.removeEventListener(QUOTE_EVENT, onOpen)
  }, [])

  // Release preview URLs when the form unmounts
  useEffect(() => () => photosRef.current.forEach((p) => URL.revokeObjectURL(p.url)), [])

  const set = useCallback(<K extends keyof QuoteValues>(key: K, value: QuoteValues[K]) => {
    setValues((v) => ({ ...v, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }, [])

  const addPhotos = useCallback((files: FileList | File[] | null) => {
    if (!files) return
    const list = Array.from(files).filter((f) => f.type.startsWith('image/'))
    setPhotos((prev) => [
      ...prev,
      ...list.slice(0, MAX_PHOTOS - prev.length).map((file) => ({
        id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2, 7)}`,
        file,
        url: URL.createObjectURL(file),
      })),
    ])
  }, [])

  const removePhoto = useCallback((id: string) => {
    setPhotos((prev) => {
      const gone = prev.find((p) => p.id === id)
      if (gone) URL.revokeObjectURL(gone.url)
      return prev.filter((p) => p.id !== id)
    })
  }, [])

  const jobLabel = q.jobs.find((j) => j.id === values.job)?.label ?? ''
  const loadLabel = q.loads.find((l) => l.id === values.load)?.label ?? ''

  /** The request written out as a text message, in the visitor's language. */
  const message = useMemo(() => {
    const lines = [
      q.messageIntro,
      jobLabel && `${q.messageJob}: ${jobLabel}`,
      loadLabel && `${q.messageLoad}: ${loadLabel}`,
      values.town && `${q.messageTown}: ${values.town}`,
      values.when && `${q.messageWhen}: ${values.when}`,
      values.name && `${q.messageName}: ${values.name}`,
      values.phone && `${q.messagePhone}: ${values.phone}`,
      values.notes && `${q.messageNotes}: ${values.notes}`,
      photos.length ? `(${photos.length}) ${q.messagePhotos}` : '',
    ]
    return lines.filter(Boolean).join('\n')
  }, [q, jobLabel, loadLabel, values, photos.length])

  const links = useMemo(() => {
    const body = encodeURIComponent(message)
    return {
      sms: `sms:${business.phoneE164}?&body=${body}`,
      whatsapp: `https://wa.me/${business.whatsapp}?text=${body}`,
      email: `mailto:${business.email}?subject=${encodeURIComponent(`${q.kicker}: ${jobLabel || 'Mendez-Vasquez'}`)}&body=${body}`,
      call: `tel:${business.phoneE164}`,
    }
  }, [message, q.kicker, jobLabel])

  const validate = useCallback(() => {
    const next: QuoteErrors = {}
    if (!values.job) next.job = q.required
    if (!values.name.trim()) next.name = q.required
    const d = digits(values.phone)
    if (!d) next.phone = q.required
    else if (d.length < 10) next.phone = q.phoneInvalid
    setErrors(next)
    return Object.keys(next).length === 0
  }, [values, q])

  /**
   * With FORM_ENDPOINT set, posts the request (photos included) and shows success.
   * Without one, moves to the "choose an app" step: text / WhatsApp / email.
   */
  const submit = useCallback(
    async (e?: { preventDefault: () => void }) => {
      e?.preventDefault()
      if (!validate()) return false
      if (!FORM_ENDPOINT) {
        setStatus('choose')
        return true
      }
      setStatus('sending')
      try {
        const data = new FormData()
        Object.entries({ ...values, job: jobLabel, load: loadLabel, lang, message }).forEach(([k, v]) => data.append(k, v ?? ''))
        photos.forEach((p) => data.append('photos', p.file, p.file.name))
        const res = await fetch(FORM_ENDPOINT, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
        setStatus(res.ok ? 'sent' : 'error')
        return res.ok
      } catch {
        setStatus('error')
        return false
      }
    },
    [validate, values, jobLabel, loadLabel, lang, message, photos],
  )

  /** Call after the visitor taps text / WhatsApp / email in the "choose" step. */
  const markSent = useCallback(() => setStatus('sent'), [])
  const back = useCallback(() => setStatus('idle'), [])
  const reset = useCallback(() => {
    photosRef.current.forEach((p) => URL.revokeObjectURL(p.url))
    setPhotos([])
    setValues(EMPTY)
    setErrors({})
    setStatus('idle')
  }, [])

  return {
    t: q,
    values,
    set,
    photos,
    addPhotos,
    removePhoto,
    maxPhotos: MAX_PHOTOS,
    errors,
    status,
    submit,
    markSent,
    back,
    reset,
    message,
    links,
  }
}

export type QuoteApi = ReturnType<typeof useQuote>
