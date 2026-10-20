import { useEffect, useState } from 'react'
import { AnimatePresence, m, useMotionValueEvent, useScroll } from 'motion/react'
import { MessageSquare, Phone } from 'lucide-react'
import { useLang } from '@shared/i18n'
import { business } from '@shared/business'
import { openQuote } from '@shared/useQuote'

/** Call · Text · Free quote, pinned to the bottom on phones once the hero is gone. Hides over the form and footer. */
export function MobileBar() {
  const { t } = useLang()
  const { scrollY } = useScroll()
  const [past, setPast] = useState(false)
  const [covered, setCovered] = useState(false)
  useMotionValueEvent(scrollY, 'change', (y) => setPast(y > window.innerHeight * 0.9))

  useEffect(() => {
    const els = ['quote', 'contact'].map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    const seen = new Set<Element>()
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? seen.add(e.target) : seen.delete(e.target)))
        setCovered(seen.size > 0)
      },
      { rootMargin: '0px 0px -30% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  const show = past && !covered
  return (
    <AnimatePresence>
      {show && (
        <m.nav
          className="mbar"
          aria-label={t.hero.secondary}
          initial={{ y: 90 }}
          animate={{ y: 0 }}
          exit={{ y: 90 }}
          transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <a href={`tel:${business.phoneE164}`}>
            <Phone size={18} aria-hidden="true" />
            {t.nav.call}
          </a>
          <a href={`sms:${business.phoneE164}`}>
            <MessageSquare size={18} aria-hidden="true" />
            {t.nav.text}
          </a>
          <button type="button" className="mbar-quote" onClick={() => openQuote()}>
            {t.hero.primaryShort}
          </button>
        </m.nav>
      )}
    </AnimatePresence>
  )
}
