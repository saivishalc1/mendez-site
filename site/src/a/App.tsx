import { MotionConfig } from 'motion/react'
import { SmoothScroll } from '@shared/SmoothScroll'
import { DirectionSwitch } from '@shared/DirectionSwitch'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Statement } from './components/Statement'
import { Services } from './components/Services'
import { Work } from './components/Work'
import { Process } from './components/Process'
import { Quote } from './components/Quote'
import { Areas, Takes } from './components/Areas'
import { AboutFaq } from './components/AboutFaq'
import { Contact, Footer } from './components/Contact'
import { MobileBar } from './components/MobileBar'
import { Progressive } from '@shared/Progressive'

export function App() {
  return (
    <SmoothScroll>
      <MotionConfig reducedMotion="user">
        <Nav />
        <main>
          <Hero />
          <Progressive
            name="main"
            sections={[
              <Statement key="statement" />,
              <Services key="services" />,
              <Work key="work" />,
              <Process key="process" />,
              <Quote key="quote" />,
              <Takes key="takes" />,
              <Areas key="areas" />,
              <AboutFaq key="about" />,
              <Contact key="contact" />,
            ]}
          />
        </main>
        <Progressive after="main" sections={[<Footer key="footer" />, <MobileBar key="bar" />]} />
        <DirectionSwitch current="a" />
      </MotionConfig>
    </SmoothScroll>
  )
}
