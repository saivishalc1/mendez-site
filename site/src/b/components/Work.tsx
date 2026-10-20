import { useRef } from 'react'
import { m, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useLang } from '@shared/i18n'
import { photos } from '@shared/media'
import { Label, Reveal, Title, srcSet } from './ui'

function Big({
  k,
  caption,
  n,
  className = '',
  frame,
  position = '50% 50%',
}: {
  k: keyof typeof photos
  caption: string
  n: string
  className?: string
  frame: string
  position?: string
}) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-6%', '6%'])
  const p = photos[k]
  return (
    <figure ref={ref} className={className}>
      <m.div
        className={`relative overflow-hidden rounded-[2px] bg-paper-2 ${frame}`}
        initial={reduce ? false : { clipPath: 'inset(0% 0% 100% 0%)' }}
        whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
        viewport={{ once: true, margin: '0px 0px -15% 0px' }}
        transition={{ duration: 1.4, ease: [0.7, 0, 0.2, 1] }}
      >
        <m.img
          src={p.src}
          srcSet={srcSet(p)}
          sizes={k === 'streetTruck' ? '(min-width: 1024px) 62vw, 100vw' : '(min-width: 1024px) 30vw, 100vw'}
          width={p.w}
          height={p.h}
          alt={p.alt}
          loading="lazy"
          decoding="async"
          style={{ y, objectPosition: position }}
          className="grade absolute inset-[-7%_0] h-[114%] w-full object-cover"
        />
      </m.div>
      <figcaption className="mt-3.5 flex items-baseline gap-4 text-[12px] tracking-[0.04em] text-stone">
        <span className="tabular-nums">{n}</span>
        <span className="font-medium text-ink">{caption}</span>
      </figcaption>
    </figure>
  )
}

export function Work() {
  const { t } = useLang()
  const w = t.work
  const [street, snow, ...small] = w.items

  return (
    <section id="work" aria-labelledby="work-title" className="relative border-t border-rule">
      <div className="mx-auto max-w-[1440px] px-5 pt-24 pb-28 sm:px-8 lg:px-16 lg:pt-32 lg:pb-40">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end lg:gap-14">
          <div className="lg:col-span-7">
            <Label>{w.kicker}</Label>
            <Reveal>
              <Title id="work-title" text={w.title} className="mt-6 text-[3rem] sm:text-[4rem] lg:text-[clamp(4rem,5.6vw,5.8rem)]" />
            </Reveal>
          </div>
          <Reveal delay={0.1} className="lg:col-span-4 lg:col-start-9 lg:pb-3">
            <p className="max-w-[26rem] text-[16px] leading-[1.6] text-body">{w.body}</p>
          </Reveal>
        </div>

        {/* Two hi-res photos, magazine spread */}
        <div className="mt-14 grid grid-cols-1 gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-14">
          <Big k={street.media} caption={street.caption} n="01" className="lg:col-span-8" frame="aspect-[4/3]" position="50% 45%" />
          <Big
            k={snow.media}
            caption={snow.caption}
            n="02"
            className="lg:col-span-4 lg:mt-48"
            frame="aspect-[4/5]"
            position="72% 60%"
          />
        </div>

        {/* Small originals: kept small on purpose */}
        <ul className="mt-20 grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 lg:mt-28 lg:grid-cols-6 lg:gap-x-6">
          {small.map((item, i) => {
            const p = photos[item.media]
            return (
              <Reveal as="li" key={item.media} delay={(i % 6) * 0.06} y={18}>
                <figure>
                  <div className="aspect-square overflow-hidden rounded-[2px] bg-paper-2">
                    <img
                      src={p.src}
                      width={p.w}
                      height={p.h}
                      alt={p.alt}
                      loading="lazy"
                      decoding="async"
                      className="grade size-full object-cover transition-transform duration-[1.2s] ease-calm hover:scale-[1.04]"
                    />
                  </div>
                  <figcaption className="mt-3 flex gap-2.5 text-[12px] leading-[1.45] text-stone">
                    <span className="tabular-nums">0{i + 3}</span>
                    <span className="text-ink">{item.caption}</span>
                  </figcaption>
                </figure>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
