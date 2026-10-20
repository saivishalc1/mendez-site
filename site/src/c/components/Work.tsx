import { useRef } from 'react'
import { m, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useLang } from '@shared/i18n'
import { photos, srcSetOf } from '@shared/media'
import type { MediaKey } from '@shared/content/en'
import { titleLines } from './QuoteParts'
import { Kicker, MaskLines, Rise } from './ui'

function BigPhoto({ media, caption, index, total, className }: { media: MediaKey; caption: string; index: number; total: number; className: string }) {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-7%', '7%'])
  const ph = photos[media]
  return (
    <figure ref={ref} className={`wbig ${className}`}>
      <div className="wbig-frame">
        <m.img
          style={{ y }}
          src={ph.src}
          srcSet={srcSetOf(ph)}
          sizes="(min-width: 900px) 60vw, 100vw"
          alt={ph.alt}
          width={ph.w}
          height={ph.h}
          loading="lazy"
          decoding="async"
        />
        <m.div
          className="wbig-wipe"
          aria-hidden="true"
          initial={{ scaleY: 1 }}
          whileInView={{ scaleY: 0 }}
          viewport={{ once: true, margin: '0px 0px -15% 0px' }}
          transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
        />
      </div>
      <figcaption>
        <span className="wnum">
          {String(index + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}
        </span>
        {caption}
      </figcaption>
    </figure>
  )
}

export function Work() {
  const { t } = useLang()
  const w = t.work
  const big = w.items.filter((it) => photos[it.media].hiRes)
  const small = w.items.filter((it) => !photos[it.media].hiRes)
  const total = w.items.length

  return (
    <section id="work" className="work" aria-labelledby="work-title">
      <div className="wrap">
        <header className="sec-head">
          <div>
            <Kicker className="on-dark">{w.kicker}</Kicker>
            <h2 id="work-title" className="sec-title d-cond">
              <MaskLines lines={titleLines(w.title)} />
            </h2>
          </div>
          <Rise className="sec-intro on-dark">
            <p>{w.body}</p>
          </Rise>
        </header>

        <div className="wbigs">
          {big.map((it, i) => (
            <BigPhoto key={it.media} media={it.media} caption={it.caption} index={i} total={total} className={`wbig-${i}`} />
          ))}
        </div>

        <ul className="wtiles">
          {small.map((it, i) => {
            const ph = photos[it.media]
            return (
              <m.li
                key={it.media}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -5% 0px' }}
                transition={{ duration: 0.7, delay: (i % 6) * 0.06, ease: [0.2, 0.8, 0.2, 1] }}
              >
                <figure>
                  <div className="wtile-frame">
                    <img src={ph.src} alt={ph.alt} width={ph.w} height={ph.h} loading="lazy" decoding="async" />
                  </div>
                  <figcaption>
                    <span className="wnum">
                      {String(big.length + i + 1).padStart(2, '0')}
                    </span>
                    {it.caption}
                  </figcaption>
                </figure>
              </m.li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
