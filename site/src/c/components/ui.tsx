import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import { motion } from 'motion/react'
import { business } from '@shared/business'
import { lowPower, prefersReducedMotion } from '@shared/SmoothScroll'

/** Small uppercase label with the stripe tick in front. */
export function Kicker({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`kicker ${className}`}>
      <i aria-hidden="true" />
      {children}
    </p>
  )
}

/** Dashed reflective stripe, like the DOT tape on the trucks. Draws across when it enters the viewport. */
export function Stripe({ className = '', delay = 0, instant = false }: { className?: string; delay?: number; instant?: boolean }) {
  return (
    <motion.div
      aria-hidden="true"
      className={`tape ${className}`}
      initial={{ scaleX: 0 }}
      {...(instant ? { animate: { scaleX: 1 } } : { whileInView: { scaleX: 1 }, viewport: { once: true, margin: '0px 0px -8% 0px' } })}
      transition={{ duration: 1.1, delay, ease: [0.65, 0, 0.2, 1] }}
    />
  )
}

export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`wordmark ${className}`}>
      <i aria-hidden="true" />
      {business.name}
    </span>
  )
}

export function FacebookIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H8v3h2.5V21h3z" />
    </svg>
  )
}

/** True once the element comes within `margin` of the viewport; false again when it leaves (if `track`). */
export function useNear<T extends Element>(ref: RefObject<T | null>, margin = '300px', track = true) {
  const [near, setNear] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setNear(true)
        else if (track) setNear(false)
      },
      { rootMargin: margin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, margin, track])
  return near
}

/**
 * Muted looping background video that only loads and plays near the viewport.
 * On low-power devices (or reduced motion) it stays on its poster.
 */
export function LazyVideo({ src, poster, className = '' }: { src: string; poster: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const near = useNear(ref, '200px')
  const [still] = useState(() => lowPower() || prefersReducedMotion())
  useEffect(() => {
    const v = ref.current
    if (!v || still) return
    if (near) {
      if (!v.getAttribute('src')) v.src = src
      v.play().catch(() => {})
    } else v.pause()
  }, [near, src, still])
  return <video ref={ref} className={className} poster={poster} muted playsInline loop preload="none" aria-hidden="true" tabIndex={-1} />
}

/** Fade + rise when scrolled into view. */
export function Rise({ children, delay = 0, className = '', y = 28 }: { children: ReactNode; delay?: number; className?: string; y?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.8, delay, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.div>
  )
}

/** Splits a headline into masked lines that slide up in sequence when seen. */
export function MaskLines({ lines, className = '', delay = 0, instant = false }: { lines: ReactNode[]; className?: string; delay?: number; instant?: boolean }) {
  return (
    <>
      {lines.map((line, i) => (
        <span key={i} className={`mask ${className}`}>
          <motion.span
            className="mask-in"
            initial={{ y: '108%', skewY: 5 }}
            {...(instant ? { animate: { y: '0%', skewY: 0 } } : { whileInView: { y: '0%', skewY: 0 }, viewport: { once: true, margin: '0px 0px -8% 0px' } })}
            transition={{ duration: 0.9, delay: delay + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </>
  )
}
