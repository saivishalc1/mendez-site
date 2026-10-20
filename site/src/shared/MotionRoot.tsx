import type { ReactNode } from 'react'
import { LazyMotion, domAnimation } from 'motion/react'

/**
 * Loads only motion's DOM animation features (no layout projection or drag), which
 * keeps the shared bundle much smaller. Components must use `m.div`, not `motion.div`
 * (`strict` throws if one slips in).
 */
export function MotionRoot({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  )
}
