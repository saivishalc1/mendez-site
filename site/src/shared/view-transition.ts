import { flushSync } from 'react-dom'

/** Runs a state update inside the View Transitions API (cross-fade), or instantly as a fallback. */
export function withViewTransition(update: () => void) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!document.startViewTransition || reduce) {
    update()
    return
  }
  document.startViewTransition(() => flushSync(update))
}
