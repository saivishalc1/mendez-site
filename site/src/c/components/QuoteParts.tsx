import { useRef, useState } from 'react'
import { Camera, X } from 'lucide-react'
import { rich } from '@shared/i18n'
import type { QuoteApi } from '@shared/useQuote'
import type { LoadId } from '@shared/content/en'

/** "Title, *accent.*" → two lines (plain part, accent part) so the accent gets its own row. */
export function titleLines(text: string, accent = 'acc') {
  const m = text.match(/^(.*?)\s*(\*[^*]+\*)$/)
  if (m && m[1]) return [rich(m[1], accent), rich(m[2], accent)]
  return [rich(text, accent)]
}

/** Job type chips (real radio inputs, styled as pills). */
export function JobChips({ q, name, size = 'md' }: { q: QuoteApi; name: string; size?: 'md' | 'lg' }) {
  const t = q.t
  return (
    <fieldset className="field" aria-describedby={q.errors.job ? `${name}-err` : undefined}>
      <legend className="flabel">{t.jobLabel}</legend>
      <div className={`chips chips-${size}`}>
        {t.jobs.map((j) => (
          <label key={j.id} className="chip">
            <input type="radio" name={name} value={j.id} checked={q.values.job === j.id} onChange={() => q.set('job', j.id)} />
            <span>{j.label}</span>
          </label>
        ))}
      </div>
      {q.errors.job && (
        <p id={`${name}-err`} className="ferr" role="alert">
          {q.errors.job}
        </p>
      )}
    </fieldset>
  )
}

/** Load size as truck-bed fill bars. */
export function LoadBars({ q, name, withUnsure = true, compact = false }: { q: QuoteApi; name: string; withUnsure?: boolean; compact?: boolean }) {
  const t = q.t
  const loads = withUnsure ? t.loads : t.loads.filter((l) => l.id !== 'unsure')
  return (
    <fieldset className="field">
      <legend className="flabel">{t.loadLabel}</legend>
      <div className={`loads ${compact ? 'loads-compact' : ''}`} style={{ ['--n' as string]: loads.length }}>
        {loads.map((l) => (
          <label key={l.id} className="load">
            <input type="radio" name={name} value={l.id} checked={q.values.load === l.id} onChange={() => q.set('load', l.id as LoadId)} />
            <span className="load-box">
              <span className={`bed ${l.fill > 0 ? '' : 'bed-q'}`} aria-hidden="true">
                {l.fill > 0 && <i style={{ transform: `scaleX(${l.fill})` }} />}
              </span>
              <span className="load-label">{l.label}</span>
              {!compact && <span className="load-hint">{l.hint}</span>}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

/** Photo picker: styled button/dropzone over a hidden file input, with removable thumbnails. */
export function PhotoPicker({ q, id, variant = 'zone', dropText }: { q: QuoteApi; id: string; variant?: 'zone' | 'slim'; dropText?: string }) {
  const t = q.t
  const input = useRef<HTMLInputElement>(null)
  const [over, setOver] = useState(false)
  const full = q.photos.length >= q.maxPhotos
  return (
    <div className="field">
      {variant === 'zone' && (
        <p className="flabel" id={`${id}-label`}>
          {t.photosLabel}
          <span className="flabel-count">
            {q.photos.length}/{q.maxPhotos}
          </span>
        </p>
      )}
      <input
        ref={input}
        id={id}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          q.addPhotos(e.target.files)
          e.target.value = ''
        }}
      />
      <button
        type="button"
        className={`drop drop-${variant} ${over ? 'is-over' : ''}`}
        disabled={full}
        aria-describedby={variant === 'zone' ? `${id}-hint` : undefined}
        onClick={() => input.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setOver(true)
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setOver(false)
          q.addPhotos(e.dataTransfer.files)
        }}
      >
        <Camera size={variant === 'zone' ? 26 : 18} strokeWidth={2} aria-hidden="true" />
        <span className="drop-main">{q.photos.length ? t.addMore : t.addPhotos}</span>
        {variant === 'zone' && dropText && <span className="drop-sub">{dropText}</span>}
        {variant === 'slim' && q.photos.length > 0 && <span className="drop-count">{q.photos.length}</span>}
      </button>
      {variant === 'zone' && (
        <p className="fhint" id={`${id}-hint`}>
          {t.photosHint}
        </p>
      )}
      {q.photos.length > 0 && (
        <ul className={`thumbs thumbs-${variant}`}>
          {q.photos.map((p, i) => (
            <li key={p.id}>
              <img src={p.url} alt={`${t.photosLabel} ${i + 1}`} width={96} height={96} />
              <button type="button" className="thumb-x" aria-label={`${t.removePhoto} ${i + 1}`} onClick={() => q.removePhoto(p.id)}>
                <X size={14} strokeWidth={3} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
