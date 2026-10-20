import { MotionConfig } from 'motion/react'
import { useLang } from '@shared/i18n'
import { DirectionSwitch } from '@shared/DirectionSwitch'
import { SmoothScroll } from '@shared/SmoothScroll'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Statement } from './components/Statement'
import { Services } from './components/Services'
import { Film } from './components/Film'
import { Process } from './components/Process'
import { Work } from './components/Work'
import { Quote } from './components/Quote'
import { Areas } from './components/Areas'
import { About } from './components/About'
import { Contact } from './components/Contact'
import { MobileBar } from './components/MobileBar'
import { Progressive } from '@shared/Progressive'

const SKIP = { en: 'Skip to content', es: 'Saltar al contenido' } as const

export function App() {
  const { lang } = useLang()
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-paper"
        >
          {SKIP[lang]}
        </a>
        <Nav />
        <main id="main">
          <Hero />
          <Progressive
            name="main"
            sections={[
              <Statement key="statement" />,
              <Services key="services" />,
              <Film key="film" />,
              <Process key="process" />,
              <Work key="work" />,
              <Quote key="quote" />,
              <Areas key="areas" />,
              <About key="about" />,
            ]}
          />
        </main>
        <Progressive after="main" sections={[<Contact key="contact" />, <MobileBar key="bar" />]} />
        <DirectionSwitch current="b" />
      </SmoothScroll>
    </MotionConfig>
  )
}
