import { useEffect, useRef } from 'react'
import { gsap } from '../../../lib/animations'
import './NayraAssistantSection.css'

export interface NayraAssistantProps {
  id?: string
  imageSrc?: string
}

export default function NayraAssistantSection({
  id = 'ai-assistant',
  imageSrc = '/image/NAYRA_Purple_Gradient_Glasses.webp',
}: NayraAssistantProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const visualRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const content = contentRef.current
    const visual = visualRef.current
    if (!section || !content) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const reveals = content.querySelectorAll('.asst-reveal')

    const ctx = gsap.context(() => {
      if (reveals.length > 0) {
        gsap.fromTo(
          reveals,
          { opacity: 0, y: 22 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 78%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      }

      if (visual) {
        gsap.fromTo(
          visual,
          { opacity: 0, x: 28 },
          {
            opacity: 1,
            x: 0,
            duration: 0.85,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      }
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="nayra-assistant-section" id={id} aria-label="NAYRA Assistant">
      {/* ─── Full-Bleed Product Gradient Background Layer ─── */}
      <div className="assistant-bg-layer" aria-hidden="true">
        <img
          src={imageSrc}
          alt=""
          className="assistant-bg-img"
        />
        <div className="assistant-bg-overlay" />
      </div>

      <div className="nayra-assistant-container">
        <div className="nayra-assistant-grid">
          {/* ─── LEFT: Typography & Conversation Demonstration ─── */}
          <div ref={contentRef} className="assistant-content-column">
            {/* Small Eyebrow */}
            <span className="assistant-eyebrow asst-reveal">NAYRA ASSISTANT · CONCEPT DEMO</span>

            {/* Main Heading */}
            <h2 className="assistant-heading asst-reveal">
              A Smarter Way<br />
              <span className="assistant-heading-highlight">to See the World.</span>
            </h2>

            {/* Description */}
            <p className="assistant-description asst-reveal">
              A concept demonstration of how contextual voice and vision assistance could work on NAYRA glasses.
            </p>

            {/* Premium Conversation Demonstration Panel */}
            <div className="assistant-convo-card asst-reveal">
              {/* Message 1: YOU */}
              <div className="convo-msg convo-msg--user">
                <div className="convo-msg-header">
                  <div className="convo-sender">
                    <span className="convo-sender-icon convo-sender-icon--user">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </span>
                    <span className="convo-sender-tag">YOU</span>
                  </div>

                  {/* Subtle Audio Waveform Aligned to Right */}
                  <div className="convo-waveform" aria-hidden="true">
                    <span className="wave-bar wave-bar-1" />
                    <span className="wave-bar wave-bar-2" />
                    <span className="wave-bar wave-bar-3" />
                    <span className="wave-bar wave-bar-4" />
                    <span className="wave-bar wave-bar-5" />
                    <span className="wave-bar wave-bar-6" />
                  </div>
                </div>

                <p className="convo-msg-text convo-msg-text--user">
                  &ldquo;Hey NAYRA, what am I looking at?&rdquo;
                </p>
              </div>

              {/* Message 2: NAYRA Reply */}
              <div className="convo-msg convo-msg--assistant">
                <div className="convo-msg-header">
                  <div className="convo-sender">
                    <span className="convo-sender-icon convo-sender-icon--assistant">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
                      </svg>
                    </span>
                    <span className="convo-sender-tag convo-sender-tag--assistant">NAYRA</span>
                  </div>

                  <div className="convo-hud-badge">
                    <span className="hud-pulse-dot" />
                    <span className="hud-label">Illustrative response</span>
                  </div>
                </div>

                <div className="convo-msg-text convo-msg-text--assistant">
                  <p className="convo-primary-line">
                    &ldquo;You&rsquo;re looking at a pedestrian crossing.
                  </p>
                  <p className="convo-secondary-line">
                    The signal is currently <span className="convo-signal-alert">red</span>.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ─── RIGHT: NAYRA Glasses Visual Column ─── */}
          <div ref={visualRef} className="assistant-visual-column asst-reveal">
            {/* Desktop spacer: preserves right-column dimension and lets the background glasses shine through */}
            <div className="assistant-desktop-spacer" aria-hidden="true" />

            {/* Mobile/Tablet: displays glasses prominently below the conversation */}
            <div className="assistant-mobile-glasses-wrap">
              <img
                src={imageSrc}
                alt="NAYRA AI smart glasses with purple gradient"
                className="assistant-mobile-glasses-img"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
