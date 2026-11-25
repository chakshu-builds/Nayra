import { useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react'

export interface HeroStoryOverlaysHandle {
  updateProgress: (progress: number) => void
}

const BRAND_WORDMARK = 'NAYRA.'

function clamp(val: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, val))
}

export const HeroStoryOverlays = forwardRef<HeroStoryOverlaysHandle>(function HeroStoryOverlays(
  _props,
  ref
) {
  // Typewriter effect state for Opening beat (specifically typing NAYRA.)
  const [typedChars, setTypedChars] = useState(0)

  // Direct DOM references for 60fps staggered style transitions
  const openingRef = useRef<HTMLDivElement>(null)

  // Camera Section refs
  const cameraBlockRef = useRef<HTMLDivElement>(null)
  const cameraEyebrowRef = useRef<HTMLSpanElement>(null)
  const cameraHeadingRef = useRef<HTMLHeadingElement>(null)
  const cameraDescRef = useRef<HTMLParagraphElement>(null)

  // Modular Architecture refs
  const modularBlockRef = useRef<HTMLDivElement>(null)
  const modularEyebrowRef = useRef<HTMLSpanElement>(null)
  const modularHeadingRef = useRef<HTMLHeadingElement>(null)
  const modularDescRef = useRef<HTMLParagraphElement>(null)

  // Final Reveal ref
  const finalBlockRef = useRef<HTMLDivElement>(null)

  // Typewriter typing progression on mount
  useEffect(() => {
    let charIndex = 0
    const delayTimer = setTimeout(() => {
      const typeInterval = setInterval(() => {
        charIndex++
        setTypedChars(charIndex)
        if (charIndex >= BRAND_WORDMARK.length) {
          clearInterval(typeInterval)
        }
      }, 95)
    }, 250)

    return () => {
      clearTimeout(delayTimer)
    }
  }, [])

  // Imperative progress update: applies smooth staggered reveals per storyboard beat
  useImperativeHandle(ref, () => ({
    updateProgress: (p: number) => {
      // ─── 1. Opening: INTRODUCING / NAYRA. (Progress 0.00 -> 0.16) ───
      if (openingRef.current) {
        if (p < 0.02) {
          openingRef.current.style.opacity = '1'
          openingRef.current.style.transform = 'translate(-50%, -50%)'
          openingRef.current.style.visibility = 'visible'
        } else if (p < 0.16) {
          const t = (p - 0.02) / 0.14
          openingRef.current.style.opacity = String(Math.max(0, 1 - t))
          openingRef.current.style.transform = `translate(-50%, calc(-50% - ${t * 18}px))`
          openingRef.current.style.visibility = 'visible'
        } else {
          openingRef.current.style.opacity = '0'
          openingRef.current.style.visibility = 'hidden'
        }
      }

      // ─── 2. Camera Section: 01 / PRECISION CAMERA (Left side, Progress 0.22 -> 0.43) ───
      if (cameraBlockRef.current) {
        if (p < 0.22 || p > 0.43) {
          cameraBlockRef.current.style.visibility = 'hidden'
        } else {
          cameraBlockRef.current.style.visibility = 'visible'

          // Exit fade out between 0.37 -> 0.43
          if (p > 0.37) {
            const tOut = (p - 0.37) / 0.06
            const op = String(Math.max(0, 1 - tOut))
            const y = `${-16 * tOut}px`

            if (cameraEyebrowRef.current) {
              cameraEyebrowRef.current.style.opacity = op
              cameraEyebrowRef.current.style.transform = `translateY(${y})`
            }
            if (cameraHeadingRef.current) {
              cameraHeadingRef.current.style.opacity = op
              cameraHeadingRef.current.style.transform = `translateY(${y})`
            }
            if (cameraDescRef.current) {
              cameraDescRef.current.style.opacity = op
              cameraDescRef.current.style.transform = `translateY(${y})`
            }
          } else {
            // Staggered Entry: Eyebrow (0.22->0.26) -> Heading (0.24->0.28) -> Desc (0.26->0.30)
            const tEyebrow = clamp((p - 0.22) / 0.04)
            const tHeading = clamp((p - 0.24) / 0.04)
            const tDesc = clamp((p - 0.26) / 0.04)

            if (cameraEyebrowRef.current) {
              cameraEyebrowRef.current.style.opacity = String(tEyebrow)
              cameraEyebrowRef.current.style.transform = `translateY(${14 * (1 - tEyebrow)}px)`
            }
            if (cameraHeadingRef.current) {
              cameraHeadingRef.current.style.opacity = String(tHeading)
              cameraHeadingRef.current.style.transform = `translateY(${16 * (1 - tHeading)}px)`
            }
            if (cameraDescRef.current) {
              cameraDescRef.current.style.opacity = String(tDesc)
              cameraDescRef.current.style.transform = `translateY(${14 * (1 - tDesc)}px)`
            }
          }
        }
      }

      // ─── 3. Modular Architecture: 02 / MODULAR ARCHITECTURE (Right side, Progress 0.46 -> 0.69) ───
      if (modularBlockRef.current) {
        if (p < 0.46 || p > 0.69) {
          modularBlockRef.current.style.visibility = 'hidden'
        } else {
          modularBlockRef.current.style.visibility = 'visible'

          // Exit fade out between 0.63 -> 0.69
          if (p > 0.63) {
            const tOut = (p - 0.63) / 0.06
            const op = String(Math.max(0, 1 - tOut))
            const y = `${-16 * tOut}px`

            if (modularEyebrowRef.current) {
              modularEyebrowRef.current.style.opacity = op
              modularEyebrowRef.current.style.transform = `translateY(${y})`
            }
            if (modularHeadingRef.current) {
              modularHeadingRef.current.style.opacity = op
              modularHeadingRef.current.style.transform = `translateY(${y})`
            }
            if (modularDescRef.current) {
              modularDescRef.current.style.opacity = op
              modularDescRef.current.style.transform = `translateY(${y})`
            }
          } else {
            // Staggered Entry: Eyebrow (0.46->0.50) -> Heading (0.48->0.52) -> Desc (0.50->0.54)
            const tEyebrow = clamp((p - 0.46) / 0.04)
            const tHeading = clamp((p - 0.48) / 0.04)
            const tDesc = clamp((p - 0.50) / 0.04)

            if (modularEyebrowRef.current) {
              modularEyebrowRef.current.style.opacity = String(tEyebrow)
              modularEyebrowRef.current.style.transform = `translateY(${14 * (1 - tEyebrow)}px)`
            }
            if (modularHeadingRef.current) {
              modularHeadingRef.current.style.opacity = String(tHeading)
              modularHeadingRef.current.style.transform = `translateY(${16 * (1 - tHeading)}px)`
            }
            if (modularDescRef.current) {
              modularDescRef.current.style.opacity = String(tDesc)
              modularDescRef.current.style.transform = `translateY(${14 * (1 - tDesc)}px)`
            }
          }
        }
      }

      // ─── 4. Final Product Reveal: NAYRA (Top-center, Progress 0.70 -> 1.00) ───
      if (finalBlockRef.current) {
        if (p < 0.70) {
          finalBlockRef.current.style.opacity = '0'
          finalBlockRef.current.style.visibility = 'hidden'
        } else if (p >= 0.70 && p < 0.88) {
          const t = (p - 0.70) / 0.18
          finalBlockRef.current.style.opacity = String(t)
          finalBlockRef.current.style.transform = `translate(-50%, calc(-50% + ${16 * (1 - t)}px))`
          finalBlockRef.current.style.visibility = 'visible'
        } else {
          finalBlockRef.current.style.opacity = '1'
          finalBlockRef.current.style.transform = 'translate(-50%, -50%)'
          finalBlockRef.current.style.visibility = 'visible'
        }
      }
    },
  }))

  return (
    <div className="hero-story-container" aria-live="polite">
      {/* ─── 1. Opening: Two-level Typographic Composition (Optical Center) ─── */}
      <div ref={openingRef} className="story-block story-opening">
        <span className="story-opening__intro">INTRODUCING</span>
        <h1 className="story-opening__brand">
          {BRAND_WORDMARK.slice(0, typedChars)}
          <span className="story-opening__cursor story-opening__cursor--on" aria-hidden="true">
            |
          </span>
        </h1>
      </div>

      {/* ─── 2. Camera Module Reveal (Left Side Negative Space) ─── */}
      <div ref={cameraBlockRef} className="story-block story-camera">
        <span ref={cameraEyebrowRef} className="story-eyebrow">
          01 / PRECISION CAMERA
        </span>
        <h2 ref={cameraHeadingRef} className="story-headline">
          See the<br />Unseen.
        </h2>
        <p ref={cameraDescRef} className="story-description">
          Intelligent visual perception, designed to understand the world around you.
        </p>
      </div>

      {/* ─── 3. Modular Architecture Reveal (Right Side Negative Space) ─── */}
      <div ref={modularBlockRef} className="story-block story-modular">
        <span ref={modularEyebrowRef} className="story-eyebrow">
          02 / MODULAR ARCHITECTURE
        </span>
        <h2 ref={modularHeadingRef} className="story-headline">
          Designed to<br />Fit Within.
        </h2>
        <p ref={modularDescRef} className="story-description">
          Compact technology. Thoughtfully integrated into an everyday wearable.
        </p>
      </div>

      {/* ─── 4. Final Complete Product Reveal (Top-Center) ─── */}
      <div ref={finalBlockRef} className="story-block story-final">
        <div className="story-final__wordmark-row">
          <span className="story-final__line story-final__line--left" aria-hidden="true" />
          <h2 className="story-final__brand">
            NAYR<span className="story-final__accent">A</span>
          </h2>
          <span className="story-final__line story-final__line--right" aria-hidden="true" />
        </div>
        <h3 className="story-final__tagline">
          See Beyond. Experience More.
        </h3>
        <p className="story-final__subtext">
          Technology that understands your world.
        </p>
      </div>
    </div>
  )
})
