import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useLang } from '@shared/i18n'
import { business } from '@shared/business'
import { openQuote } from '@shared/useQuote'
import { ease } from './ui'

/**
 * Phone-only sticky bar (Call · Text · Free quote). Appears after the hero,
 * steps aside while the quote form or contact block is on screen. Starts at
 * left:128px so it never covers the review-stage A/B/C switch.
 */
export function MobileBar() {
  const { t } = useLang()
  const [pastHero, setPastHero] = useState(false)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const hero = document.getElementById('top')
    const quote = document.getElementById('quote')
    const contact = document.getElementById('contact')
    const inView = new Set<Element>()
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.target === hero) setPastHero(!e.isIntersecting)
          else if (e.isIntersecting) inView.add(e.target)
          else inView.delete(e.target)
        })
        setHidden(inView.size > 0)
      },
      { rootMargin: '0px 0px -30% 0px' },
    )
    ;[hero, quote, contact].forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [])

  const show = pastHero && !hidden

  return (
    <AnimatePresence>
      {show && (
        <motion.nav
          aria-label={t.hero.primaryShort}
          className="fixed right-2.5 bottom-3 left-[128px] z-[60] flex h-14 items-stretch gap-1 rounded-full bg-ink p-1 text-paper shadow-[0_14px_34px_-12px_rgba(23,22,20,.6)] md:hidden"
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ duration: 0.55, ease }}
          style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
        >
          <a
            href={`tel:${business.phoneE164}`}
            className="flex flex-1 items-center justify-center rounded-full text-[13px] font-medium whitespace-nowrap"
            aria-label={`${t.nav.call} ${business.phoneDisplay}`}
          >
            {t.nav.call}
          </a>
          <a
            href={`sms:${business.phoneE164}`}
            className="flex flex-1 items-center justify-center rounded-full text-[13px] font-medium whitespace-nowrap"
          >
            {t.nav.text}
          </a>
          <button
            type="button"
            onClick={() => openQuote()}
            className="flex flex-[1.5] items-center justify-center rounded-full bg-paper px-3 text-[13px] font-semibold text-ink"
          >
            {t.hero.primaryShort}
          </button>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}
