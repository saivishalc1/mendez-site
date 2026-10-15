import { useMemo, useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useLang } from '@shared/i18n'
import { Kicker, Reveal } from './ui'

type Token = { text: string; accent: boolean }

function tokenize(text: string): Token[] {
  return text
    .split(/(\*[^*]+\*)/g)
    .filter(Boolean)
    .flatMap((part) => {
      const accent = part.startsWith('*') && part.endsWith('*')
      return (accent ? part.slice(1, -1) : part)
        .split(/\s+/)
        .filter(Boolean)
        .map((w) => ({ text: w, accent }))
    })
}

function Word({ token, progress, i, n }: { token: Token; progress: MotionValue<number>; i: number; n: number }) {
  const start = i / n
  const opacity = useTransform(progress, [start - 0.015, start + 1.6 / n], [0.14, 1])
  return (
    <>
      <motion.span style={{ opacity }} className={token.accent ? 'text-vis' : undefined}>
        {token.text}
      </motion.span>{' '}
    </>
  )
}

export function Statement() {
  const { t } = useLang()
  const reduce = useReducedMotion()
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.82', 'end 0.52'] })
  const tokens = useMemo(() => tokenize(t.statement.text), [t])

  return (
    <section aria-label={t.statement.kicker} className="surface-dark relative bg-ink py-[clamp(96px,16vh,180px)] text-bone">
      <div className="wrap grid gap-8 md:grid-cols-12">
        <div className="md:col-span-3">
          <Kicker>{t.statement.kicker}</Kicker>
        </div>
        <div className="md:col-span-9">
          <p ref={ref} className="statement max-w-[22ch] md:max-w-none">
            {reduce
              ? tokens.map((tok, i) => (
                  <span key={i} className={tok.accent ? 'text-vis' : undefined}>
                    {tok.text}{' '}
                  </span>
                ))
              : tokens.map((tok, i) => <Word key={`${t.statement.kicker}-${i}`} token={tok} progress={scrollYProgress} i={i} n={tokens.length} />)}
          </p>
          <Reveal className="mt-14 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-line pt-7 md:mt-20">
            {t.hero.badges.map((b, i) => (
              <span key={b} className="label flex items-center gap-5 text-[11.5px] text-stone">
                {i > 0 && <i className="diamond text-vis" aria-hidden />}
                <span className="text-bone">{b}</span>
              </span>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
