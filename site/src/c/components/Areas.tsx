import { useEffect, useRef, useState } from 'react'
import { useDeferredPoster } from '@shared/useDeferredPoster'
import { m, useMotionValueEvent, useScroll, useTransform, type MotionValue } from 'motion/react'
import { Check, X } from 'lucide-react'
import { useLang } from '@shared/i18n'
import { videos } from '@shared/media'
import { lowPower, prefersReducedMotion } from '@shared/SmoothScroll'
import { openQuote } from '@shared/useQuote'
import { titleLines } from './QuoteParts'
import { Kicker, LazyVideo, MaskLines, Rise, useNear } from './ui'

function useScrubMode() {
  const [scrub] = useState(() => !lowPower() && !prefersReducedMotion() && window.matchMedia('(min-width: 900px) and (hover: hover)').matches)
  return scrub
}

function Town({ name, i, n, p }: { name: string; i: number; n: number; p: MotionValue<number> }) {
  const at = 0.08 + (i / n) * 0.78
  const opacity = useTransform(p, [at - 0.06, at], [0.22, 1])
  const x = useTransform(p, [at - 0.06, at], [0, 14])
  const tick = useTransform(p, [at - 0.06, at], [0, 1])
  return (
    <m.li style={{ opacity }}>
      <m.i style={{ scaleX: tick }} aria-hidden="true" />
      <m.span style={{ x }}>{name}</m.span>
    </m.li>
  )
}

/** Pinned aerial: video.currentTime follows scroll progress, eased toward the target each frame. */
function ScrubAreas() {
  const { t } = useLang()
  const a = t.areas
  const ref = useRef<HTMLDivElement>(null)
  const vid = useRef<HTMLVideoElement>(null)
  useDeferredPoster(vid, videos.cityScrub.poster)
  const near = useNear(ref, '600px')
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const target = useRef(0)
  const counter = useTransform(scrollYProgress, (p) => String(Math.min(a.towns.length, Math.max(1, Math.ceil(((p - 0.08) / 0.78) * a.towns.length + 0.01)))).padStart(2, '0'))

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const v = vid.current
    if (v && v.duration) target.current = p * (v.duration - 0.05)
  })

  useEffect(() => {
    const v = vid.current
    if (!v || !near) return
    if (!v.getAttribute('src')) {
      v.preload = 'auto'
      v.src = videos.cityScrub.src
    }
    let raf = 0
    const tick = () => {
      if (v.readyState >= 2 && !v.seeking) {
        const diff = target.current - v.currentTime
        if (Math.abs(diff) > 0.02) v.currentTime = v.currentTime + diff * 0.35
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [near])

  return (
    <div ref={ref} className="areas-pin">
      <div className="areas-stage">
        <video ref={vid} className="areas-video" muted playsInline preload="none" aria-hidden="true" tabIndex={-1} />
        <div className="areas-shade" aria-hidden="true" />
        <div className="wrap areas-inner">
          <div className="areas-copy">
            <Kicker className="on-dark">{a.kicker}</Kicker>
            <h2 id="areas-title" className="sec-title d-cond">
              <MaskLines lines={titleLines(a.title)} />
            </h2>
            <p className="areas-body">{a.body}</p>
            <p className="areas-count d-wide" aria-hidden="true">
              <m.span>{counter}</m.span>
              <small>/{String(a.towns.length).padStart(2, '0')}</small>
            </p>
          </div>
          <ul className="towns d-cond">
            {a.towns.map((tn, i) => (
              <Town key={tn} name={tn} i={i} n={a.towns.length} p={scrollYProgress} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function LoopAreas() {
  const { t } = useLang()
  const a = t.areas
  return (
    <div className="areas-loop">
      <LazyVideo src={videos.cityScrub.mobile} poster={videos.cityScrub.poster} className="areas-video" />
      <div className="areas-shade" aria-hidden="true" />
      <div className="wrap areas-inner">
        <div className="areas-copy">
          <Kicker className="on-dark">{a.kicker}</Kicker>
          <h2 id="areas-title" className="sec-title d-cond">
            <MaskLines lines={titleLines(a.title)} />
          </h2>
          <p className="areas-body">{a.body}</p>
        </div>
        <ul className="towns towns-static d-cond">
          {a.towns.map((tn, i) => (
            <m.li
              key={tn}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
            >
              <i aria-hidden="true" />
              <span>{tn}</span>
            </m.li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function Areas() {
  const { t } = useLang()
  const k = t.takes
  const scrub = useScrubMode()
  return (
    <section id="areas" className="areas" aria-labelledby="areas-title">
      {scrub ? <ScrubAreas /> : <LoopAreas />}

      <div className="wrap takes" aria-labelledby="takes-title">
        <header className="takes-head">
          <Kicker className="on-dark">{k.kicker}</Kicker>
          <h2 id="takes-title" className="sec-title sec-title-md d-cond">
            <MaskLines lines={titleLines(k.title)} />
          </h2>
        </header>
        <div className="takes-grid">
          <ul className="takes-yes">
            {k.yes.map((y, i) => (
              <m.li
                key={y}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -5% 0px' }}
                transition={{ duration: 0.5, delay: i * 0.04 }}
              >
                <span className="yes-ic" aria-hidden="true">
                  <Check size={16} strokeWidth={3} />
                </span>
                {y}
              </m.li>
            ))}
          </ul>
          <Rise className="takes-no">
            <h3 className="flabel">{k.noTitle}</h3>
            <ul>
              {k.no.map((n) => (
                <li key={n}>
                  <span className="no-ic" aria-hidden="true">
                    <X size={16} strokeWidth={3} />
                  </span>
                  {n}
                </li>
              ))}
            </ul>
            <button type="button" className="takes-note" onClick={() => openQuote()}>
              {k.noNote}
            </button>
          </Rise>
        </div>
      </div>
    </section>
  )
}
