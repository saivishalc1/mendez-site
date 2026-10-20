import { useEffect, useState, type MouseEvent } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { useLenis } from 'lenis/react'
import { Menu, Phone, X } from 'lucide-react'
import { useLang } from '@shared/i18n'
import { business } from '@shared/business'
import { openQuote } from '@shared/useQuote'
import { ease } from './ui'

function LangToggle({ className = '' }: { className?: string }) {
  const { lang, toggle, t } = useLang()
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t.nav.language}
      className={`inline-flex min-h-11 items-center gap-1.5 px-1 text-[12px] tracking-[0.16em] text-stone transition-colors hover:text-ink ${className}`}
    >
      <span className={lang === 'en' ? 'font-semibold text-ink' : ''}>EN</span>
      <span aria-hidden>·</span>
      <span className={lang === 'es' ? 'font-semibold text-ink' : ''}>ES</span>
    </button>
  )
}

export function Nav() {
  const { t } = useLang()
  const [compact, setCompact] = useState(false)
  const [open, setOpen] = useState(false)
  const lenis = useLenis()

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (open) {
      lenis?.stop()
      document.documentElement.style.overflow = 'hidden'
    } else {
      lenis?.start()
      document.documentElement.style.overflow = ''
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, lenis])

  /** Close the menu first, then scroll (Lenis is paused while the menu is open). */
  const go = (e: MouseEvent, href: string) => {
    e.preventDefault()
    e.stopPropagation()
    setOpen(false)
    setTimeout(() => {
      const el = document.querySelector<HTMLElement>(href)
      if (!el) return
      if (lenis) lenis.scrollTo(el)
      else el.scrollIntoView({ behavior: 'smooth' })
    }, 80)
  }

  const links = [
    { href: '#services', label: t.nav.services },
    { href: '#work', label: t.nav.work },
    { href: '#process', label: t.nav.process },
    { href: '#areas', label: t.nav.areas },
    { href: '#faq', label: t.nav.faq },
  ]

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b bg-paper transition-[padding,border-color] duration-500 ease-calm ${
          compact ? 'border-rule py-2.5 lg:py-3' : 'border-rule/70 py-3.5 lg:py-6'
        }`}
      >
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-5 sm:px-8 lg:px-16">
          <a href="#top" className="group flex min-h-11 items-baseline gap-3.5" aria-label={business.name}>
            <span className="font-serif text-[26px] leading-none tracking-[-0.01em] lg:text-[30px]">{business.short}</span>
            <span className="hidden text-[11px] tracking-[0.24em] text-stone uppercase sm:inline">
              {business.city}, {business.region}
            </span>
          </a>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-7 xl:gap-9">
              {links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="relative inline-flex min-h-11 items-center text-[13px] text-body transition-colors hover:text-ink">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2 sm:gap-4 lg:gap-5">
            <span className="max-[359px]:hidden">
              <LangToggle />
            </span>
            <a
              href={`tel:${business.phoneE164}`}
              className="hidden min-h-11 items-center rounded-full border border-ink px-5 text-[13px] font-medium transition-colors duration-300 hover:bg-ink hover:text-paper md:inline-flex"
            >
              {business.phoneDash}
            </a>
            <a
              href={`tel:${business.phoneE164}`}
              aria-label={`${t.nav.call} ${business.phoneDisplay}`}
              className="inline-flex size-11 items-center justify-center rounded-full border border-ink md:hidden"
            >
              <Phone size={16} strokeWidth={1.5} />
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="b-menu"
              className="inline-flex size-11 items-center justify-center rounded-full bg-ink text-paper lg:hidden"
            >
              <Menu size={18} strokeWidth={1.5} />
              <span className="sr-only">{t.nav.menu}</span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <m.div
            id="b-menu"
            role="dialog"
            aria-modal="true"
            aria-label={t.nav.menu}
            className="fixed inset-0 z-[80] flex flex-col overflow-y-auto bg-paper px-5 pt-3.5 pb-24 sm:px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            transition={{ duration: 0.4, ease }}
          >
            <div className="flex items-center justify-between">
              <span className="font-serif text-[26px] leading-none">{business.short}</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex size-11 items-center justify-center rounded-full border border-ink"
                autoFocus
              >
                <X size={18} strokeWidth={1.5} />
                <span className="sr-only">{t.nav.close}</span>
              </button>
            </div>
            <nav aria-label="Mobile" className="mt-10 flex-1">
              <ul className="border-t border-rule">
                {links.map((l, i) => (
                  <m.li
                    key={l.href}
                    className="border-b border-rule"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease, delay: 0.08 + i * 0.05 }}
                  >
                    <a href={l.href} onClick={(e) => go(e, l.href)} className="flex items-baseline gap-4 py-3.5">
                      <span className="w-6 text-[11px] tracking-[0.2em] text-stone">0{i + 1}</span>
                      <span className="font-serif text-[42px] leading-none tracking-[-0.02em]">{l.label}</span>
                    </a>
                  </m.li>
                ))}
              </ul>
            </nav>
            <m.div
              className="flex flex-col gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              <button
                type="button"
                className="btn-ink w-full"
                onClick={() => {
                  setOpen(false)
                  setTimeout(() => openQuote(), 60)
                }}
              >
                {t.hero.primary}
              </button>
              <div className="flex items-center justify-between">
                <a href={`tel:${business.phoneE164}`} className="link-u">
                  {business.phoneDisplay}
                </a>
                <LangToggle />
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  )
}
