import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { LangProvider, useLang } from '@shared/i18n'
import { useQuote } from '@shared/useQuote'
import { DirectionSwitch } from '@shared/DirectionSwitch'

function Stub() {
  const { t } = useLang()
  const q = useQuote()
  return <main><h1>{t.hero.headlines.a.join(' ')}</h1><p>{q.message}</p><DirectionSwitch current="a" /></main>
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LangProvider><Stub /></LangProvider>
  </StrictMode>,
)
