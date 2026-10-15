import { useEffect, useState } from 'react'
import { MessageSquare, Phone } from 'lucide-react'
import { useLang } from '@shared/i18n'
import { business } from '@shared/business'
import { openQuote } from '@shared/useQuote'

/**
 * Sticky phone bar (Call · Text · Free quote). Appears after the hero, hides
 * while the quote form or contact block is on screen. The empty left slot keeps
 * clear of the review-stage direction switch.
 */
export function MobileBar() {
  const { t } = useLang()
  const [show, setShow] = useState(false)

  useEffect(() => {
    const visible = new Set<string>()
    let past = false
    const update = () => setShow(past && visible.size === 0)
    const onScroll = () => {
      past = window.scrollY > window.innerHeight * 0.85
      update()
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? visible.add(e.target.id) : visible.delete(e.target.id)))
        update()
      },
      { threshold: 0.12 },
    )
    ;['quote', 'contact'].forEach((id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <div
      inert={!show}
      className="surface-dark fixed inset-x-0 bottom-0 z-[70] bg-ink pb-[env(safe-area-inset-bottom)] transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] md:hidden"
      style={{ transform: show ? 'translateY(0)' : 'translateY(110%)' }}
    >
      <div className="hazard h-[5px]" aria-hidden />
      <div className="flex h-[66px] items-center gap-2 pr-3 pl-[132px]">
        <a href={`tel:${business.phoneE164}`} className="flex h-12 w-12 flex-none flex-col items-center justify-center rounded-[2px] border border-line text-bone" aria-label={`${t.nav.call} ${business.phoneDisplay}`}>
          <Phone size={18} className="text-vis" aria-hidden />
          <span className="mt-0.5 text-[10px] font-semibold">{t.nav.call}</span>
        </a>
        <a href={`sms:${business.phoneE164}`} className="flex h-12 w-12 flex-none flex-col items-center justify-center rounded-[2px] border border-line text-bone">
          <MessageSquare size={18} className="text-vis" aria-hidden />
          <span className="mt-0.5 text-[10px] font-semibold">{t.nav.text}</span>
        </a>
        <button type="button" onClick={() => openQuote()} className="btn btn-vis h-12 min-h-12 flex-1 px-3 text-[15px]">
          {t.nav.quote}
        </button>
      </div>
    </div>
  )
}
