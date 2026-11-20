import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './lib/animations'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import HeroSection from './components/hero/HeroSection'
import ImpactSection from './components/sections/impact/ImpactSection'
import VisionSection from './components/sections/VisionSection'
import NayraBentoSection from './components/sections/bento/NayraBentoSection'
import NayraAssistantSection from './components/sections/assistant/NayraAssistantSection'
import AccessibilitySection from './components/sections/AccessibilitySection'
import TechnologySection from './components/sections/TechnologySection'
import FinalCtaSection from './components/sections/FinalCtaSection'
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

    return () => {
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
        <VisionSection />
        <NayraBentoSection id="meet-nayra" />
        <NayraAssistantSection id="ai-assistant" />
        <AccessibilitySection />
        <TechnologySection />
        <FinalCtaSection />
      </main>
      <Footer />
    </div>
  )
}
