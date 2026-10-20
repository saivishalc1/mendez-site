import { MotionConfig } from 'motion/react'
import { useLang } from '@shared/i18n'
import { useQuote } from '@shared/useQuote'
import { SmoothScroll } from '@shared/SmoothScroll'
import { DirectionSwitch } from '@shared/DirectionSwitch'
import { local } from './local'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Statement } from './components/Statement'
import { Services } from './components/Services'
import { VideoBand } from './components/VideoBand'
import { Process } from './components/Process'
import { Work } from './components/Work'
import { Quote } from './components/Quote'
import { Areas } from './components/Areas'
import { AboutFaq } from './components/AboutFaq'
import { Contact } from './components/Contact'
import { MobileBar } from './components/MobileBar'
import { Progressive } from '@shared/Progressive'

export function App() {
  const { lang } = useLang()
  // One quote instance: the hero card (step 1) and the full form (#quote) share it.
  const q = useQuote()
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll>
        <a href="#main" className="skip">
          {local(lang).skip}
        </a>
        <Nav />
        <main id="main" className="c-root">
          <Hero q={q} />
          <Progressive
            name="main"
            sections={[
              <Statement key="statement" />,
              <Services key="services" />,
              <VideoBand key="video" />,
              <Process key="process" />,
              <Work key="work" />,
              <Quote key="quote" q={q} />,
              <Areas key="areas" />,
              <AboutFaq key="about" />,
            ]}
          />
        </main>
        <Progressive after="main" sections={[<Contact key="contact" />, <MobileBar key="bar" />]} />
        <DirectionSwitch current="c" />
      </SmoothScroll>
    </MotionConfig>
  )
}
