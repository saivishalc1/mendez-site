import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/anton/400.css'
import '@fontsource-variable/inter/wght.css'
import './a.css'
import { LangProvider } from '@shared/i18n'
import { MotionRoot } from '@shared/MotionRoot'
import { App } from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LangProvider>
      <MotionRoot>
        <App />
      </MotionRoot>
    </LangProvider>
  </StrictMode>,
)
