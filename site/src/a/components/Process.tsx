import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { ArrowRight, Camera, Receipt, Truck } from 'lucide-react'
import { useLang } from '@shared/i18n'
import { openQuote } from '@shared/useQuote'
import { Hazard, Kicker, Reveal, Title } from './ui'

const ICONS = [Camera, Receipt, Truck]
const SKINS = [
  { card: 'bg-ink text-bone', num: 'text-vis', body: 'text-[#c9c7bf]', icon: 'border-line text-vis' },
  { card: 'bg-vis text-ink', num: 'text-ink', body: 'text-ink/80', icon: 'border-ink/25 text-ink' },
  { card: 'bg-coal text-bone', num: 'text-vis', body: 'text-[#c9c7bf]', icon: 'border-line text-vis' },
]

function Card({ i, n, progress, step }: { i: number; n: number; progress: MotionValue<number>; step: { n: string; title: string; body: string } }) {
  const reduce = useReducedMotion()
  const scale = useTransform(progress, [i / n, 1], [1, 1 - (n - 1 - i) * 0.045])
  const skin = SKINS[i % SKINS.length]
  const Icon = ICONS[i % ICONS.length]
  return (
    <li className="sticky mb-[12vh] last:mb-0" style={{ top: `calc(var(--stack-top) + ${i * 26}px)` }}>
      <motion.article
        style={reduce ? undefined : { scale }}
        className={`relative flex min-h-[380px] origin-top flex-col justify-between overflow-hidden rounded-[3px] p-6 shadow-[0_-20px_50px_rgba(11,11,10,.18)] md:min-h-[460px] md:p-10 ${skin.card}`}
      >
        <div className="flex items-start justify-between gap-6">
          <span className={`display text-[clamp(120px,16vw,230px)] leading-[0.78] ${skin.num}`}>{step.n}</span>
          <span className={`grid h-14 w-14 place-items-center rounded-full border-[1.5px] md:h-16 md:w-16 ${skin.icon}`} aria-hidden>
            <Icon size={24} strokeWidth={2} />
          </span>
        </div>
        <div className="mt-10">
          <h3 className="display text-[clamp(44px,5vw,76px)]">{step.title}</h3>
          <p className={`mt-4 max-w-[34ch] text-[17px] leading-[1.6] md:text-[19px] ${skin.body}`}>{step.body}</p>
        </div>
        {i === n - 1 && <Hazard className="absolute inset-x-0 bottom-0" />}
      </motion.article>
    </li>
  )
}

export function Process() {
  const { t } = useLang()
  const ref = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const steps = t.process.steps

  return (
    <section id="process" aria-labelledby="process-title" className="surface-light bg-bone py-20 text-ink [--stack-top:84px] md:py-32 md:[--stack-top:120px]">
      <div className="wrap md:grid md:grid-cols-12 md:gap-10">
        <div className="md:col-span-5">
          <Reveal className="md:sticky md:top-[120px]">
            <Kicker tone="light">{t.process.kicker}</Kicker>
            <Title id="process-title" tone="light" text={t.process.title} className="h2 mt-6 max-w-[9ch] md:text-[clamp(56px,7vw,112px)]" />
            <button type="button" onClick={() => openQuote()} className="btn btn-ink mt-10 hidden md:inline-flex">
              {t.hero.primary} <ArrowRight className="arrow" size={18} strokeWidth={2.4} aria-hidden />
            </button>
          </Reveal>
        </div>
        <ol ref={ref} className="mt-12 md:col-span-7 md:mt-0">
          {steps.map((s, i) => (
            <Card key={s.n} i={i} n={steps.length} progress={scrollYProgress} step={s} />
          ))}
        </ol>
      </div>
    </section>
  )
}
