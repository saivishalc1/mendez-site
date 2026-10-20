import { startTransition, useEffect, useState, type ReactNode } from 'react'

const PENDING_KEY = '__pendingAnchor'
const DONE_EVENT = 'progressive:done'
const done = new Set<string>()
type PendingWindow = Window & { [PENDING_KEY]?: string }

/**
 * Scrolls to an in-page anchor, or remembers it if that section hasn't rendered yet
 * (Progressive scrolls there as soon as it appears).
 */
export function scrollToAnchor(id: string) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  else (window as PendingWindow)[PENDING_KEY] = id
}

function idle(cb: () => void) {
  const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }
  if (w.requestIdleCallback) w.requestIdleCallback(cb, { timeout: 400 })
  else setTimeout(cb, 16)
}

/**
 * Renders below-the-fold sections one at a time after the first screen has painted,
 * each in its own low-priority transition. Building ~12 animated sections in one go
 * blocked the main thread for over a second on phones; one section per idle slice keeps
 * every task short. Deep links (#quote) and early CTA clicks scroll once the target exists.
 */
export function Progressive({ sections, name, after }: { sections: ReactNode[]; name?: string; after?: string }) {
  const [count, setCount] = useState(0)
  const [ready, setReady] = useState(() => !after || done.has(after))

  // `after`: wait until the Progressive with that name has rendered everything
  useEffect(() => {
    if (ready || !after) return
    const onDone = (e: Event) => {
      if ((e as CustomEvent<string>).detail === after) setReady(true)
    }
    window.addEventListener(DONE_EVENT, onDone)
    if (done.has(after)) setReady(true)
    return () => window.removeEventListener(DONE_EVENT, onDone)
  }, [after, ready])

  useEffect(() => {
    if (!ready) return
    if (count >= sections.length) {
      if (name && !done.has(name)) {
        done.add(name)
        window.dispatchEvent(new CustomEvent(DONE_EVENT, { detail: name }))
      }
      return
    }
    let cancelled = false
    const step = () => {
      if (!cancelled) startTransition(() => setCount((c) => c + 1))
    }
    // Wait for the first paint before starting, then one section per idle slice
    if (count === 0) requestAnimationFrame(() => requestAnimationFrame(() => idle(step)))
    else idle(step)
    return () => {
      cancelled = true
    }
  }, [count, sections.length, ready, name])

  useEffect(() => {
    const w = window as PendingWindow
    const target = w[PENDING_KEY] ?? (count === sections.length ? location.hash.slice(1) : '')
    if (!target) return
    const el = document.getElementById(target)
    if (el) {
      w[PENDING_KEY] = undefined
      requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }))
    }
  }, [count, sections.length])

  return <>{sections.slice(0, count)}</>
}
