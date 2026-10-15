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

export function App() {
  return (
    <SmoothScroll>
      <MotionConfig reducedMotion="user">
        <Nav />
        <main>
          <Hero />
          <Statement />
          <Services />
          <Work />
          <Process />
          <Quote />
          <Takes />
          <Areas />
          <AboutFaq />
          <Contact />
        </main>
        <Footer />
        <MobileBar />
        <DirectionSwitch current="a" />
      </MotionConfig>
    </SmoothScroll>
  )
}
