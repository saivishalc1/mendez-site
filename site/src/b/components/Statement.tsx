import { useMemo, useRef } from 'react'
import { m, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useLang } from '@shared/i18n'
import { Label } from './ui'

type Word = { text: string; accent: boolean }

function splitWords(text: string): Word[] {
  const out: Word[] = []
  text.split(/(\*[^*]+\*)/g).forEach((part) => {
    if (!part) return
    const accent = part.startsWith('*') && part.endsWith('*')
    const body = accent ? part.slice(1, -1) : part
    body
      .split(/\s+/)
      .filter(Boolean)
      .forEach((w) => out.push({ text: w, accent }))
  })
  return out
}

function W({ word, i, n, progress }: { word: Word; i: number; n: number; progress: MotionValue<number> }) {
  const start = i / n
  const opacity = useTransform(progress, [start, Math.min(1, start + 1.6 / n)], [0.16, 1])
  return (
    <m.span style={{ opacity }} className={word.accent ? 'accent' : undefined}>
      {word.text}{' '}
    </m.span>
  )
}

export function Statement() {
  const { t } = useLang()
  const reduce = useReducedMotion()
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.82', 'end 0.5'] })
  const words = useMemo(() => splitWords(t.statement.text), [t.statement.text])

  return (
    <section aria-labelledby="statement-kicker" className="relative">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-8 px-5 pt-28 pb-20 sm:px-8 lg:grid-cols-12 lg:gap-14 lg:px-16 lg:pt-44 lg:pb-28">
        <div className="lg:col-span-3 lg:pt-4">
          <Label>
            <span id="statement-kicker">{t.statement.kicker}</span>
          </Label>
        </div>
        <p
          ref={ref}
          className="display text-[2.15rem] leading-[1.08] tracking-[-0.02em] sm:text-[2.8rem] lg:col-span-9 lg:text-[clamp(3rem,4.4vw,4.4rem)] lg:leading-[1.06]"
        >
          {reduce
            ? words.map((w, i) => (
                <span key={i} className={w.accent ? 'accent' : undefined}>
                  {w.text}{' '}
                </span>
              ))
            : words.map((w, i) => <W key={`${i}-${w.text}`} word={w} i={i} n={words.length} progress={scrollYProgress} />)}
        </p>
      </div>
    </section>
  )
}
