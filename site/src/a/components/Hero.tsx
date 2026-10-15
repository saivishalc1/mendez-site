import { useRef, type CSSProperties } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { plain, rich, useLang } from '@shared/i18n'
import { business } from '@shared/business'
import { photos } from '@shared/media'
import { openQuote } from '@shared/useQuote'
import { EASE, Tape } from './ui'

/** Round yellow badge: static centre, slowly rotating ring of text. */
function Badge({ center, ring }: { center: string; ring: string }) {
  return (
    <div className="relative grid aspect-square w-full place-items-center rounded-full bg-vis text-ink shadow-[0_18px_50px_rgba(0,0,0,.45)]">
      <svg viewBox="0 0 200 200" className="spin absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <path id="a-ring" d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0" />
        </defs>
        <text className="fill-ink text-[12.5px] font-bold tracking-[0.12em] uppercase">
          <textPath href="#a-ring" textLength="498" lengthAdjust="spacing">
            {ring}
          </textPath>
        </text>
      </svg>
      <div className="relative flex w-[58%] rotate-[-10deg] flex-col items-center text-center">
        <ShieldCheck className="mb-1 h-[18%] w-[18%]" strokeWidth={2.4} aria-hidden />
        <span className="display text-[clamp(15px,1.55vw,23px)] leading-[0.92]">{center}</span>
      </div>
    </div>
  )
}

export function Hero() {
  const { t, lang } = useLang()
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const photoY = useTransform(scrollYProgress, [0, 1], ['0%', '9%'])
  const copyY = useTransform(scrollYProgress, [0, 1], ['0%', '-14%'])

  const lines = t.hero.headlines.a
  const longestLine = Math.max(...lines.map((l) => plain(l).length))
  const longestWord = Math.max(...lines.flatMap((l) => plain(l).split(/\s+/)).map((w) => w.length))
  const wrapOnMobile = longestLine > 13
  const fit = {
    '--hl-d': `min(178px, 12.4vw, calc(min(1080px, 100vw - 112px) / ${(longestLine * 0.43).toFixed(2)}))`,
    '--hl-m': wrapOnMobile
      ? `min(86px, calc((100vw - 40px) / ${(longestWord * 0.47).toFixed(2)}))`
      : `min(100px, calc((100vw - 40px) / ${(longestLine * 0.44).toFixed(2)}))`,
  } as CSSProperties

  const img = photos.streetTruck
  const tapeWords = t.services.items.map((s) => s.name)
  const ring = `${t.about.facts[0].v} · ${t.hero.badges[1]} · ${t.hero.badges[2]} · `
  const intro = (delay: number) =>
    reduce ? {} : { initial: { opacity: 0, y: 22 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, delay, ease: EASE } }

  return (
    <section id="top" ref={ref} className="surface-dark relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink text-bone md:min-h-[max(100svh,760px)]">
      {/* Photo */}
      <div className="absolute inset-x-0 top-0 z-0 h-[50svh] overflow-hidden md:bottom-[96px] md:left-auto md:h-auto md:w-[53%]">
        <motion.div style={reduce ? undefined : { y: photoY }} className="absolute inset-x-0 -top-[10%] -bottom-[10%]">
          <img
            src={img.src}
            srcSet={`${img.sm} 900w, ${img.src} 1920w`}
            sizes="(min-width: 768px) 54vw, 100vw"
            width={img.w}
            height={img.h}
            alt={img.alt}
            fetchPriority="high"
            className="kenburns bw h-full w-full object-cover brightness-[.8] [object-position:38%_50%]"
          />
        </motion.div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,11,10,.7)_0%,rgba(11,11,10,0)_24%,rgba(11,11,10,0)_55%,#0b0b0a_100%)] md:bg-[linear-gradient(90deg,#0b0b0a_0%,rgba(11,11,10,0)_36%),linear-gradient(180deg,rgba(11,11,10,.55)_0%,rgba(11,11,10,0)_22%)]" />
        {!reduce && (
          <motion.div
            aria-hidden
            className="absolute inset-0 origin-right bg-vis"
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: 1.1, delay: 0.1, ease: [0.76, 0, 0.24, 1] }}
          />
        )}
      </div>

      {/* Copy */}
      <motion.div
        style={reduce ? undefined : { y: copyY }}
        className="wrap relative z-10 flex flex-1 flex-col justify-end pt-[35svh] pb-9 md:justify-center md:pt-32 md:pb-16"
      >
        <motion.p {...intro(0.05)} className="label flex items-center gap-3 text-vis">
          <span className="hazard-chip" aria-hidden />
          {t.hero.eyebrow}
        </motion.p>
        <h1
          key={lang}
          aria-label={lines.map(plain).join(' ')}
          style={fit}
          className={`hl display mt-5 mb-6 md:mt-7 md:mb-8 ${wrapOnMobile ? '' : 'hl-nowrap-m'}`}
        >
          {lines.map((line, i) => (
            <span key={i} aria-hidden className="hl-line -my-[0.06em] block overflow-hidden py-[0.06em]">
              <motion.span
                className="block"
                initial={reduce ? false : { y: '108%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 1.15, delay: 0.25 + i * 0.13, ease: EASE }}
              >
                {rich(line, 'text-vis')}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.p {...intro(0.55)} className="max-w-[30rem] text-[17px] leading-[1.55] text-[#c9c7bf] md:text-[19px]">
          {t.hero.lede}
        </motion.p>
        <motion.div {...intro(0.68)} className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap md:mt-10 md:gap-3.5">
          <button type="button" className="btn btn-vis md:min-h-[62px] md:px-8" onClick={() => openQuote()}>
            {t.hero.primary} <ArrowRight className="arrow" size={19} strokeWidth={2.4} aria-hidden />
          </button>
          <a href={`tel:${business.phoneE164}`} className="btn btn-ghost font-semibold md:min-h-[62px] md:px-7">
            {t.hero.secondary} <b className="text-vis">{business.phoneDash}</b>
          </a>
        </motion.div>
      </motion.div>

      {/* Badge */}
      <motion.div
        className="absolute top-[calc(50svh-118px)] right-4 z-20 w-[104px] md:top-auto md:right-14 md:bottom-[150px] md:w-[178px]"
        initial={reduce ? false : { scale: 0, rotate: -40 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 140, damping: 14, delay: 0.95 }}
      >
        <Badge center={t.hero.badges[0]} ring={ring} />
      </motion.div>

      {/* Hazard + tape */}
      <div className="relative z-20">
        <div className="hazard" aria-hidden />
        <Tape words={tapeWords} className="h-[64px] text-[30px] md:h-[96px] md:text-[44px]" />
      </div>
    </section>
  )
}
