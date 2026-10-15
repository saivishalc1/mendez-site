import { useId, useState } from 'react'
import { Plus } from 'lucide-react'
import { useLang } from '@shared/i18n'
import { photos } from '@shared/media'
import { Kicker, Reveal, Title } from './ui'

function Faq() {
  const { t } = useLang()
  const [open, setOpen] = useState<number | null>(0)
  const uid = useId()
  return (
    <div id="faq" className="grid gap-10 border-t-2 border-ink pt-14 md:grid-cols-12 md:pt-20">
      <Reveal className="md:col-span-4">
        <Kicker tone="light">{t.faq.kicker}</Kicker>
        <Title tone="light" text={t.faq.title} className="mt-6 text-[clamp(52px,6.4vw,100px)]" />
      </Reveal>
      <ul className="md:col-span-8">
        {t.faq.items.map((item, i) => {
          const isOpen = open === i
          const bid = `${uid}-b${i}`
          const pid = `${uid}-p${i}`
          return (
            <Reveal as="li" key={item.q} delay={0.03 * i} y={16} className="border-b border-ink/20 first:border-t">
              <h3>
                <button
                  id={bid}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={pid}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left md:py-6"
                >
                  <span className="text-[19px] leading-[1.35] font-semibold tracking-[-0.01em] md:text-[23px]">{item.q}</span>
                  <span className="acc-icon grid h-11 w-11 flex-none place-items-center rounded-full border-[1.5px] border-ink">
                    <Plus size={20} strokeWidth={2.4} aria-hidden />
                  </span>
                </button>
              </h3>
              <div id={pid} role="region" aria-labelledby={bid} className="acc-panel" data-open={isOpen}>
                <div>
                  <p className="max-w-[60ch] pr-14 pb-6 text-[17px] leading-[1.65] text-ink/75">{item.a}</p>
                </div>
              </div>
            </Reveal>
          )
        })}
      </ul>
    </div>
  )
}

export function AboutFaq() {
  const { t } = useLang()
  const a = t.about
  const crew = photos.crewTwo
  const crewCaption = t.work.items.find((w) => w.media === 'crewTwo')?.caption
  return (
    <section aria-labelledby="about-title" className="surface-light bg-bone py-20 text-ink md:py-32">
      <div className="wrap">
        <div className="grid gap-12 md:grid-cols-12 md:gap-10">
          <Reveal className="md:col-span-8">
            <Kicker tone="light">{a.kicker}</Kicker>
            <Title id="about-title" tone="light" text={a.title} className="mt-6 text-[clamp(52px,7vw,112px)] leading-[0.9]" />
            <p className="mt-8 max-w-[40rem] text-[18px] leading-[1.65] text-ink/80 md:text-[20px]">{a.body}</p>
          </Reveal>
          <Reveal delay={0.12} className="flex items-start justify-center md:col-span-4 md:justify-end md:pt-16">
            <figure className="relative w-[min(78vw,290px)] rotate-[3deg] bg-ink p-2.5 pb-4 shadow-[0_26px_60px_rgba(11,11,10,.25)]">
              <span className="absolute -top-3 left-1/2 z-10 h-7 w-24 -translate-x-1/2 -rotate-[4deg] bg-vis/90" aria-hidden />
              <img src={crew.src} width={crew.w} height={crew.h} alt={crew.alt} loading="lazy" className="bw aspect-square w-full object-cover" />
              {crewCaption && <figcaption className="display mt-3 px-1 text-[20px] text-bone">{crewCaption}</figcaption>}
            </figure>
          </Reveal>
        </div>

        <ul className="mt-16 mb-20 grid gap-px overflow-hidden rounded-[3px] bg-ink/15 sm:grid-cols-3 md:mt-24 md:mb-28">
          {a.facts.map((f, i) => (
            <Reveal as="li" key={f.k} delay={0.06 * i} className="bg-bone py-6 sm:px-6 sm:py-8 first:sm:pl-0">
              <span className="display block text-[15px] text-ink/45">0{i + 1}</span>
              <span className="display mt-3 block text-[clamp(32px,3.2vw,46px)]">{f.k}</span>
              <span className="mt-2 block text-[16px] text-ink/70">{f.v}</span>
            </Reveal>
          ))}
        </ul>

        <Faq />
      </div>
    </section>
  )
}
