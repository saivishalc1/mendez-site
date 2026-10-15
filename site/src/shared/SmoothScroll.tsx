import { useEffect, type ReactNode } from 'react'
import { ReactLenis, useLenis } from 'lenis/react'
import 'lenis/dist/lenis.css'

/** Chrome/Safari report trackpad scrolls with wheelDeltaY === -3 * deltaY; notched wheels use ±120 steps. */
function isTrackpad(e: WheelEvent) {
  const legacy = (e as WheelEvent & { wheelDeltaY?: number }).wheelDeltaY
  if (typeof legacy === 'number' && legacy !== 0) return legacy === -3 * e.deltaY
  return e.deltaMode === 0 && Math.abs(e.deltaY) < 60
}

/** Trackpads keep native momentum scrolling; notched mouse wheels get Lenis smoothing. */
function Governor() {
  const lenis = useLenis()
  useEffect(() => {
    if (!lenis) return
    const onWheel = (e: WheelEvent) => {
      lenis.options.smoothWheel = !lowPower() && !isTrackpad(e)
    }
    window.addEventListener('wheel', onWheel, { capture: true, passive: true })
    return () => window.removeEventListener('wheel', onWheel, { capture: true })
  }, [lenis])
  return null
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce) return <>{children}</>
  return (
    <ReactLenis root options={{ lerp: 0.11, smoothWheel: true, anchors: true }}>
      <Governor />
      {children}
    </ReactLenis>
  )
}

/**
 * `?lowpower=1` forces, `?lowpower=0` disables. Otherwise true on Save-Data or
 * very small CPUs. Use it to drop background video and scroll-scrubbing only.
 */
export function lowPower() {
  const p = new URLSearchParams(location.search).get('lowpower')
  if (p === '1') return true
  if (p === '0') return false
  const nav = navigator as Navigator & { connection?: { saveData?: boolean } }
  return Boolean(nav.connection?.saveData) || (navigator.hardwareConcurrency ?? 8) <= 2
}

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
