import { useEffect, useState } from 'react'
import { AnimatePresence, m, useMotionValueEvent, useScroll } from 'motion/react'
import { useLenis } from 'lenis/react'
import { Menu, Phone, X } from 'lucide-react'
import { useLang, type Lang } from '@shared/i18n'
import { business } from '@shared/business'
import { openQuote } from '@shared/useQuote'
import { Wordmark } from './ui'

export function LangPill({ className = '' }: { className?: string }) {
  const { lang, setLang } = useLang()
  const opts: Lang[] = ['en', 'es']
  return (
    <div className={`langpill ${className}`} role="group" aria-label="Language / Idioma">
      {opts.map((l) => (
        <button key={l} type="button" lang={l} aria-pressed={lang === l} onClick={() => setLang(l)} className={lang === l ? 'on' : ''}>
          {l.toUpperCase()}
          <span className="sr-only">{l === 'en' ? ' English' : ' Español'}</span>
        </button>
      ))}
    </div>
  )
}

export function Nav() {
  const { t } = useLang()
  const n = t.nav
  const { scrollY } = useScroll()
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  const lenis = useLenis()

  useMotionValueEvent(scrollY, 'change', (y) => setSolid(y > window.innerHeight * 0.82))

  useEffect(() => {
    if (open) lenis?.stop()
    else lenis?.start()
    document.documentElement.classList.toggle('menu-open', open)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, lenis])

  const links = [
    { href: '#services', label: n.services },
    { href: '#work', label: n.work },
    { href: '#process', label: n.process },
    { href: '#areas', label: n.areas },
    { href: '#faq', label: n.faq },
  ]

  return (
    <header className={`nav ${solid ? 'is-solid' : ''}`}>
      <div className="wrap nav-row">
        <a href="#top" className="nav-logo" aria-label={business.name}>
          <Wordmark />
        </a>
        <nav aria-label="Main" className="nav-links">
          {links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="nav-right">
          <LangPill className="hide-sm" />
          <a href={`tel:${business.phoneE164}`} className="nav-phone hide-sm">
            {business.phoneDash}
          </a>
          <button type="button" className={`nav-cta hide-sm ${solid ? 'is-on' : ''}`} onClick={() => openQuote()} tabIndex={solid ? 0 : -1} aria-hidden={!solid}>
            {n.quote}
          </button>
          <LangPill className="show-sm" />
          <button type="button" className="nav-menu show-sm" aria-expanded={open} aria-controls="c-menu" onClick={() => setOpen(true)}>
            <Menu size={22} aria-hidden="true" />
            <span className="sr-only">{n.menu}</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <m.div
            id="c-menu"
            className="menu"
            role="dialog"
            aria-modal="true"
            aria-label={n.menu}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="wrap nav-row">
              <Wordmark />
              <button type="button" className="nav-menu" onClick={() => setOpen(false)} autoFocus>
                <X size={22} aria-hidden="true" />
                <span className="sr-only">{n.close}</span>
              </button>
            </div>
            <nav aria-label="Menu" className="wrap menu-links">
              {links.map((l, i) => (
                <m.a
                  key={l.href}
                  href={l.href}
                  onClick={(e) => {
                    e.preventDefault()
                    setOpen(false)
                    setTimeout(() => {
                      const el = document.querySelector<HTMLElement>(l.href)
                      if (!el) return
                      if (lenis) lenis.scrollTo(el, { offset: -8 })
                      else el.scrollIntoView({ behavior: 'smooth' })
                    }, 80)
                  }}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="menu-n">0{i + 1}</span>
                  {l.label}
                </m.a>
              ))}
            </nav>
            <div className="wrap menu-foot">
              <button
                type="button"
                className="btn btn-red btn-block"
                onClick={() => {
                  setOpen(false)
                  setTimeout(() => openQuote(), 60)
                }}
              >
                {t.hero.primary}
              </button>
              <a href={`tel:${business.phoneE164}`} className="btn btn-ghost btn-block">
                <Phone size={18} aria-hidden="true" /> {business.phoneDisplay}
              </a>
              <div className="menu-tape tape" aria-hidden="true" />
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  )
}
