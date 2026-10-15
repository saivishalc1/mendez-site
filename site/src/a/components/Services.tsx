import { useRef, useState, type PointerEvent } from 'react'
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { useLang } from '@shared/i18n'
import { photos, videos } from '@shared/media'
import { openQuote } from '@shared/useQuote'
import { Hazard, Kicker, LazyVideo, Reveal, Title, useMedia } from './ui'

function Band() {
  const { t } = useLang()
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])
  return (
    <div ref={ref} className="surface-dark relative isolate flex min-h-[88svh] overflow-hidden bg-ink text-bone md:min-h-[92svh]">
      <motion.div style={reduce ? undefined : { y }} className="absolute inset-x-0 -top-[10%] -bottom-[10%] -z-10">
        <LazyVideo src={videos.demo.src} poster={videos.demo.poster} className="bw-video h-full w-full object-cover" />
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(11,11,10,.82)_0%,rgba(11,11,10,.35)_38%,rgba(11,11,10,.55)_70%,#0b0b0a_100%)]" />
      <div className="wrap flex flex-col justify-end pt-32 pb-14 md:pb-20">
        <Reveal>
          <Kicker>{t.services.kicker}</Kicker>
        </Reveal>
        <Reveal delay={0.08}>
          <Title id="services-title" text={t.services.title} className="mt-6 max-w-[11ch] text-[clamp(60px,11vw,180px)]" />
        </Reveal>
        <Reveal delay={0.16} className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <p className="max-w-[34rem] text-[17px] leading-[1.6] text-[#d5d3cb] md:text-[19px]">{t.services.intro}</p>
        </Reveal>
      </div>
    </div>
  )
}

export function Services() {
  const { t } = useLang()
  const fine = useMedia('(hover: hover) and (pointer: fine)')
  const reduce = useReducedMotion()
  const listRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<number | null>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 260, damping: 28, mass: 0.5 })
  const sy = useSpring(y, { stiffness: 260, damping: 28, mass: 0.5 })
  const items = t.services.items

  const onMove = (e: PointerEvent) => {
    const r = listRef.current?.getBoundingClientRect()
    if (!r) return
    x.set(e.clientX - r.left)
    y.set(e.clientY - r.top)
  }

  return (
    <section id="services" aria-labelledby="services-title">
      <Band />
      <Hazard />
      <div className="surface-light bg-bone py-16 text-ink md:py-28">
        <div className="wrap">
          <div ref={listRef} className="relative" onPointerMove={fine ? onMove : undefined} onPointerLeave={() => setActive(null)}>
          <ol>
            {items.map((item, i) => {
              const ph = photos[item.media]
              return (
                <Reveal as="li" key={item.id} delay={0.04 * i} className="svc-row relative border-t border-ink/15 last:border-b">
                  <div className="sweep absolute inset-x-[-20px] inset-y-0 bg-ink md:inset-x-[-40px] xl:inset-x-[-56px]" aria-hidden />
                  <div className="relative grid grid-cols-[1fr_auto] gap-x-4 gap-y-5 py-8 md:grid-cols-12 md:gap-x-8 md:py-11">
                    <div
                      className="col-span-1 flex items-start gap-4 md:col-span-7 md:gap-8"
                      onPointerEnter={fine ? () => setActive(i) : undefined}
                      onPointerLeave={fine ? () => setActive(null) : undefined}
                    >
                      <span className="svc-num display pt-[0.35em] text-[22px] text-stone transition-colors md:text-[28px]">0{i + 1}</span>
                      <h3 className="display text-[clamp(40px,5.7vw,86px)] leading-[0.9]">{item.name}</h3>
                    </div>
                    <img
                      src={ph.src}
                      width={ph.w}
                      height={ph.h}
                      alt={ph.alt}
                      loading="lazy"
                      className="bw col-start-2 row-start-1 h-[84px] w-[84px] rounded-[2px] object-cover md:hidden"
                    />
                    <div className="col-span-2 md:col-span-5 md:pt-2">
                      <p className="svc-muted text-[16px] leading-[1.6] text-ink/75 transition-colors md:text-[17px]">{item.blurb}</p>
                      <ul className="svc-muted mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-[12px] font-semibold tracking-[0.12em] text-ink/70 uppercase transition-colors">
                        {item.includes.map((inc) => (
                          <li key={inc} className="flex items-center gap-2">
                            <i className="diamond text-[14px]" aria-hidden />
                            {inc}
                          </li>
                        ))}
                      </ul>
                      <button
                        type="button"
                        onClick={() => openQuote(item.id)}
                        className="svc-cta btn mt-6 min-h-12 border-[1.5px] border-ink px-5 text-[14px] font-bold"
                      >
                        {t.services.cta}
                        <ArrowRight className="arrow" size={17} strokeWidth={2.4} aria-hidden />
                        <span className="sr-only">: {item.name}</span>
                      </button>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </ol>

            {fine && (
              <motion.div
                aria-hidden
                className="pointer-events-none absolute top-0 left-0 z-20"
                style={{ x: sx, y: sy }}
                initial={false}
                animate={{ opacity: active === null ? 0 : 1, scale: active === null || reduce ? 0.85 : 1 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="relative -mt-[150px] ml-[36px] h-[268px] w-[268px] rotate-[-4deg] overflow-hidden rounded-[2px] bg-ink shadow-[0_24px_60px_rgba(0,0,0,.35)] ring-[6px] ring-ink">
                  {items.map((item, i) => {
                    const ph = photos[item.media]
                    return (
                      <img
                        key={item.id}
                        src={ph.src}
                        width={ph.w}
                        height={ph.h}
                        alt=""
                        loading="lazy"
                        className="bw absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
                        style={{ opacity: active === i ? 1 : 0 }}
                      />
                    )
                  })}
                  <span className="label absolute bottom-0 left-0 bg-vis px-2.5 py-1.5 text-[10px] text-ink">0{(active ?? 0) + 1}</span>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
