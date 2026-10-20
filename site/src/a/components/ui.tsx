import { Fragment, useEffect, useRef, useSyncExternalStore, type ElementType, type ReactNode } from 'react'
import { useDeferredPoster } from '@shared/useDeferredPoster'
import { m, useReducedMotion } from 'motion/react'
import { rich } from '@shared/i18n'
import { lowPower } from '@shared/SmoothScroll'

export const EASE = [0.16, 1, 0.3, 1] as const

export type Tone = 'dark' | 'light' | 'vis'

const accentFor: Record<Tone, string> = { dark: 'text-vis', light: 'accent-tape', vis: 'accent-ink' }

export function Kicker({ children, tone = 'dark', className = '' }: { children: ReactNode; tone?: Tone; className?: string }) {
  return (
    <p className={`label flex items-center gap-3 ${tone === 'dark' ? 'text-vis' : 'text-ink'} ${className}`}>
      <span className="hazard-chip" aria-hidden />
      {children}
    </p>
  )
}

/** Anton headline with the one accent phrase styled for the surface it sits on. */
export function Title({
  text,
  tone = 'dark',
  as: Tag = 'h2',
  className = '',
  id,
}: {
  text: string
  tone?: Tone
  as?: ElementType
  className?: string
  id?: string
}) {
  return (
    <Tag id={id} className={`display ${className}`}>
      {rich(text, accentFor[tone])}
    </Tag>
  )
}

/** Fade-up on first view. Instant when the visitor prefers reduced motion. */
export function Reveal({
  children,
  className = '',
  delay = 0,
  y = 36,
  as = 'div',
}: {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  as?: 'div' | 'li' | 'figure' | 'header'
}) {
  const reduce = useReducedMotion()
  const Comp = m[as]
  if (reduce) {
    const Plain = as
    return <Plain className={className}>{children}</Plain>
  }
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </Comp>
  )
}

export function Hazard({ className = '' }: { className?: string }) {
  return <div className={`hazard ${className}`} aria-hidden />
}

/** Yellow tape band with Anton words separated by small black diamonds. Decorative. */
export function Tape({ words, className = '', reverse = false }: { words: string[]; className?: string; reverse?: boolean }) {
  const list = [...words, ...words]
  const group = (k: number) => (
    <div className="tape-group" key={k}>
      {list.map((w, i) => (
        <Fragment key={i}>
          <span>{w}</span>
          <i className="diamond" />
        </Fragment>
      ))}
    </div>
  )
  return (
    <div className={`tape ${reverse ? 'tape-rev' : ''} ${className}`} aria-hidden>
      <div className="tape-track">
        {group(0)}
        {group(1)}
      </div>
    </div>
  )
}

export function useMedia(query: string) {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(query)
      m.addEventListener('change', cb)
      return () => m.removeEventListener('change', cb)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

/**
 * Muted looping video that only loads and plays near the viewport.
 * Reduced motion or low-power: stays on the poster.
 */
export function LazyVideo({ src, poster, className = '' }: { src: string; poster: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const reduce = useReducedMotion()
  useDeferredPoster(ref, poster)
  useEffect(() => {
    const v = ref.current
    if (!v || reduce || lowPower()) return
    v.muted = true
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (!v.getAttribute('src')) v.src = src
          v.play().catch(() => {})
        } else v.pause()
      },
      { rootMargin: '250px 0px' },
    )
    io.observe(v)
    return () => io.disconnect()
  }, [src, reduce])
  return (
    <video
      ref={ref}
      className={className}
      muted
      loop
      playsInline
      preload="none"
      disablePictureInPicture
      aria-hidden
      tabIndex={-1}
    />
  )
}
