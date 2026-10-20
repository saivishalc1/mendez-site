import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/instrument-serif/400.css'
import '@fontsource/instrument-serif/400-italic.css'
import '@fontsource-variable/inter'
import './b.css'
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
