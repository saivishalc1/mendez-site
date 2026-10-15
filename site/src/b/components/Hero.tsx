import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { rich, useLang } from '@shared/i18n'
import { business } from '@shared/business'
import { photos } from '@shared/media'
import { openQuote } from '@shared/useQuote'
import { Arrow, ease } from './ui'

export function Hero() {
  const { t } = useLang()
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const drift = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 90])
  const zoom = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1.02, 1.12])
  const copyY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -40])
  const photo = photos.snowTruck
  const index = t.services.items.slice(0, 4)
  const lines = t.hero.headlines.b

  const start = reduce ? false : undefined

  return (
    <section ref={ref} id="top" aria-labelledby="hero-title" className="relative flex min-h-svh flex-col pt-[72px] lg:min-h-[max(100svh,760px)] lg:pt-[102px]">
      <div className="mx-auto grid w-full max-w-[1440px] flex-1 grid-cols-1 items-center gap-10 px-5 pt-10 sm:px-8 lg:grid-cols-[1.22fr_1fr] lg:gap-14 lg:px-16 lg:pt-12 lg:pb-12">
        <motion.div style={{ y: copyY }} className="relative z-10">
          <motion.p
            className="label"
            initial={start ?? { opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease, delay: 0.15 }}
          >
            {t.footer.tagline}
          </motion.p>

          <h1 id="hero-title" className="display hero-title mt-6 mb-7 leading-[0.92] lg:mt-7 lg:mb-9">
            {lines.map((line, i) => (
              <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
                <motion.span
                  className="block"
                  initial={start ?? { y: '108%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 1.3, ease, delay: 0.25 + i * 0.14 }}
                >
                  {rich(line, 'accent')}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            className="max-w-[31rem] text-[17px] leading-[1.6] text-body lg:text-[19px]"
            initial={start ?? { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease, delay: 0.65 }}
          >
            {t.hero.lede}
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3 lg:mt-10"
            initial={start ?? { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease, delay: 0.8 }}
          >
            <button type="button" onClick={() => openQuote()} className="btn-ink min-h-[58px] px-8">
              {t.hero.primary}
            </button>
            <a href={`tel:${business.phoneE164}`} className="link-u">
              {t.hero.secondary} · {business.phoneDash}
            </a>
          </motion.div>
        </motion.div>

        <figure className="relative">
          <motion.div
            className="relative aspect-[4/3] overflow-hidden rounded-[2px] bg-paper-2 lg:aspect-auto lg:h-[min(560px,calc(100svh-340px))] lg:min-h-[420px]"
            initial={start ?? { clipPath: 'inset(0% 0% 100% 0%)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            transition={{ duration: 1.5, ease: [0.7, 0, 0.2, 1], delay: 0.35 }}
          >
            <motion.div className="absolute inset-[-6%_0]" style={{ y: drift }}>
              <motion.img
                src={photo.src}
                srcSet={`${photo.sm} 900w, ${photo.src} 1920w`}
                sizes="(min-width: 1024px) 44vw, 100vw"
                width={photo.w}
                height={photo.h}
                alt={photo.alt}
                fetchPriority="high"
                className="grade size-full object-cover object-[42%_50%]"
                style={{ scale: zoom }}
                initial={start ?? { opacity: 0.4 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.6, ease, delay: 0.4 }}
              />
            </motion.div>
          </motion.div>
          <motion.figcaption
            className="mt-3.5 flex items-baseline justify-between gap-4 text-[12px] tracking-[0.04em] text-stone"
            initial={start ?? { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.3 }}
          >
            <span className="font-medium text-ink">{t.work.items[1].caption}</span>
            <span>{t.hero.badges[0]}</span>
          </motion.figcaption>
        </figure>
      </div>

      {/* Numbered services index */}
      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-16">
        <div className="relative">
          <motion.div
            aria-hidden
            className="absolute inset-x-0 top-0 h-px origin-left bg-ink"
            initial={start ?? { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.6, ease, delay: 0.7 }}
          />
          <ul className="grid grid-cols-2 lg:grid-cols-4">
            {index.map((item, i) => (
              <li key={item.id} className="relative">
                {i > 0 && (
                  <motion.span
                    aria-hidden
                    className={`absolute top-0 left-0 h-full w-px origin-top bg-rule ${i === 2 ? 'max-lg:hidden' : ''}`}
                    initial={start ?? { scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 1.1, ease, delay: 1.05 + i * 0.1 }}
                  />
                )}
                {i >= 2 && <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-rule lg:hidden" />}
                <motion.a
                  href="#services"
                  className={`group flex h-full flex-col py-5 pr-3 lg:pt-[22px] lg:pb-[30px] ${i % 2 === 1 ? 'pl-4' : ''} ${i > 0 ? 'lg:pl-[22px]' : 'lg:pl-0'}`}
                  initial={start ?? { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease, delay: 1.0 + i * 0.1 }}
                >
                  <span className="flex items-center justify-between text-[11px] tracking-[0.2em] text-stone">
                    0{i + 1}
                    <Arrow className="-translate-x-2 opacity-0 transition-all duration-500 ease-calm group-hover:translate-x-0 group-hover:opacity-100" />
                  </span>
                  <span className="mt-1.5 font-serif text-[24px] leading-[1.05] tracking-[-0.01em] transition-transform duration-500 ease-calm group-hover:translate-x-1 lg:text-[34px]">
                    {item.name}
                  </span>
                </motion.a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
