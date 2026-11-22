import { useEffect, useRef, useCallback } from 'react'
import { gsap, ScrollTrigger } from '../../lib/animations'
import { useScrollFrames } from '../../hooks/useScrollFrames'
import { HeroCanvas, type HeroCanvasHandle } from './HeroCanvas'
import { HeroStoryOverlays, type HeroStoryOverlaysHandle } from './HeroStoryOverlays'
import './HeroSection.css'

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasHandleRef = useRef<HeroCanvasHandle>(null)
  const storyOverlaysRef = useRef<HeroStoryOverlaysHandle>(null)
  const scrollCueRef = useRef<HTMLDivElement>(null)
  const cueVisibleRef = useRef<boolean>(true)

  // Frame loading engine and RAF scheduler
  const { isReady, loadProgress, totalFrames, setFrameIndex, getFrame } = useScrollFrames({
    onFrameChange: (index) => {
      const img = getFrame(index)
      canvasHandleRef.current?.drawFrame(img)
    },
  })

  // Synchronize initial paint when Frame 1 is ready
  const handleReadyFrame = useCallback(() => {
    if (isReady) {
      const firstFrame = getFrame(1)
      canvasHandleRef.current?.drawFrame(firstFrame)
      // Initialize opening text at progress 0
      storyOverlaysRef.current?.updateProgress(0)
    }
  }, [isReady, getFrame])

  useEffect(() => {
    handleReadyFrame()
  }, [handleReadyFrame])

  // GSAP ScrollTrigger Integration
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.innerWidth < 768

    const container = containerRef.current
    const stage = stageRef.current
    const scrollCue = scrollCueRef.current
    if (!container || !stage) return

    // 1. Initial Page Load Cue Entrance
    const introTl = gsap.timeline({ delay: 0.3 })
    if (scrollCue && !prefersReducedMotion) {
      introTl.fromTo(
        scrollCue,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
      )
    }

    if (prefersReducedMotion) return

    // 2. Full-Screen Pinned Scroll Animation (tightened scroll distance to eliminate dead scroll gap)
    const scrollDistance = isMobile ? window.innerHeight * 1.7 : window.innerHeight * 2.1

    const heroTrigger = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: () => `+=${scrollDistance}`,
      pin: stage,
      // Progress is driven directly from scroll position; avoid extra scrub lag.
      scrub: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        const progress = self.progress

        // Map scroll progress [0, 1] strictly to frames [1, totalFrames]
        const frameIndex = Math.min(
          totalFrames,
          Math.max(1, Math.round(1 + progress * (totalFrames - 1)))
        )

        setFrameIndex(frameIndex)

        // Drive the 4-phase cinematic storytelling overlay
        storyOverlaysRef.current?.updateProgress(progress)

        // Bottom scroll cue fade-out (only triggers tween on state change, not on every frame)
        if (scrollCue) {
          const shouldBeVisible = progress < 0.06
          if (shouldBeVisible !== cueVisibleRef.current) {
            cueVisibleRef.current = shouldBeVisible
            gsap.to(scrollCue, {
              opacity: shouldBeVisible ? 1 : 0,
              duration: 0.25,
              ease: 'power1.out',
              overwrite: 'auto',
            })
          }
        }
      },
    })

    return () => {
      introTl.kill()
      heroTrigger.kill()
    }
  }, [totalFrames, setFrameIndex])

  return (
    <div ref={containerRef} className="hero-scroll-wrapper" id="hero">
      <section ref={stageRef} className="hero-landscape-stage">
        {/* Full-Screen Edge-to-Edge Canvas */}
        <HeroCanvas ref={canvasHandleRef} isVisible={isReady} />

        {/* Seamless Soft Edge Blending Vignettes */}
        <div className="hero-edge-vignette-top" aria-hidden="true" />
        <div className="hero-edge-vignette-bottom" aria-hidden="true" />
        <div className="hero-ambient-purple-glow" aria-hidden="true" />

        {/* Loading Indicator */}
        {!isReady && (
          <div className="hero-loader-pill" aria-live="polite">
            <span className="hero-loader-brand">
              NAYRA<span className="brand-dot">.</span>
            </span>
            <div className="hero-loader-track">
              <div
                className="hero-loader-bar"
                style={{ width: `${loadProgress}%` }}
              />
            </div>
            <span className="hero-loader-pct">CALIBRATING {loadProgress}%</span>
          </div>
        )}

        {/* Subtle Minimal Scroll Cue */}
        <div ref={scrollCueRef} className="hero-scroll-cue">
          <span className="scroll-cue-line" />
          <span className="scroll-cue-text">SCROLL TO EXPLORE</span>
        </div>

        {/* Cinematic Scroll Storytelling HTML Overlays */}
        <HeroStoryOverlays ref={storyOverlaysRef} />
      </section>
    </div>
  )
}
