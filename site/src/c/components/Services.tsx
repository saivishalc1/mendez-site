import { useRef, useState, type PointerEvent } from 'react'
import { m, useMotionValue, useSpring, useTransform, useVelocity } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { useLang } from '@shared/i18n'
import { photos } from '@shared/media'
import { openQuote } from '@shared/useQuote'
import { titleLines } from './QuoteParts'
import { Kicker, MaskLines, Rise } from './ui'

export function Services() {
  const { t } = useLang()
  const s = t.services
  const listRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<number | null>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 260, damping: 28, mass: 0.6 })
  const y = useSpring(my, { stiffness: 260, damping: 28, mass: 0.6 })
  const vx = useVelocity(x)
  const rotate = useTransform(vx, [-1600, 1600], [-9, 9], { clamp: true })

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = listRef.current?.getBoundingClientRect()
    if (!r) return
    mx.set(e.clientX - r.left)
    my.set(e.clientY - r.top)
  }

  return (
    <section id="services" className="services light" aria-labelledby="services-title">
      <div className="wrap">
        <header className="sec-head">
          <div>
            <Kicker>{s.kicker}</Kicker>
            <h2 id="services-title" className="sec-title d-cond">
              <MaskLines lines={titleLines(s.title)} />
            </h2>
          </div>
          <Rise className="sec-intro">
            <p>{s.intro}</p>
          </Rise>
        </header>

        <div ref={listRef} className="svc-list" onPointerMove={onMove} onPointerLeave={() => setActive(null)}>
          {s.items.map((item, i) => {
            const ph = photos[item.media]
            return (
              <m.article
                key={item.id}
                className={`svc ${active === i ? 'is-active' : ''}`}
                onPointerEnter={(e) => {
                  if (e.pointerType === 'mouse') setActive(i)
                }}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -6% 0px' }}
                transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
              >
                <span className="svc-n">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="svc-name d-cond">
                  <span>{item.name}</span>
                </h3>
                <img className="svc-thumb" src={ph.src} alt={ph.alt} width={ph.w} height={ph.h} loading="lazy" decoding="async" />
                <div className="svc-body">
                  <p>{item.blurb}</p>
                  <ul className="svc-inc">
                    {item.includes.map((inc) => (
                      <li key={inc}>{inc}</li>
                    ))}
                  </ul>
                </div>
                <button type="button" className="svc-cta" onClick={() => openQuote(item.id)}>
                  {s.cta}
                  <ArrowUpRight size={18} strokeWidth={2.5} aria-hidden="true" />
                </button>
              </m.article>
            )
          })}

          <m.div className="svc-preview" aria-hidden="true" style={{ x, y, rotate }} data-show={active !== null}>
            <div className="svc-pv-in">
              {s.items.map((item, i) => (
                <img key={item.id} src={photos[item.media].src} alt="" width={280} height={280} loading="lazy" decoding="async" className={active === i ? 'on' : ''} />
              ))}
            </div>
          </m.div>
        </div>
      </div>
    </section>
  )
}
