import { Fragment, useRef } from 'react'
import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from 'motion/react'
import { useLang } from '@shared/i18n'
import { videos } from '@shared/media'
import { LazyVideo, useNear } from './ui'

const wrap = (min: number, max: number, v: number) => {
  const r = max - min
  return ((((v - min) % r) + r) % r) + min
}

function Row({ items, dir, speed, outline, run }: { items: string[]; dir: 1 | -1; speed: number; outline?: boolean; run: boolean }) {
  const reduce = useReducedMotion()
  const base = useMotionValue(0)
  const { scrollY } = useScroll()
  const vel = useVelocity(scrollY)
  const smooth = useSpring(vel, { damping: 50, stiffness: 300 })
  const factor = useTransform(smooth, [-2000, 0, 2000], [-4, 0, 4], { clamp: false })
  const x = useTransform(base, (v) => `${wrap(-50, 0, v)}%`)
  const d = useRef<number>(dir)

  useAnimationFrame((_, delta) => {
    if (!run || reduce) return
    const f = factor.get()
    if (f < 0) d.current = (-dir) as 1 | -1
    else if (f > 0) d.current = dir
    let move = d.current * speed * (delta / 1000)
    move += move * Math.abs(f)
    base.set(base.get() + move)
  })

  const seq = (k: number) => (
    <Fragment key={k}>
      {items.map((w, i) => (
        <span key={`${k}-${i}`} className="mq-item">
          {w}
          <i aria-hidden="true" />
        </span>
      ))}
    </Fragment>
  )

  return (
    <div className={`mq-row ${outline ? 'mq-outline' : ''}`}>
      <motion.div className="mq-track" style={{ x }}>
        {[0, 1, 2, 3].map(seq)}
      </motion.div>
    </div>
  )
}

export function VideoBand() {
  const { t } = useLang()
  const ref = useRef<HTMLElement>(null)
  const run = useNear(ref, '0px')
  const names = t.services.items.map((s) => s.name)
  const takes = t.takes.yes.slice(0, 6)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const vy = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <section ref={ref} className="vband" aria-label={t.footer.tagline}>
      <motion.div className="vband-media" style={{ y: vy }}>
        <LazyVideo src={videos.dump.src} poster={videos.dump.poster} className="vband-video" />
      </motion.div>
      <div className="vband-shade" aria-hidden="true" />
      <div className="vband-text d-cond" aria-hidden="true">
        <Row items={names} dir={-1} speed={3.2} run={run} />
        <Row items={takes} dir={1} speed={2.4} outline run={run} />
      </div>
      <ul className="sr-only">
        {names.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>
    </section>
  )
}
