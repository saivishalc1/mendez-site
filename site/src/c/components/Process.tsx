import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useLang } from '@shared/i18n'
import { openQuote } from '@shared/useQuote'
import { titleLines } from './QuoteParts'
import { Kicker, MaskLines } from './ui'

type Step = { n: string; title: string; body: string }

function Card({ step, i, n, progress }: { step: Step; i: number; n: number; progress: MotionValue<number> }) {
  const reduce = useReducedMotion()
  const target = 1 - (n - 1 - i) * 0.05
  const scale = useTransform(progress, [i / n, 1], [1, reduce ? 1 : target])
  return (
    <div className="pcard-slot" style={{ ['--i' as string]: i }}>
      <motion.article className={`pcard pcard-${i}`} style={{ scale }}>
        <div className="pcard-tape tape" aria-hidden="true" />
        <span className="pcard-n d-cond" aria-hidden="true">
          {step.n}
        </span>
        <div className="pcard-copy">
          <h3 className="pcard-title d-cond">
            <span className="sr-only">{step.n}. </span>
            {step.title}
          </h3>
          <p>{step.body}</p>
        </div>
      </motion.article>
    </div>
  )
}

export function Process() {
  const { t } = useLang()
  const p = t.process
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  return (
    <section id="process" className="process" aria-labelledby="process-title">
      <div className="wrap process-grid">
        <div className="process-side">
          <Kicker className="on-dark">{p.kicker}</Kicker>
          <h2 id="process-title" className="sec-title d-cond">
            <MaskLines lines={titleLines(p.title)} />
          </h2>
          <button type="button" className="btn btn-red hide-sm" onClick={() => openQuote()}>
            {t.hero.primary}
          </button>
        </div>
        <div ref={ref} className="process-stack">
          {p.steps.map((s, i) => (
            <Card key={s.n} step={s} i={i} n={p.steps.length} progress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  )
}
