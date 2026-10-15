import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { en, type Content } from './content/en'
import { es } from './content/es'
import { withViewTransition } from './view-transition'

export type Lang = 'en' | 'es'

const dictionaries: Record<Lang, Content> = { en, es }
const STORAGE_KEY = 'mv-lang'

function initialLang(): Lang {
  const param = new URLSearchParams(location.search).get('lang')
  if (param === 'en' || param === 'es') return param
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'en' || saved === 'es') return saved
  } catch {
    /* storage unavailable */
  }
  return navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en'
}

type LangContextValue = { lang: Lang; setLang: (lang: Lang) => void; toggle: () => void; t: Content }

const LangContext = createContext<LangContextValue | null>(null)

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)
  const t = dictionaries[lang]

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = t.meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta.description)
  }, [lang, t])

  const setLang = (next: Lang) => {
    withViewTransition(() => setLangState(next))
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* storage unavailable */
    }
  }

  return (
    <LangContext.Provider value={{ lang, setLang, toggle: () => setLang(lang === 'en' ? 'es' : 'en'), t }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used inside <LangProvider>')
  return ctx
}

/**
 * Splits `*word*` accents out of a string. Each direction decides how an accent
 * looks by passing its own className.
 */
export function rich(text: string, accentClass = 'accent') {
  return text.split(/(\*[^*]+\*)/g).map((part, i) =>
    part.startsWith('*') && part.endsWith('*') ? (
      <span key={i} className={accentClass}>
        {part.slice(1, -1)}
      </span>
    ) : (
      part
    ),
  )
}

/** Plain text with the accent markers removed (for aria-labels, alt text, word splitting). */
export function plain(text: string) {
  return text.replace(/\*/g, '')
}
