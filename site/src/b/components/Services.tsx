import { useRef, useState, type PointerEvent } from 'react'
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { useLang } from '@shared/i18n'
import { photos } from '@shared/media'
import { openQuote } from '@shared/useQuote'
import { Arrow, Label, Reveal, Rule, Title, ease } from './ui'

const PREVIEW = 260

export function Services() {
  const { t } = useLang()
  const s = t.services
  const reduce = useReducedMotion()
  const listRef = useRef<HTMLUListElement>(null)
  const [active, setActive] = useState<number | null>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 28, mass: 0.6 })
  const sy = useSpring(y, { stiffness: 220, damping: 28, mass: 0.6 })

  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse' || !listRef.current) return
    const r = listRef.current.getBoundingClientRect()
    x.set(e.clientX - r.left - PREVIEW / 2)
    y.set(e.clientY - r.top - PREVIEW * 0.62)
  }

  return (
    <section id="services" aria-labelledby="services-title" className="relative">
      <div className="mx-auto max-w-[1440px] px-5 pt-8 pb-28 sm:px-8 lg:px-16 lg:pb-40">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end lg:gap-14">
          <div className="lg:col-span-8">
            <Label>{s.kicker}</Label>
            <Reveal>
              <Title id="services-title" text={s.title} className="mt-6 text-[3rem] sm:text-[4rem] lg:text-[clamp(4.2rem,6vw,6.2rem)]" />
            </Reveal>
          </div>
          <Reveal delay={0.1} className="lg:col-span-4 lg:pb-3">
            <p className="text-[12px] tracking-[0.24em] text-stone uppercase">
              0{s.items.length} / {t.nav.services}
            </p>
          </Reveal>
        </div>

        <ul
          ref={listRef}
          className="relative mt-14 lg:mt-20"
          onPointerMove={onMove}
          onPointerLeave={() => setActive(null)}
        >
          <Rule className="!bg-ink" />
          {s.items.map((item, i) => {
            const p = photos[item.media]
            return (
              <li key={item.id} className="relative" onPointerEnter={(e) => e.pointerType === 'mouse' && setActive(i)}>
                <div
                  className={`group grid grid-cols-[2.25rem_1fr_auto] gap-x-4 gap-y-4 py-8 transition-colors duration-500 lg:grid-cols-[4rem_minmax(0,1.15fr)_minmax(0,1fr)_auto] lg:items-start lg:gap-x-10 lg:py-11 ${
                    active !== null && active !== i ? 'lg:opacity-45' : ''
                  } transition-opacity`}
                >
                  <span className="pt-2 text-[11px] tracking-[0.2em] text-stone lg:pt-5">0{i + 1}</span>
                  <h3 className="display text-[2.35rem] leading-[1] tracking-[-0.02em] transition-transform duration-700 ease-calm group-hover:translate-x-3 sm:text-[3rem] lg:text-[clamp(3rem,4.3vw,4.4rem)]">
                    {item.name}
                  </h3>
                  {/* inline thumbnail on touch / small screens */}
                  <img
                    src={p.src}
                    width={p.w}
                    height={p.h}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="grade size-[72px] rounded-[2px] object-cover sm:size-24 lg:hidden"
                  />
                  <div className="col-span-3 col-start-1 sm:col-span-2 sm:col-start-2 lg:col-span-1 lg:col-start-3 lg:pt-3">
                    <p className="max-w-[30rem] text-[16px] leading-[1.6] text-body">{item.blurb}</p>
                    <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2" aria-label={item.name}>
                      {item.includes.map((inc) => (
                        <li key={inc} className="text-[11px] tracking-[0.18em] text-stone uppercase">
                          {inc}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="col-span-3 col-start-1 sm:col-span-2 sm:col-start-2 lg:col-span-1 lg:col-start-4 lg:pt-3">
                    <button
                      type="button"
                      onClick={() => openQuote(item.id)}
                      className="link-u whitespace-nowrap text-[14px]"
                      aria-label={`${s.cta}: ${item.name}`}
                    >
                      {s.cta}
                      <Arrow className="transition-transform duration-500 ease-calm group-hover:translate-x-1.5 lg:-translate-x-2 lg:opacity-0 lg:group-hover:translate-x-0 lg:group-hover:opacity-100" />
                    </button>
                  </div>
                </div>
                <Rule delay={0.05 * i} />
              </li>
            )
          })}

          {/* cursor-follow preview (desktop, mouse only) */}
          {!reduce && (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute top-0 left-0 z-10 hidden lg:block"
              style={{ x: sx, y: sy, width: PREVIEW, height: PREVIEW * 1.15 }}
            >
              <AnimatePresence>
                {active !== null && (
                  <motion.div
                    key={active}
                    className="absolute inset-0 overflow-hidden rounded-[2px] bg-paper-2 shadow-[0_30px_60px_-30px_rgba(23,22,20,.45)]"
                    initial={{ opacity: 0, scale: 0.92, clipPath: 'inset(12% 12% 12% 12%)' }}
                    animate={{ opacity: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0%)' }}
                    exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.25 } }}
                    transition={{ duration: 0.55, ease }}
                  >
                    <img
                      src={photos[s.items[active].media].src}
                      width={315}
                      height={315}
                      alt=""
                      className="grade size-full object-cover"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </ul>
      </div>
    </section>
  )
}
