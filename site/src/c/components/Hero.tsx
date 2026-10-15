import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { rich, useLang } from '@shared/i18n'
import { photos } from '@shared/media'
import { business } from '@shared/business'
import { openQuote, type QuoteApi } from '@shared/useQuote'
import { local } from '../local'
import { JobChips, LoadBars, PhotoPicker } from './QuoteParts'
import { MaskLines, Stripe } from './ui'

const ease = [0.16, 1, 0.3, 1] as const

export function Hero({ q }: { q: QuoteApi }) {
  const { t, lang } = useLang()
  const L = local(lang)
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '18%'])
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.06, reduce ? 1.06 : 1.16])
  const copyY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -90])
  const cardY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -150])
  const [place, region] = t.hero.eyebrow.split(' · ')
  const img = photos.streetTruck

  return (
    <section ref={ref} id="top" className="hero" aria-labelledby="hero-title">
      <motion.div className="hero-media" style={{ y: imgY, scale: imgScale }} aria-hidden="true">
        <img
          src={img.src}
          srcSet={`${img.sm} 900w, ${img.src} 1920w`}
          sizes="100vw"
          width={img.w}
          height={img.h}
          alt=""
          fetchPriority="high"
          className="hero-img"
        />
      </motion.div>
      <div className="hero-shade" aria-hidden="true" />

      <div className="wrap hero-grid">
        <motion.div className="hero-copy" style={{ y: copyY }}>
          <motion.p className="status" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15, ease }}>
            <b aria-hidden="true" />
            {t.hero.badges[2]}
            <span className="status-sep" aria-hidden="true">·</span>
            {place}
            <span className="hide-sm">
              <span className="status-sep" aria-hidden="true">·</span>
              {region}
            </span>
          </motion.p>
          <h1 id="hero-title" className="hero-h1 d-cond">
            <MaskLines lines={t.hero.headlines.c.map((l) => rich(l, 'acc'))} delay={0.25} instant />
          </h1>
          <motion.p className="hero-lede" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7, ease }}>
            {t.hero.lede}
          </motion.p>
        </motion.div>

        <motion.div className="hero-card-wrap" style={{ y: cardY }}>
          <motion.form
            className="hcard"
            aria-labelledby="hcard-title"
            initial={{ opacity: 0, y: 70 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.55, ease }}
            onSubmit={(e) => {
              e.preventDefault()
              openQuote(q.values.job ?? undefined)
            }}
          >
            <div className="hcard-head">
              <h2 id="hcard-title" className="hcard-title">
                {t.quote.kicker}
              </h2>
              <span className="hcard-step">{L.step1}</span>
            </div>
            <p className="hcard-sub">{t.quote.sub}</p>
            <JobChips q={q} name="hero-job" />
            <div className="hide-sm">
              <LoadBars q={q} name="hero-load" withUnsure={false} compact />
              <PhotoPicker q={q} id="hero-photos" variant="slim" />
            </div>
            <button type="submit" className="btn btn-red btn-block hcard-go">
              {L.continue}
              <ArrowRight size={20} strokeWidth={2.5} aria-hidden="true" />
            </button>
          </motion.form>
        </motion.div>
      </div>

      <div className="hero-foot">
        <Stripe className="hero-tape" delay={0.8} instant />
        <div className="wrap hero-bottom">
          <motion.a
            href={`tel:${business.phoneE164}`}
            className="hero-phone"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1, ease }}
          >
            <small>{t.contact.phoneLabel}</small>
            <span className="d-wide">{business.phoneDash}</span>
          </motion.a>
          <motion.ul className="hero-facts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.2 }}>
            <li>{t.hero.badges[0]}</li>
            <li>{t.hero.badges[1]}</li>
            <li>{region}</li>
          </motion.ul>
        </div>
      </div>
    </section>
  )
}
