import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useDeferredPoster } from '@shared/useDeferredPoster'
import { m, useReducedMotion } from 'motion/react'
import { rich } from '@shared/i18n'
import type { photos } from '@shared/media'

export const ease = [0.2, 0.7, 0.2, 1] as const

/** Small uppercase label preceded by a thin rule. */
export function Label({ children, plain = false, className = '' }: { children: ReactNode; plain?: boolean; className?: string }) {
  return <p className={`label ${plain ? 'label-plain' : ''} ${className}`}>{children}</p>
}

/** Serif headline with the content file's `*accent*` rendered italic rust. */
export function Title({
  text,
  as: Tag = 'h2',
  className = '',
  id,
}: {
  text: string
  as?: 'h1' | 'h2' | 'h3'
  className?: string
  id?: string
}) {
  return (
    <Tag id={id} className={`display ${className}`}>
      {rich(text, 'accent')}
    </Tag>
  )
}

/** Fade + rise once when it enters the viewport. */
export function Reveal({
  children,
  delay = 0,
  y = 26,
  className = '',
  as = 'div',
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  as?: 'div' | 'li' | 'figure' | 'p'
}) {
  const reduce = useReducedMotion()
  const M = m[as]
  return (
    <M
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 1.1, ease, delay }}
    >
      {children}
    </M>
  )
}

/** A 1px rule that draws itself in from the left. */
export function Rule({ className = '', delay = 0, dark = false }: { className?: string; delay?: number; dark?: boolean }) {
  const reduce = useReducedMotion()
  return (
    <m.div
      aria-hidden
      className={`h-px origin-left ${dark ? 'bg-rule-dark' : 'bg-rule'} ${className}`}
      initial={reduce ? false : { scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 1.4, ease, delay }}
    />
  )
}

/** True once the element has come within `margin` of the viewport (and while it stays near). */
export function useNear<T extends Element>(margin = '400px') {
  const ref = useRef<T>(null)
  const [near, setNear] = useState(false)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        setVisible(e.isIntersecting)
        if (e.isIntersecting) setNear(true)
      },
      { rootMargin: margin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [margin])
  return { ref, near, visible }
}

/**
 * Muted looping video that only loads and plays while near the viewport.
 * Shows the poster until then (and always, for reduced motion).
 */
export function LazyVideo({ src, poster, className = '' }: { src: string; poster: string; className?: string }) {
  const { ref, near, visible } = useNear<HTMLVideoElement>('300px')
  useDeferredPoster(ref, poster)
  const reduce = useReducedMotion()
  useEffect(() => {
    const v = ref.current
    if (!v || reduce || !near) return
    if (visible) v.play().catch(() => {})
    else v.pause()
  }, [near, visible, reduce, ref])
  return (
    <video
      ref={ref}
      className={className}
      src={near && !reduce ? src : undefined}
      muted
      playsInline
      loop
      preload="none"
      aria-hidden
      tabIndex={-1}
    />
  )
}

export function Arrow({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.3" className={className}>
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  )
}

/** Responsive srcset for the hi-res photos (xs 640 / sm 900 / md 1280 / full 1920). */
export function srcSet(p: (typeof photos)[keyof typeof photos]) {
  const set = [
    [p.xs, 640],
    [p.sm, 900],
    [p.md, 1280],
    [p.src, p.w],
  ].filter(([u]) => u) as [string, number][]
  return set.length > 1 ? set.map(([u, w]) => `${u} ${w}w`).join(', ') : undefined
}
