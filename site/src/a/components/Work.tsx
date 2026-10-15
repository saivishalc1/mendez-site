import { useLang } from '@shared/i18n'
import { photos } from '@shared/media'
import type { MediaKey } from '@shared/content/en'
import { Kicker, Reveal, Title } from './ui'

function BigShot({ media, caption, index, total, className = '' }: { media: MediaKey; caption: string; index: number; total: number; className?: string }) {
  const ph = photos[media]
  return (
    <Reveal as="figure" className={`group relative overflow-hidden rounded-[2px] bg-coal ${className}`}>
      <img
        src={ph.src}
        srcSet={ph.sm ? `${ph.sm} 900w, ${ph.src} 1920w` : undefined}
        sizes="(min-width: 768px) 60vw, 100vw"
        width={ph.w}
        height={ph.h}
        alt={ph.alt}
        loading="lazy"
        className="bw-hover h-full w-full object-cover group-hover:scale-[1.03]"
      />
      <span className="label absolute top-4 left-4 text-[10.5px] text-bone/80">
        {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </span>
      <figcaption className="absolute bottom-0 left-0 max-w-[85%] bg-vis px-4 py-3 text-[12px] font-bold tracking-[0.16em] text-ink uppercase md:px-5 md:text-[13px]">
        {caption}
      </figcaption>
    </Reveal>
  )
}

export function Work() {
  const { t } = useLang()
  const items = t.work.items
  const big = items.filter((it) => photos[it.media].hiRes)
  const small = items.filter((it) => !photos[it.media].hiRes)
  const indexOf = (m: MediaKey) => items.findIndex((it) => it.media === m)

  return (
    <section id="work" aria-labelledby="work-title" className="surface-dark bg-ink py-20 text-bone md:py-32">
      <div className="wrap grid gap-4 md:grid-cols-12 md:gap-5">
        <Reveal as="header" className="flex flex-col justify-between gap-8 pb-8 md:col-span-4 md:pr-6 md:pb-0">
          <div>
            <Kicker>{t.work.kicker}</Kicker>
            <Title id="work-title" text={t.work.title} className="mt-6 text-[clamp(56px,7.4vw,118px)]" />
          </div>
          <p className="max-w-[24rem] text-[17px] leading-[1.6] text-[#c9c7bf]">{t.work.body}</p>
        </Reveal>

        {big[0] && (
          <BigShot media={big[0].media} caption={big[0].caption} index={indexOf(big[0].media)} total={items.length} className="aspect-[4/3] md:col-span-8" />
        )}
        {big[1] && (
          <BigShot media={big[1].media} caption={big[1].caption} index={indexOf(big[1].media)} total={items.length} className="aspect-[4/3] md:col-span-6 md:aspect-auto md:min-h-full" />
        )}

        <ul className="grid grid-cols-2 gap-x-3 gap-y-6 pt-4 sm:grid-cols-3 md:col-span-6 md:gap-x-5 md:pt-0">
          {small.map((it, i) => {
            const ph = photos[it.media]
            return (
              <Reveal as="li" key={it.media} delay={0.05 * i} className="group">
                <figure>
                  <div className="aspect-square max-w-[300px] overflow-hidden rounded-[2px] bg-coal">
                    <img src={ph.src} width={ph.w} height={ph.h} alt={ph.alt} loading="lazy" className="bw-hover h-full w-full object-cover group-hover:scale-[1.04]" />
                  </div>
                  <figcaption className="mt-3 flex gap-2 text-[13px] leading-[1.4] text-[#b9b7af]">
                    <span className="display text-[13px] text-vis">{String(indexOf(it.media) + 1).padStart(2, '0')}</span>
                    {it.caption}
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
