import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/archivo/wdth.css'
import './c.css'
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
