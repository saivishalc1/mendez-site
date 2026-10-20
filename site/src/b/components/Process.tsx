import { useRef } from 'react'
import { m, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useLang } from '@shared/i18n'
import { openQuote } from '@shared/useQuote'
import { Label, Reveal, Title } from './ui'

type Step = { n: string; title: string; body: string }

function Card({ step, i, n, progress }: { step: Step; i: number; n: number; progress: MotionValue<number> }) {
  const reduce = useReducedMotion()
  // Each card shrinks a touch as the following cards slide over it.
  const scale = useTransform(progress, [i / n, 1], reduce ? [1, 1] : [1, 1 - (n - 1 - i) * 0.035])
  return (
    <li className="sticky" style={{ top: `calc(96px + ${i * 22}px)` }}>
      <m.article
        style={{ scale, transformOrigin: '50% 0%' }}
        className="relative mb-6 grid min-h-[22rem] grid-cols-1 gap-6 rounded-[3px] border border-rule bg-paper-2 p-7 shadow-[0_-18px_40px_-28px_rgba(23,22,20,.35)] sm:p-10 lg:mb-10 lg:min-h-[26rem] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-10 lg:p-14"
      >
        <div className="flex items-start justify-between lg:block">
          <span className="display block text-[7.5rem] leading-[0.8] tracking-[-0.04em] text-ink sm:text-[9rem] lg:text-[12rem]">{step.n}</span>
          <span className="text-[11px] tracking-[0.24em] text-stone uppercase lg:mt-8 lg:block">
            {step.n} / 0{n}
          </span>
        </div>
        <div className="flex flex-col justify-end lg:pb-2">
          <div className="mb-6 h-px w-full bg-rule" />
          <h3 className="display text-[2.4rem] leading-[1] tracking-[-0.02em] sm:text-[3rem] lg:text-[3.4rem]">{step.title}</h3>
          <p className="mt-4 max-w-[28rem] text-[16px] leading-[1.6] text-body lg:text-[17px]">{step.body}</p>
        </div>
      </m.article>
    </li>
  )
}

export function Process() {
  const { t } = useLang()
  const p = t.process
  const ref = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 96px', 'end end'] })

  return (
    <section id="process" aria-labelledby="process-title" className="relative bg-paper">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-12 px-5 pt-28 pb-16 sm:px-8 lg:grid-cols-12 lg:gap-14 lg:px-16 lg:pt-40 lg:pb-24">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[120px]">
            <Label>{p.kicker}</Label>
            <Reveal>
              <Title id="process-title" text={p.title} className="mt-6 text-[3rem] sm:text-[4rem] lg:text-[clamp(4rem,5.4vw,5.6rem)]" />
            </Reveal>
            <Reveal delay={0.1}>
              <button type="button" onClick={() => openQuote()} className="btn-ink mt-10 hidden lg:inline-flex">
                {t.hero.primary}
              </button>
            </Reveal>
          </div>
        </div>
        <ol ref={ref} className="relative lg:col-span-7">
          {p.steps.map((s, i) => (
            <Card key={s.n} step={s} i={i} n={p.steps.length} progress={scrollYProgress} />
          ))}
        </ol>
      </div>
    </section>
  )
}
