import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { Check, Minus } from 'lucide-react'
import { useLang } from '@shared/i18n'
import { videos } from '@shared/media'
import { lowPower } from '@shared/SmoothScroll'
import { LazyVideo, Label, Reveal, Rule, Title, useNear } from './ui'

function useScrubMode() {
  const [scrub, setScrub] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 900px) and (hover: hover)')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const update = () => setScrub(mq.matches && !reduce && !lowPower())
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return scrub
}

function Town({ name, i, n, progress }: { name: string; i: number; n: number; progress: MotionValue<number> }) {
  const a = 0.12 + (i / n) * 0.7
  const opacity = useTransform(progress, [a - 0.08, a], [0.22, 1])
  const x = useTransform(progress, [a - 0.08, a], [-14, 0])
  return (
    <motion.li style={{ opacity, x }} className="flex items-baseline gap-4">
      <span className="w-7 text-[11px] tracking-[0.2em] text-stone-2 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
      <span>{name}</span>
    </motion.li>
  )
}

/** Pinned aerial: video time follows scroll position. */
function Scrubbed() {
  const { t } = useLang()
  const a = t.areas
  const ref = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const { ref: nearRef, near } = useNear<HTMLDivElement>('600px')
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const raf = useRef(0)
  const scale = useTransform(scrollYProgress, [0, 1], [1.12, 1])

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const v = video.current
    if (!v || !v.duration || Number.isNaN(v.duration)) return
    cancelAnimationFrame(raf.current)
    raf.current = requestAnimationFrame(() => {
      const target = Math.min(v.duration - 0.05, Math.max(0, p * v.duration))
      if (Math.abs(v.currentTime - target) > 0.02) v.currentTime = target
    })
  })
  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  return (
    <div ref={ref} className="relative h-[260svh]">
      <div ref={nearRef} className="sticky top-0 h-svh overflow-hidden">
        <motion.div className="absolute inset-0" style={{ scale }}>
          <video
            ref={video}
            className="grade-film size-full object-cover"
            src={near ? videos.cityScrub.src : undefined}
            poster={videos.cityScrub.poster}
            muted
            playsInline
            preload={near ? 'auto' : 'none'}
            aria-hidden
            tabIndex={-1}
          />
        </motion.div>
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(90deg,rgba(23,22,20,.88)_0%,rgba(23,22,20,.6)_45%,rgba(23,22,20,.2)_100%)]" />
        <div className="relative mx-auto grid h-full max-w-[1440px] grid-cols-12 items-center gap-14 px-16 pt-16">
          <div className="col-span-6">
            <Label>{a.kicker}</Label>
            <Title id="areas-title" text={a.title} className="mt-6 text-[clamp(3.6rem,5vw,5.4rem)] text-paper" />
            <p className="mt-7 max-w-[28rem] text-[16px] leading-[1.65] text-paper/75">{a.body}</p>
          </div>
          <ul className="col-span-5 col-start-8 space-y-1 font-serif text-[clamp(2rem,2.8vw,2.9rem)] leading-[1.15] tracking-[-0.015em] text-paper">
            {a.towns.map((town, i) => (
              <Town key={town} name={town} i={i} n={a.towns.length} progress={scrollYProgress} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

/** Phones / low power: a normal autoplaying loop. */
function Simple() {
  const { t } = useLang()
  const a = t.areas
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0">
        <LazyVideo src={videos.cityScrub.mobile} poster={videos.cityScrub.poster} className="grade-film size-full object-cover" />
      </div>
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(23,22,20,.9)_0%,rgba(23,22,20,.55)_45%,rgba(23,22,20,.92)_100%)]" />
      <div className="relative px-5 py-24 sm:px-8">
        <Label>{a.kicker}</Label>
        <Reveal>
          <Title id="areas-title" text={a.title} className="mt-6 text-[2.9rem] text-paper sm:text-[3.8rem]" />
        </Reveal>
        <p className="mt-6 max-w-[28rem] text-[16px] leading-[1.65] text-paper/75">{a.body}</p>
        <ul className="mt-10 border-t border-paper/20">
          {a.towns.map((town, i) => (
            <Reveal as="li" key={town} delay={i * 0.04} y={12} className="flex items-baseline gap-4 border-b border-paper/15 py-2.5">
              <span className="w-7 text-[11px] tracking-[0.2em] text-stone-2 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
              <span className="font-serif text-[30px] leading-[1.1] tracking-[-0.01em] text-paper">{town}</span>
            </Reveal>
          ))}
        </ul>
      </div>
    </div>
  )
}

function Takes() {
  const { t } = useLang()
  const k = t.takes
  return (
    <div className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 lg:px-16 lg:py-36">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <Label>{k.kicker}</Label>
          <Reveal>
            <Title text={k.title} className="mt-6 text-[2.9rem] text-paper sm:text-[3.8rem] lg:text-[clamp(3.6rem,4.6vw,4.8rem)]" />
          </Reveal>
        </div>
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-[1.4fr_1fr] lg:col-span-7 lg:gap-14 lg:pt-4">
          <div>
            <Rule dark className="!bg-paper/60" />
            <ul className="grid grid-cols-1">
              {k.yes.map((item, i) => (
                <Reveal as="li" key={item} delay={i * 0.03} y={10} className="flex items-center gap-4 border-b border-rule-dark py-3.5 text-[16px] text-paper">
                  <Check size={16} strokeWidth={1.6} className="shrink-0 text-rust-soft" aria-hidden />
                  {item}
                </Reveal>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-4 text-[11px] tracking-[0.24em] text-stone-2 uppercase">{k.noTitle}</p>
            <Rule dark />
            <ul>
              {k.no.map((item) => (
                <li key={item} className="flex items-center gap-4 border-b border-rule-dark py-3.5 text-[16px] text-paper/60">
                  <Minus size={16} strokeWidth={1.6} className="shrink-0 text-stone-2" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 font-serif text-[24px] leading-[1.2] tracking-[-0.01em] text-paper">{k.noNote}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Areas() {
  const scrub = useScrubMode()
  const reduce = useReducedMotion()
  return (
    <section id="areas" aria-labelledby="areas-title" className="on-dark relative bg-ink text-paper">
      {scrub && !reduce ? <Scrubbed /> : <Simple />}
      <Takes />
    </section>
  )
}
