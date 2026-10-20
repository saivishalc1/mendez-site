import { useRef } from 'react'
import { m, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useLang } from '@shared/i18n'
import { videos } from '@shared/media'
import { LazyVideo, Reveal } from './ui'

/** Full-bleed dark film band: the frame opens up as you scroll into it. */
export function Film() {
  const { t } = useLang()
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 0.42], reduce ? [1, 1] : [0.86, 1])
  const radius = useTransform(scrollYProgress, [0, 0.42], reduce ? [0, 0] : [6, 0])
  const vy = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-7%', '7%'])
  const ty = useTransform(scrollYProgress, [0.2, 0.8], reduce ? [0, 0] : [50, -50])

  return (
    <section ref={ref} aria-label={t.services.kicker} className="on-dark relative overflow-hidden bg-ink text-paper">
      <m.div className="relative h-[78svh] overflow-hidden lg:h-[100svh]" style={{ scale, borderRadius: radius }}>
        <m.div className="absolute inset-[-8%_0]" style={{ y: vy }}>
          <LazyVideo src={videos.crew.src} poster={videos.crew.poster} className="grade-film size-full object-cover" />
        </m.div>
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(23,22,20,.55)_0%,rgba(23,22,20,.15)_40%,rgba(23,22,20,.75)_100%)]" />

        <m.div style={{ y: ty }} className="absolute inset-x-0 bottom-0 mx-auto max-w-[1440px] px-5 pb-14 sm:px-8 lg:px-16 lg:pb-24">
          <Reveal>
            <p className="display max-w-[20ch] text-[2.3rem] leading-[1.04] tracking-[-0.02em] text-paper sm:text-[3.2rem] lg:max-w-[24ch] lg:text-[clamp(3.2rem,4.6vw,4.9rem)]">
              {t.services.intro}
            </p>
          </Reveal>
        </m.div>
      </m.div>
    </section>
  )
}
