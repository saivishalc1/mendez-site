import { useMemo, useRef } from 'react'
import { m, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useLang } from '@shared/i18n'
import { Kicker } from './ui'

type Word = { w: string; accent: boolean }

function words(text: string): Word[] {
  return text
    .split(/(\*[^*]+\*)/g)
    .filter(Boolean)
    .flatMap((part) => {
      const accent = part.startsWith('*') && part.endsWith('*')
      return part
        .replace(/\*/g, '')
        .split(/\s+/)
        .filter(Boolean)
        .map((w) => ({ w, accent }))
    })
}

function LitWord({ word, i, n, p }: { word: Word; i: number; n: number; p: MotionValue<number> }) {
  const start = i / n
  const opacity = useTransform(p, [start, Math.min(1, start + 1.6 / n)], [0.13, 1])
  return (
    <m.span className={word.accent ? 'acc' : undefined} style={{ opacity }}>
      {word.w}{' '}
    </m.span>
  )
}

export function Statement() {
  const { t } = useLang()
  const ref = useRef<HTMLParagraphElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.5'] })
  const list = useMemo(() => words(t.statement.text), [t.statement.text])

  return (
    <section className="statement" aria-labelledby="statement-k">
      <div className="wrap">
        <Kicker className="on-dark">
          <span id="statement-k">{t.statement.kicker}</span>
        </Kicker>
        <p ref={ref} className="statement-text d-cond">
          {reduce
            ? list.map((w, i) => (
                <span key={i} className={w.accent ? 'acc' : undefined}>
                  {w.w}{' '}
                </span>
              ))
            : list.map((w, i) => <LitWord key={`${i}-${w.w}`} word={w} i={i} n={list.length} p={scrollYProgress} />)}
        </p>
      </div>
    </section>
  )
}
