import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useLenis } from 'lenis/react'
import { ArrowRight, Menu, Phone, X } from 'lucide-react'
import { useLang } from '@shared/i18n'
import { business } from '@shared/business'
import { openQuote } from '@shared/useQuote'
import { EASE } from './ui'

function LangToggle({ className = '' }: { className?: string }) {
  const { t, lang, toggle } = useLang()
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t.nav.language}
      className={`inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 px-2 text-[12px] font-semibold tracking-[0.14em] ${className}`}
    >
      <span className={lang === 'en' ? 'text-bone' : 'text-stone'}>EN</span>
      <span className="text-stone/60">/</span>
      <span className={lang === 'es' ? 'text-bone' : 'text-stone'}>ES</span>
    </button>
  )
}

export function Nav() {
  const { t } = useLang()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const lenis = useLenis()

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    if (open) {
      lenis?.stop()
      root.style.overflow = 'hidden'
    } else {
      lenis?.start()
      root.style.overflow = ''
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, lenis])

  const links = [
    { href: '#services', label: t.nav.services },
    { href: '#work', label: t.nav.work },
    { href: '#process', label: t.nav.process },
    { href: '#areas', label: t.nav.areas },
    { href: '#faq', label: t.nav.faq },
  ]
  const solid = scrolled || open

  return (
    <>
      <header
        className={`surface-dark fixed inset-x-0 top-0 z-[85] transition-[background-color,padding,border-color] duration-300 ${
          solid ? 'border-b border-line bg-ink py-2.5' : 'border-b border-transparent bg-transparent py-3 md:py-6'
        }`}
      >
        <div className="wrap flex items-center justify-between gap-4">
          <a href="#top" className="group flex min-h-11 flex-col justify-center" onClick={() => setOpen(false)}>
            <span className="display text-[22px] leading-none tracking-[0.02em] text-bone md:text-[26px]">MENDEZ-VASQUEZ</span>
            <span
              className={`hidden overflow-hidden text-[9.5px] font-semibold tracking-[0.24em] whitespace-nowrap text-vis uppercase transition-[max-height,opacity,margin] duration-300 sm:block ${
                solid ? 'mt-0 max-h-0 opacity-0' : 'mt-1.5 max-h-4 opacity-100'
              }`}
            >
              {t.footer.tagline}
            </span>
          </a>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-8 xl:gap-9">
              {links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="relative py-3 text-[13.5px] font-medium text-[#cfcdc5] transition-colors hover:text-vis">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-3">
            <LangToggle className="hidden sm:inline-flex" />
            <button
              type="button"
              onClick={() => openQuote()}
              className={`btn btn-ghost hidden min-h-11 px-4 text-[14px] ${scrolled ? 'xl:inline-flex' : ''}`}
            >
              {t.nav.quote}
            </button>
            <a href={`tel:${business.phoneE164}`} className="btn btn-vis min-h-11 px-3 text-[14px] sm:px-5" aria-label={`${t.nav.call} ${business.phoneDisplay}`}>
              <Phone size={17} strokeWidth={2.4} aria-hidden />
              <span className="hidden sm:inline">{business.phoneDisplay}</span>
            </a>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center text-bone lg:hidden"
              aria-expanded={open}
              aria-controls="a-menu"
              aria-label={open ? t.nav.close : t.nav.menu}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X size={26} aria-hidden /> : <Menu size={26} aria-hidden />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="a-menu"
            role="dialog"
            aria-modal="true"
            aria-label={t.nav.menu}
            className="surface-dark fixed inset-0 z-[84] flex flex-col bg-ink px-5 pt-24 pb-8 lg:hidden"
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <nav aria-label="Main" className="flex-1">
              <ul className="flex flex-col">
                {links.map((l, i) => (
                  <motion.li
                    key={l.href}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.18 + i * 0.05, duration: 0.6, ease: EASE }}
                    className="border-b border-line"
                  >
                    <a href={l.href} onClick={() => setOpen(false)} className="display flex items-center justify-between py-3 text-[clamp(40px,11vw,64px)] text-bone">
                      {l.label}
                      <span className="text-[14px] font-sans tracking-normal text-vis">0{i + 1}</span>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <div className="hazard mb-6" aria-hidden />
            <div className="flex flex-col gap-3">
              <button
                type="button"
                className="btn btn-vis w-full"
                onClick={() => {
                  setOpen(false)
                  openQuote()
                }}
              >
                {t.hero.primary} <ArrowRight className="arrow" size={18} aria-hidden />
              </button>
              <div className="flex items-center justify-between">
                <a href={`tel:${business.phoneE164}`} className="flex min-h-11 items-center gap-2 font-semibold text-bone">
                  <Phone size={16} className="text-vis" aria-hidden /> {business.phoneDisplay}
                </a>
                <LangToggle />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
