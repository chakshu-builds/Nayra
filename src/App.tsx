import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './lib/animations'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import HeroSection from './components/hero/HeroSection'
import ImpactSection from './components/sections/impact/ImpactSection'
import NayraBentoSection from './components/sections/bento/NayraBentoSection'
import NayraEditorialSection from './components/sections/editorial/NayraEditorialSection'
import NayraAssistantSection from './components/sections/assistant/NayraAssistantSection'
import NayraExperienceSection from './components/sections/experience/NayraExperienceSection'
import NayraSpecificationsSection from './components/sections/specifications/NayraSpecificationsSection'
import FinalCtaSection from './components/sections/FinalCtaSection'
import NayraFAQSection from './components/sections/faq/NayraFAQSection'
import './App.css'

export default function App() {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // Check user preference for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 1.6,
    })

    lenisRef.current = lenis
    ;(window as any).__lenis = lenis
    ;(window as any).ScrollTrigger = ScrollTrigger

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(tickerCallback)
    // Smooth over any micro-delays (e.g. video decoding or frame streaming)
    gsap.ticker.lagSmoothing(500, 33)

    const handleResize = () => {
      ScrollTrigger.refresh()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      lenis.destroy()
      gsap.ticker.remove(tickerCallback)
    }
  }, [])

  return (
    <div className="app-shell">
      <Navbar />
      <main id="main-content">
        <HeroSection />
        <ImpactSection />
        <NayraBentoSection id="meet-nayra" />
        <NayraEditorialSection
          id="features"
          image1Src="/image/NAYRA_Mountain.webp"
          image1Alt="Person capturing an outdoor mountain experience with NAYRA smart glasses"
          image2Src="/image/NAYRA_Cafe.webp"
          image2Alt="Person naturally interacting with NAYRA in a cafe through voice assistance"
        />
        <NayraAssistantSection id="ai-assistant" />
        <NayraExperienceSection id="experience" />
        <NayraSpecificationsSection id="specifications" />
        <FinalCtaSection />
        <NayraFAQSection id="faq" />
      </main>
      <Footer />
    </div>
  )
}
