import { useEffect, useRef, type ReactNode } from 'react'
import { useDeferredPoster } from '@shared/useDeferredPoster'
import { m, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { Check, X } from 'lucide-react'
import { useLang } from '@shared/i18n'
import { lowPower } from '@shared/SmoothScroll'
import { videos } from '@shared/media'
import { Hazard, Kicker, LazyVideo, Reveal, Title, useMedia } from './ui'

export function Takes() {
  const { t } = useLang()
  const k = t.takes
  return (
    <section aria-labelledby="takes-title" className="surface-dark bg-coal py-20 text-bone md:py-32">
      <div className="wrap grid gap-12 md:grid-cols-12 md:gap-10">
        <Reveal className="md:col-span-5">
          <Kicker>{k.kicker}</Kicker>
          <Title id="takes-title" text={k.title} className="mt-6 max-w-[10ch] text-[clamp(52px,6.6vw,104px)]" />
        </Reveal>
        <div className="grid gap-10 md:col-span-7 lg:grid-cols-[1.25fr_1fr] lg:gap-8">
          <ul className="border-t border-line">
            {k.yes.map((item, i) => (
              <Reveal as="li" key={item} delay={0.03 * i} y={16} className="flex items-center gap-4 border-b border-line py-3.5 md:py-4">
                <span className="grid h-7 w-7 flex-none place-items-center rounded-[2px] bg-vis text-ink">
                  <Check size={16} strokeWidth={3} aria-hidden />
                </span>
                <span className="text-[18px] font-semibold md:text-[19px]">{item}</span>
              </Reveal>
            ))}
          </ul>
          <Reveal delay={0.1} className="self-start overflow-hidden rounded-[3px] border border-line bg-ink">
            <Hazard />
            <div className="p-6 md:p-7">
              <h3 className="display text-[30px] md:text-[34px]">{k.noTitle}</h3>
              <ul className="mt-5">
                {k.no.map((item) => (
                  <li key={item} className="flex items-center gap-3.5 border-b border-line py-3 text-[17px] text-[#c9c7bf] last:border-0">
                    <X size={18} strokeWidth={2.6} className="flex-none text-stone" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-[15px] font-semibold text-vis">{k.noNote}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Town({ name, i, progress, base }: { name: string; i: number; progress: MotionValue<number>; base: boolean }) {
  const start = 0.12 + i * 0.075
  const opacity = useTransform(progress, [start, start + 0.07], [base ? 1 : 0.2, 1])
  return (
    <m.li style={{ opacity }} className="flex items-center gap-[0.32em]">
      <span className={base ? 'text-vis' : undefined}>{name}</span>
      <i className="diamond text-vis" aria-hidden />
    </m.li>
  )
}

function AreasCopy({ townsSlot }: { townsSlot: ReactNode }) {
  const { t } = useLang()
  const a = t.areas
  return (
    <div className="wrap relative z-10 flex h-full flex-1 flex-col justify-between gap-12 pt-28 pb-14 md:pt-32 md:pb-16">
      <div className="grid gap-8 md:grid-cols-12 md:items-end">
        <div className="md:col-span-8">
          <Kicker>{a.kicker}</Kicker>
          <Title id="areas-title" text={a.title} className="mt-6 max-w-[14ch] text-[clamp(50px,6.6vw,108px)]" />
        </div>
        <p className="max-w-[26rem] text-[17px] leading-[1.6] text-[#d5d3cb] md:col-span-4 md:text-[18px]">{a.body}</p>
      </div>
      {townsSlot}
    </div>
  )
}

const townsClass = 'display flex flex-wrap gap-x-[0.32em] gap-y-1 text-[clamp(34px,4.6vw,74px)] leading-[1]'

/** Desktop: pinned frame, the aerial film is scrubbed by scroll and the towns light up one by one. */
function AreasScrub() {
  const { t } = useLang()
  const wrapRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  useDeferredPoster(videoRef, videos.cityScrub.poster)
  const target = useRef(0)
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ['start start', 'end end'] })
  const barScale = useTransform(scrollYProgress, [0, 1], [0, 1])

  useEffect(() => {
    const v = videoRef.current
    const el = wrapRef.current
    if (!v || !el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !v.getAttribute('src')) {
          v.preload = 'auto'
          v.src = videos.cityScrub.src
          v.load()
          io.disconnect()
        }
      },
      { rootMargin: '900px 0px' },
    )
    io.observe(el)
    const seek = () => {
      if (!v.duration || v.seeking) return
      const tt = target.current * (v.duration - 0.05)
      if (Math.abs(v.currentTime - tt) > 0.02) v.currentTime = tt
    }
    v.addEventListener('seeked', seek)
    v.addEventListener('loadedmetadata', seek)
    return () => {
      io.disconnect()
      v.removeEventListener('seeked', seek)
      v.removeEventListener('loadedmetadata', seek)
    }
  }, [])

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    target.current = p
    const v = videoRef.current
    if (v && v.duration && !v.seeking) {
      const tt = p * (v.duration - 0.05)
      if (Math.abs(v.currentTime - tt) > 0.02) v.currentTime = tt
    }
  })

  return (
    <section id="areas" aria-labelledby="areas-title" className="surface-dark relative bg-ink text-bone">
      <div ref={wrapRef} className="relative h-[260vh]">
        <div className="sticky top-0 h-[100svh] min-h-[640px] overflow-hidden">
          <video
            ref={videoRef}
            className="bw-video absolute inset-0 h-full w-full object-cover"
            muted
            playsInline
            preload="none"
            aria-hidden
            tabIndex={-1}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,11,10,.85)_0%,rgba(11,11,10,.35)_40%,rgba(11,11,10,.55)_70%,rgba(11,11,10,.92)_100%)]" />
          <AreasCopy
            townsSlot={
              <ul className={townsClass}>
                {t.areas.towns.map((town, i) => (
                  <Town key={town} name={town} i={i} progress={scrollYProgress} base={i === 0} />
                ))}
              </ul>
            }
          />
          <m.div aria-hidden className="absolute inset-x-0 bottom-0 h-[6px] origin-left bg-vis" style={{ scaleX: barScale }} />
        </div>
      </div>
    </section>
  )
}

/** Phones, low-power and reduced motion: a plain section over the mobile loop. */
function AreasSimple() {
  const { t } = useLang()
  return (
    <section id="areas" aria-labelledby="areas-title" className="surface-dark relative isolate overflow-hidden bg-ink text-bone">
      <div className="absolute inset-0 -z-10">
        <LazyVideo src={videos.cityScrub.mobile} poster={videos.cityScrub.poster} className="bw-video h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,11,10,.88)_0%,rgba(11,11,10,.5)_45%,rgba(11,11,10,.92)_100%)]" />
      </div>
      <div className="flex min-h-[100svh] flex-col">
        <AreasCopy
          townsSlot={
            <ul className={townsClass}>
              {t.areas.towns.map((town, i) => (
                <li key={town} className="flex items-center gap-[0.32em]">
                  <span className={i === 0 ? 'text-vis' : undefined}>{town}</span>
                  <i className="diamond text-vis" aria-hidden />
                </li>
              ))}
            </ul>
          }
        />
      </div>
      <div className="h-[6px] bg-vis" aria-hidden />
    </section>
  )
}

export function Areas() {
  const desktop = useMedia('(min-width: 768px)')
  const reduce = useReducedMotion()
  return desktop && !reduce && !lowPower() ? <AreasScrub /> : <AreasSimple />
}
