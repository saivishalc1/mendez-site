import { useId, useState } from 'react'
import { Plus } from 'lucide-react'
import { useLang } from '@shared/i18n'
import { Label, Reveal, Rule, Title } from './ui'

function FaqItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  const id = useId()
  return (
    <li className="border-b border-rule">
      <h3>
        <button
          type="button"
          id={`${id}-q`}
          aria-expanded={open}
          aria-controls={`${id}-a`}
          onClick={onToggle}
          className="group flex min-h-[72px] w-full items-center justify-between gap-6 py-5 text-left"
        >
          <span className="font-serif text-[24px] leading-[1.15] tracking-[-0.01em] transition-transform duration-500 ease-calm group-hover:translate-x-1.5 sm:text-[28px]">
            {q}
          </span>
          <span
            className={`inline-flex size-10 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ease-calm ${
              open ? 'rotate-45 border-ink bg-ink text-paper' : 'border-rule group-hover:border-ink'
            }`}
          >
            <Plus size={16} strokeWidth={1.5} aria-hidden />
          </span>
        </button>
      </h3>
      <div
        id={`${id}-a`}
        role="region"
        aria-labelledby={`${id}-q`}
        className={`grid transition-[grid-template-rows] duration-500 ease-calm ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden" inert={!open}>
          <p className="max-w-[36rem] pr-14 pb-7 text-[16px] leading-[1.65] text-body">{a}</p>
        </div>
      </div>
    </li>
  )
}

export function About() {
  const { t } = useLang()
  const ab = t.about
  const f = t.faq
  const [open, setOpen] = useState<number | null>(0)

  return (
    <>
      <section aria-labelledby="about-title" className="relative">
        <div className="mx-auto max-w-[1440px] px-5 pt-28 pb-20 sm:px-8 lg:px-16 lg:pt-40 lg:pb-28">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-3 lg:pt-4">
              <Label>{ab.kicker}</Label>
            </div>
            <div className="lg:col-span-9">
              <Reveal>
                <Title id="about-title" text={ab.title} className="max-w-[16ch] text-[3rem] sm:text-[4rem] lg:text-[clamp(4rem,5.6vw,5.8rem)]" />
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-9 max-w-[38rem] text-[17px] leading-[1.7] text-body lg:text-[19px]">{ab.body}</p>
              </Reveal>
            </div>
          </div>

          <div className="mt-16 lg:mt-24">
            <Rule className="!bg-ink" />
            <ul className="grid grid-cols-1 sm:grid-cols-3">
              {ab.facts.map((fact, i) => (
                <Reveal
                  as="li"
                  key={fact.k}
                  delay={i * 0.08}
                  y={14}
                  className={`border-b border-rule py-7 sm:border-b-0 sm:py-9 ${i > 0 ? 'sm:border-l sm:pl-8' : ''} sm:pr-6`}
                >
                  <p className="text-[11px] tracking-[0.2em] text-stone">0{i + 1}</p>
                  <p className="mt-3 font-serif text-[30px] leading-[1.05] tracking-[-0.01em] lg:text-[36px]">{fact.k}</p>
                  <p className="mt-2 text-[14px] text-stone">{fact.v}</p>
                </Reveal>
              ))}
            </ul>
            <Rule className="max-sm:hidden" />
          </div>
        </div>
      </section>

      <section id="faq" aria-labelledby="faq-title" className="relative">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 px-5 pt-12 pb-28 sm:px-8 lg:grid-cols-12 lg:gap-14 lg:px-16 lg:pt-20 lg:pb-40">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-[120px]">
              <Label>{f.kicker}</Label>
              <Reveal>
                <Title id="faq-title" text={f.title} className="mt-6 text-[3rem] sm:text-[4rem] lg:text-[clamp(4rem,5.4vw,5.6rem)]" />
              </Reveal>
            </div>
          </div>
          <ul className="border-t border-ink lg:col-span-8">
            {f.items.map((item, i) => (
              <FaqItem key={item.q} q={item.q} a={item.a} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
