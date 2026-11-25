import { useState, useEffect, useRef, useCallback } from 'react'
import './NayraExperienceSection.css'

export type FeatureKey = 'scene' | 'read' | 'ask' | 'navigation' | 'capture'

interface FeatureItem {
  key: FeatureKey
  title: string
  description: string
  icon: React.ReactNode
  tag: string
}

const FEATURES: FeatureItem[] = [
  {
    key: 'scene',
    title: 'Understand Your Surroundings',
    description: 'Get meaningful descriptions of the world around you.',
    tag: 'ENVIRONMENT DETECTION',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    key: 'read',
    title: 'Read with NAYRA',
    description: 'Turn visible text into accessible information.',
    tag: 'OPTICAL TEXT RECOGNITION',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
        <path d="M8 7h8" />
        <path d="M8 11h8" />
        <path d="M8 15h5" />
      </svg>
    ),
  },
  {
    key: 'ask',
    title: 'Ask NAYRA',
    description: 'Ask questions naturally and receive helpful responses.',
    tag: 'CONVERSATIONAL AI',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <path d="M8 10h.01" />
        <path d="M12 10h.01" />
        <path d="M16 10h.01" />
      </svg>
    ),
  },
  {
    key: 'navigation',
    title: 'Smart Navigation',
    description: 'Receive helpful directional guidance while on the move.',
    tag: 'AR WAYFINDING',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="3 11 22 2 13 21 11 13 3 11" />
      </svg>
    ),
  },
  {
    key: 'capture',
    title: 'Capture Moments',
    description: 'Take photos and record videos without reaching for your phone.',
    tag: 'HANDS-FREE CAPTURE',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
        <circle cx="12" cy="13" r="3" />
      </svg>
    ),
  },
]

interface NayraExperienceSectionProps {
  id?: string
}

export default function NayraExperienceSection({ id = 'experience' }: NayraExperienceSectionProps) {
  const [activeFeature, setActiveFeature] = useState<FeatureKey>('scene')
  const [replayKey, setReplayKey] = useState<number>(0)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const animStartTimeRef = useRef<number>(0)
  const featureRef = useRef<FeatureKey>('scene')

  useEffect(() => {
    animStartTimeRef.current = performance.now()
  }, [])

  useEffect(() => {
    featureRef.current = activeFeature
  }, [activeFeature])

  const isTransitioningRef = useRef<boolean>(false)
  const transitionAlphaRef = useRef<number>(1)

  const handleReplay = useCallback(() => {
    animStartTimeRef.current = performance.now()
    setReplayKey((k) => k + 1)
  }, [])

  const handleSelectFeature = useCallback((newFeature: FeatureKey) => {
    if (newFeature === featureRef.current && !isTransitioningRef.current) {
      handleReplay()
      return
    }

    isTransitioningRef.current = true
    const startTrans = performance.now()
    const DISSOLVE_MS = 160

    const stepTransition = (now: number) => {
      const elapsed = now - startTrans
      if (elapsed < DISSOLVE_MS) {
        transitionAlphaRef.current = 1 - elapsed / DISSOLVE_MS
        requestAnimationFrame(stepTransition)
      } else {
        setActiveFeature(newFeature)
        featureRef.current = newFeature
        animStartTimeRef.current = performance.now()
        setReplayKey((k) => k + 1)

        const fadeInStart = performance.now()
        const stepFadeIn = (nowFade: number) => {
          const fadeElapsed = nowFade - fadeInStart
          if (fadeElapsed < DISSOLVE_MS) {
            transitionAlphaRef.current = fadeElapsed / DISSOLVE_MS
            requestAnimationFrame(stepFadeIn)
          } else {
            transitionAlphaRef.current = 1
            isTransitioningRef.current = false
          }
        }
        requestAnimationFrame(stepFadeIn)
      }
    }

    requestAnimationFrame(stepTransition)
  }, [handleReplay])

  // ══════════════════════════════════════════════════════════════════
  // HARDWARE LED MATRIX ENGINE — ANIMATED DOT ILLUSTRATIONS
  // ══════════════════════════════════════════════════════════════════
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = 0
    let height = 0
    let dpr = 1

    const handleResize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = container.clientWidth
      height = container.clientHeight

      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
    }

    handleResize()
    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(container)

    const render = (time: number) => {
      animationFrameId = requestAnimationFrame(render)
      if (width === 0 || height === 0) return

      const elapsed = (time - animStartTimeRef.current) / 1000
      const currentFeature = featureRef.current

      // Calculate grid metrics (~8px spacing)
      const DOT_SPACING = width < 480 ? 7.2 : 8.0
      const cols = Math.floor(width / DOT_SPACING)
      const rows = Math.floor(height / DOT_SPACING)
      const startX = (width - cols * DOT_SPACING) / 2 + DOT_SPACING / 2
      const startY = (height - rows * DOT_SPACING) / 2 + DOT_SPACING / 2

      // Allocate discrete float array for matrix
      const grid = new Float32Array(cols * rows)
      const transAlpha = transitionAlphaRef.current

      const midC = Math.floor(cols / 2)
      // Position illustrations in upper-middle area (approx 40% height) to leave clean lower area for crisp HTML text
      const midR = Math.floor(rows * 0.40)

      // ────────────────────────────────────────────────────────────
      // DIRECT LED GRID DRAWING ROUTINES
      // ────────────────────────────────────────────────────────────
      const setDot = (c: number, r: number, val = 1.0) => {
        if (c >= 0 && c < cols && r >= 0 && r < rows) {
          const idx = r * cols + c
          grid[idx] = Math.max(grid[idx], val)
        }
      }

      const drawHLine = (r: number, cStart: number, cEnd: number, val = 1.0) => {
        for (let c = cStart; c <= cEnd; c++) setDot(c, r, val)
      }

      const drawVLine = (c: number, rStart: number, rEnd: number, val = 1.0) => {
        for (let r = rStart; r <= rEnd; r++) setDot(c, r, val)
      }

      const drawRect = (c: number, r: number, w: number, h: number, val = 1.0) => {
        for (let ro = 0; ro < h; ro++) {
          for (let co = 0; co < w; co++) {
            setDot(c + co, r + ro, val)
          }
        }
      }

      const strokeRect = (c: number, r: number, w: number, h: number, val = 1.0) => {
        drawHLine(r, c, c + w - 1, val)
        drawHLine(r + h - 1, c, c + w - 1, val)
        drawVLine(c, r, r + h - 1, val)
        drawVLine(c + w - 1, r, r + h - 1, val)
      }

      // ────────────────────────────────────────────────────────────
      // FEATURE ANIMATIONS ON LED MATRIX (100% PURPLE DOTS)
      // ────────────────────────────────────────────────────────────
      if (currentFeature === 'scene') {
        // SCENE UNDERSTANDING:
        // Environmental Illustration: Zebra Crossing + Traffic Light + Pedestrian Silhouette + Horizontal Radar Sweep
        const appear = Math.min(1, elapsed / 0.5)

        // 1. Perspective Road Outlines
        for (let r = midR - 6; r < midR + 18; r++) {
          const frac = (r - (midR - 6)) / 24
          const leftC = Math.round(midC - 6 - frac * 22)
          const rightC = Math.round(midC + 6 + frac * 22)
          setDot(leftC, r, appear * 0.85)
          setDot(leftC + 1, r, appear * 0.85)
          setDot(rightC, r, appear * 0.85)
          setDot(rightC - 1, r, appear * 0.85)
        }

        // 2. Pedestrian Zebra Crossing Stripes (4 wide stripes)
        for (let i = 0; i < 4; i++) {
          const rStart = midR + 1 + i * 4
          const frac = (rStart - midR) / 20
          const halfW = Math.round(14 + frac * 10)
          drawRect(midC - halfW, rStart, halfW * 2, 2, appear * 0.95)
        }

        // 3. Traffic Light Housing & Pole (Right side)
        const poleC = midC + 18
        const poleR = midR - 18
        strokeRect(poleC - 3, poleR, 7, 14, appear)
        drawVLine(poleC, poleR + 14, poleR + 24, appear)
        // Red light (active top lens - pulsating bright highlight)
        const redPulse = 0.85 + Math.sin(time * 0.006) * 0.15
        drawRect(poleC - 1, poleR + 2, 3, 3, redPulse)
        // Inactive middle & bottom lenses (faint ambient dots)
        setDot(poleC, poleR + 7, 0.25)
        setDot(poleC, poleR + 11, 0.25)

        // 4. Pedestrian Walking Silhouette (Left side)
        const pedC = midC - 11
        const pedR = midR - 5
        // Head
        drawRect(pedC - 1, pedR - 8, 3, 3, appear)
        // Body
        drawVLine(pedC, pedR - 5, pedR, appear)
        // Arms
        drawHLine(pedR - 4, pedC - 2, pedC + 2, appear)
        // Legs (subtle walking stride)
        const legStep = Math.sin(time * 0.008) * 1.2
        setDot(pedC - 1 + Math.round(legStep), pedR + 1, appear)
        setDot(pedC - 2 + Math.round(legStep), pedR + 2, appear)
        setDot(pedC + 1 - Math.round(legStep), pedR + 1, appear)
        setDot(pedC + 2 - Math.round(legStep), pedR + 2, appear)

        // 5. Bright Horizontal Laser Scan Band
        const scanT = ((elapsed * 0.65) % 1)
        const scanCol = Math.round(midC - 30 + scanT * 60)
        for (let r = midR - 19; r < midR + 18; r++) {
          setDot(scanCol - 1, r, 0.5)
          setDot(scanCol, r, 1.0)
          setDot(scanCol + 1, r, 0.5)
        }

      } else if (currentFeature === 'read') {
        // READ WITH NAYRA:
        // Document Page + Scanned Printed Lines + Downward Sweeping Laser + Equalizer Frequency Bars
        const appear = Math.min(1, elapsed / 0.5)
        const docW = 34
        const docH = 34
        const x0 = midC - Math.round(docW / 2)
        const y0 = midR - Math.round(docH / 2) - 4

        // Document outline with folded corner
        drawHLine(y0, x0, x0 + docW - 8, appear)
        drawVLine(x0, y0, y0 + docH, appear)
        drawHLine(y0 + docH, x0, x0 + docW, appear)
        drawVLine(x0 + docW, y0 + 8, y0 + docH, appear)
        // Diagonal fold
        for (let f = 0; f <= 8; f++) {
          setDot(x0 + docW - 8 + f, y0 + f, appear)
        }

        // Printed text lines inside document
        for (let l = 0; l < 4; l++) {
          const lineR = y0 + 10 + l * 5
          const lw = l === 1 ? docW - 14 : l === 3 ? docW - 18 : docW - 8
          drawHLine(lineR, x0 + 4, x0 + 4 + lw, appear * 0.85)
        }

        // Downward scanning laser beam
        const scanT = ((elapsed * 0.75) % 1)
        const scanR = Math.round(y0 + 4 + scanT * (docH - 8))
        drawHLine(scanR, x0 + 2, x0 + docW - 2, 1.0)
        drawHLine(scanR - 1, x0 + 2, x0 + docW - 2, 0.6)
        drawHLine(scanR + 1, x0 + 2, x0 + docW - 2, 0.6)

        // Audio waveform frequency bars beneath document
        const numBars = 24
        const startC = midC - Math.round((numBars * 2) / 2)
        for (let b = 0; b < numBars; b++) {
          const h = Math.round(1 + Math.abs(Math.sin(time * 0.007 + b * 0.45)) * 5)
          for (let ro = -h; ro <= h; ro++) {
            setDot(startC + b * 2, y0 + docH + 8 + ro, 0.85)
          }
        }

      } else if (currentFeature === 'ask') {
        // ASK NAYRA:
        // Stage 1 (0 to 1.6s): Microphone Icon
        // Stage 2 (1.6s+): Multi-Bar Voice Audio Equalizer Waveform
        if (elapsed < 1.6) {
          const appear = Math.min(1, elapsed / 0.4)
          const micC = midC
          const micR = midR - 2
          // Capsule
          strokeRect(micC - 4, micR - 12, 9, 13, appear)
          drawRect(micC - 3, micR - 11, 7, 11, appear * 0.5)
          // Arc cradle
          drawVLine(micC - 7, micR - 7, micR + 1, appear)
          drawVLine(micC + 7, micR - 7, micR + 1, appear)
          drawHLine(micR + 2, micC - 6, micC + 6, appear)
          // Stem & Base
          drawVLine(micC, micR + 3, micR + 10, appear)
          drawHLine(micR + 10, micC - 6, micC + 6, appear)
        } else {
          // Dynamic pulsating acoustic equalizer waves
          const numBars = 30
          const startC = midC - Math.round((numBars * 2) / 2)
          for (let b = 0; b < numBars; b++) {
            const phase = b * 0.32 + time * 0.008
            const h = Math.round(2 + Math.abs(Math.sin(phase) * Math.cos(phase * 0.7)) * 13)
            for (let ro = -h; ro <= h; ro++) {
              setDot(startC + b * 2, midR + ro, 0.95)
            }
          }
        }

      } else if (currentFeature === 'navigation') {
        // SMART NAVIGATION:
        // Stage 1 (0-1.8s): Straight Route Direction Arrow
        // Stage 2 (1.8s+): Curved Right-Turn Directional Arrow
        if (elapsed < 1.8) {
          const appear = Math.min(1, elapsed / 0.4)
          const arrowR = midR - 4

          // Upward Arrowhead
          for (let rowOffset = 0; rowOffset < 10; rowOffset++) {
            const halfW = rowOffset
            drawHLine(arrowR - 11 + rowOffset, midC - halfW, midC + halfW, appear)
          }
          // Shaft (3 dots wide)
          drawRect(midC - 1, arrowR - 1, 3, 16, appear)

          // Route navigation dots below
          setDot(midC, arrowR + 18, appear)
          setDot(midC, arrowR + 21, appear)
        } else {
          const rFade = Math.min(1, (elapsed - 1.8) / 0.3)
          const arrowR = midR - 4

          // Large Curved Right-Turn Arrow
          // Vertical base shaft
          drawRect(midC - 12, arrowR + 2, 4, 14, rFade)
          // Curved bend
          drawRect(midC - 12, arrowR - 6, 8, 4, rFade)
          drawRect(midC - 5, arrowR - 10, 10, 4, rFade)
          // Horizontal section
          drawRect(midC + 4, arrowR - 10, 8, 4, rFade)

          // Arrowhead pointing right
          for (let colOffset = 0; colOffset < 9; colOffset++) {
            const halfH = 8 - colOffset
            drawVLine(midC + 11 + colOffset, arrowR - 9 - halfH, arrowR - 9 + halfH, rFade)
          }

          // Pulse dot behind turn
          setDot(midC - 10, arrowR + 19, rFade * 0.7)
          setDot(midC - 10, arrowR + 22, rFade * 0.5)
        }

      } else if (currentFeature === 'capture') {
        // CAPTURE MOMENTS:
        // Stage 1 (0-1.0s): Large Camera Silhouette
        // Stage 2 (1.0-2.3s): Viewfinder Brackets + Crosshair
        // Stage 3 (2.3-2.6s): Shutter Flash
        // Stage 4 (2.6s+): Checkmark
        if (elapsed < 1.0) {
          const appear = Math.min(1, elapsed / 0.4)
          // Camera body
          strokeRect(midC - 16, midR - 9, 32, 19, appear)
          // Lens circle
          drawRect(midC - 5, midR - 3, 11, 7, appear * 0.8)
          // Top notch
          drawHLine(midR - 11, midC - 6, midC + 6, appear)
        } else if (elapsed < 2.3) {
          // Viewfinder corner brackets (38x26 dots)
          const vw = 38
          const vh = 24
          const x0 = midC - Math.round(vw / 2)
          const y0 = midR - Math.round(vh / 2)
          const bLen = 6

          // 4 Corner brackets (2 dots thick)
          drawRect(x0, y0, bLen, 2, 1.0)
          drawRect(x0, y0, 2, bLen, 1.0)

          drawRect(x0 + vw - bLen, y0, bLen, 2, 1.0)
          drawRect(x0 + vw - 2, y0, 2, bLen, 1.0)

          drawRect(x0, y0 + vh - 2, bLen, 2, 1.0)
          drawRect(x0, y0 + vh - bLen, 2, bLen, 1.0)

          drawRect(x0 + vw - bLen, y0 + vh - 2, bLen, 2, 1.0)
          drawRect(x0 + vw - 2, y0 + vh - bLen, 2, bLen, 1.0)

          // Center crosshair
          drawHLine(y0 + Math.round(vh / 2), midC - 2, midC + 2, 0.9)
          drawVLine(midC, y0 + Math.round(vh / 2) - 2, y0 + Math.round(vh / 2) + 2, 0.9)
        } else if (elapsed < 2.6) {
          // Shutter flash: all matrix dots illuminate in bright purple flash
          grid.fill(1.0)
        } else {
          // Large Crisp Checkmark
          const cFade = Math.min(1, (elapsed - 2.6) / 0.3)
          const checkC = midC
          const checkR = midR - 2

          // Checkmark (3 dots thick)
          for (let i = 0; i < 6; i++) {
            drawRect(checkC - 10 + i, checkR - 2 + i, 2, 2, cFade * 1.0)
          }
          for (let i = 0; i < 14; i++) {
            drawRect(checkC - 4 + i, checkR + 4 - i, 2, 2, cFade * 1.0)
          }
        }
      }

      // ────────────────────────────────────────────────────────────
      // RENDER REAL HARDWARE LED DOTS ON VISIBLE CANVAS
      // ────────────────────────────────────────────────────────────
      ctx.save()
      ctx.scale(dpr, dpr)
      ctx.fillStyle = '#05030B'
      ctx.fillRect(0, 0, width, height)

      for (let r = 0; r < rows; r++) {
        const y = Math.round(startY + r * DOT_SPACING)
        for (let c = 0; c < cols; c++) {
          const x = Math.round(startX + c * DOT_SPACING)
          const val = grid[r * cols + c] * transAlpha

          if (val <= 0.05) {
            // Inactive LED: #251333
            ctx.fillStyle = '#251333'
            ctx.beginPath()
            ctx.arc(x, y, 1.35, 0, Math.PI * 2)
            ctx.fill()
          } else if (val < 0.5) {
            // Faint Active LED
            ctx.fillStyle = '#8B5CF6'
            ctx.beginPath()
            ctx.arc(x, y, 1.6, 0, Math.PI * 2)
            ctx.fill()
          } else if (val < 0.85) {
            // Bright Active LED: #A855F7
            ctx.fillStyle = '#A855F7'
            ctx.beginPath()
            ctx.arc(x, y, 1.85, 0, Math.PI * 2)
            ctx.fill()
          } else {
            // Max Highlight Active LED: #E9D5FF with slight radial glow
            ctx.fillStyle = '#C084FC'
            ctx.beginPath()
            ctx.arc(x, y, 2.3, 0, Math.PI * 2)
            ctx.fill()

            ctx.fillStyle = '#E9D5FF'
            ctx.beginPath()
            ctx.arc(x, y, 1.7, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      }

      ctx.restore()
    }

    animationFrameId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animationFrameId)
      resizeObserver.disconnect()
    }
  }, [])

  const currentFeatureItem = FEATURES.find((f) => f.key === activeFeature) || FEATURES[0]

  return (
    <section className="exp-section" id={id} aria-label="Experience NAYRA">
      <div className="exp-container">
        {/* ─── LEFT COLUMN (48% Width) ─── */}
        <div className="exp-left-col">
          <header className="exp-header">
            <h2 className="exp-heading">Intelligence that moves with you.</h2>
            <p className="exp-description">
              From understanding your surroundings to answering your questions, discover how NAYRA brings everyday assistance into a seamless, hands-free experience.
            </p>
          </header>

          <div className="exp-features-list" role="tablist" aria-label="NAYRA Interactive Capabilities">
            {FEATURES.map((feature) => {
              const isActive = activeFeature === feature.key

              return (
                <button
                  key={feature.key}
                  type="button"
                  role="tab"
                  id={`exp-tab-${feature.key}`}
                  aria-selected={isActive}
                  aria-controls="exp-dotmatrix-canvas"
                  tabIndex={isActive ? 0 : -1}
                  className={`exp-feature-row ${isActive ? 'is-active' : ''}`}
                  onClick={() => handleSelectFeature(feature.key)}
                >
                  <div className="exp-feature-row__icon" aria-hidden="true">
                    {feature.icon}
                  </div>
                  <div className="exp-feature-row__content">
                    <span className="exp-feature-row__title">{feature.title}</span>
                    <span className="exp-feature-row__desc">{feature.description}</span>
                  </div>
                  <span className="exp-feature-row__arrow" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ─── RIGHT COLUMN (52% Width) — REAL PURPLE LED DOT-MATRIX DISPLAY + CRISP HTML TYPOGRAPHY ─── */}
        <div className="exp-right-col">
          <div className="exp-matrix-viewport" ref={containerRef}>
            {/* Background Layer: Programmable Continuous Edge-to-Edge LED Dot Matrix */}
            <canvas
              ref={canvasRef}
              id="exp-dotmatrix-canvas"
              className="exp-matrix-canvas"
              role="img"
              aria-label={`Interactive LED Dot Matrix Demonstration: ${currentFeatureItem.title}`}
            />

            {/* Foreground Layer: Crisp Normal HTML Typography Layered Above Matrix */}
            <div className="exp-matrix-overlay" aria-live="polite">
              {/* Lower Area: Crisp Normal HTML Heading and Supporting Text */}
              <div
                className={`exp-matrix-text-content exp-matrix-text-content--${activeFeature}`}
                key={`text-${activeFeature}-${replayKey}`}
              >
                {activeFeature === 'scene' && (
                  <>
                    <h3 className="exp-matrix-heading">Pedestrian Crossing Ahead</h3>
                    <p className="exp-matrix-supporting">A traffic signal is visible.</p>
                  </>
                )}

                {activeFeature === 'read' && (
                  <>
                    <h3 className="exp-matrix-heading">Text Recognized</h3>
                    <p className="exp-matrix-supporting">Meeting scheduled for Monday at 10:30 AM.</p>
                  </>
                )}

                {activeFeature === 'ask' && (
                  <div className="exp-matrix-dialogue">
                    <div className="exp-dialogue-item exp-dialogue-user">
                      <span className="exp-dialogue-speaker">User</span>
                      <p className="exp-dialogue-text">“Hey NAYRA, what am I looking at?”</p>
                    </div>
                    <div className="exp-dialogue-item exp-dialogue-response">
                      <span className="exp-dialogue-speaker">Response</span>
                      <p className="exp-dialogue-text">“You&apos;re looking at a pedestrian crossing.”</p>
                    </div>
                  </div>
                )}

                {activeFeature === 'navigation' && (
                  <>
                    <h3 className="exp-matrix-heading">Turn Right</h3>
                    <p className="exp-matrix-supporting">In 50 meters</p>
                  </>
                )}

                {activeFeature === 'capture' && (
                  <>
                    <h3 className="exp-matrix-heading">Photo Captured</h3>
                    <p className="exp-matrix-supporting">Your moment has been saved.</p>
                  </>
                )}
              </div>
            </div>

            {/* Small Replay Control (HTML control positioned in top-right) */}
            <button
              type="button"
              className="exp-matrix-replay"
              onClick={handleReplay}
              title="Restart animation"
              aria-label="Restart animation"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                <path d="M16 21h5v-5" />
              </svg>
              <span>Replay</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
