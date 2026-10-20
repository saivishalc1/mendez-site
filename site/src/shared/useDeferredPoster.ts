import { useEffect, type RefObject } from 'react'

/**
 * A <video poster> downloads as soon as the element exists, even far below the fold.
 * This sets the poster only when the video comes within ~1.5 screens, so the first
 * screen loads without paying for posters the visitor hasn't reached yet.
 */
export function useDeferredPoster(ref: RefObject<HTMLVideoElement | null>, poster: string) {
  useEffect(() => {
    const v = ref.current
    if (!v) return
    if (!('IntersectionObserver' in window)) {
      v.poster = poster
      return
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          v.poster = poster
          io.disconnect()
        }
      },
      { rootMargin: '150% 0px' },
    )
    io.observe(v)
    return () => io.disconnect()
  }, [ref, poster])
}
