import { useEffect, useRef } from 'react'
import { gsap } from '../../../lib/animations'
import './NayraAssistantSection.css'

export interface NayraAssistantConfig {
  glassesImage: string
  glassesImageAlt?: string
}

export const DEFAULT_ASSISTANT_CONFIG: NayraAssistantConfig = {
  // Configurable and initially empty. Add your NAYRA glasses render here later.
  glassesImage: '',
  glassesImageAlt: 'NAYRA AI smart glasses with open-ear audio and dual neural cameras',
}

interface NayraAssistantSectionProps {
  id?: string
  config?: Partial<NayraAssistantConfig>
}

export default function NayraAssistantSection({
  id = 'ai-assistant',
  config = {},
}: NayraAssistantSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  const settings: NayraAssistantConfig = {
    ...DEFAULT_ASSISTANT_CONFIG,
    ...config,
  }

  useEffect(() => {
    const section = sectionRef.current
    const content = contentRef.current
    if (!section || !content) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const reveals = content.querySelectorAll('.assistant-reveal')
    const commandItems = content.querySelectorAll('.assistant-command-item')
    const imgEl = imageRef.current

    const ctx = gsap.context(() => {
      // Main header & content fade-up
      if (reveals.length > 0) {
        gsap.fromTo(
          reveals,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      }

      // Voice commands staggered reveal
      if (commandItems.length > 0) {
        gsap.fromTo(
          commandItems,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      }

      // Glasses image entrance (active only when image source is supplied)
      if (imgEl && settings.glassesImage) {
        gsap.fromTo(
          imgEl,
          { opacity: 0, x: 30, scale: 0.96 },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 1,
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
  }, [settings.glassesImage])

  return (
    <section ref={sectionRef} className="nayra-assistant-section" id={id}>
      <div className="nayra-assistant-container">
        <div className="nayra-assistant-grid">
          {/* ─── LEFT: 55–60% AI Assistant Information & Voice Commands ─── */}
          <div ref={contentRef} className="nayra-assistant-info">
            {/* Header info */}
            <div className="assistant-header-group">
              <span className="assistant-eyebrow assistant-reveal">
                MEET YOUR INTELLIGENCE
              </span>
              <h2 className="assistant-heading assistant-reveal">
                Meet NAYRA.<br />
                <span className="assistant-highlight">Your World, Understood.</span>
              </h2>
              <p className="assistant-desc assistant-reveal">
                More than smart glasses. NAYRA is your intelligent everyday companion,
                designed to see, listen, understand and assist through natural voice interaction.
              </p>
            </div>

            {/* Voice Assistant Interaction Zone */}
            <div className="assistant-commands-zone">
              <div className="assistant-commands-header assistant-reveal">
                <span className="assistant-sound-cue" aria-hidden="true">
                  <span className="cue-bar bar-1" />
                  <span className="cue-bar bar-2" />
                  <span className="cue-bar bar-3" />
                  <span className="cue-bar bar-2" />
                  <span className="cue-bar bar-1" />
                </span>
                <h3 className="assistant-voice-title">
                  Just Say, <span className="assistant-voice-accent">&ldquo;Hey NAYRA.&rdquo;</span>
                </h3>
              </div>

              {/* Two Clean Columns Separated by a Subtle Vertical Divider */}
              <div className="assistant-columns-wrapper assistant-reveal">
                {/* Column 1: See & Understand */}
                <div className="assistant-column">
                  <div className="assistant-column-header">
                    <span className="assistant-col-tag">See &amp; Understand</span>
                  </div>
                  <div className="assistant-command-list">
                    <div className="assistant-command-item">
                      <span className="command-quote-mark">&ldquo;</span>
                      <p className="command-text">
                        Hey NAYRA, what&apos;s in front of me?
                      </p>
                    </div>

                    <div className="assistant-command-item">
                      <span className="command-quote-mark">&ldquo;</span>
                      <p className="command-text">
                        Hey NAYRA, describe my surroundings.
                      </p>
                    </div>

                    <div className="assistant-command-item">
                      <span className="command-quote-mark">&ldquo;</span>
                      <p className="command-text">
                        Hey NAYRA, read this text aloud.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Subtle Vertical Divider */}
                <div className="assistant-column-divider" aria-hidden="true" />

                {/* Column 2: Ask & Assist */}
                <div className="assistant-column">
                  <div className="assistant-column-header">
                    <span className="assistant-col-tag">Ask &amp; Assist</span>
                  </div>
                  <div className="assistant-command-list">
                    <div className="assistant-command-item">
                      <span className="command-quote-mark">&ldquo;</span>
                      <p className="command-text">
                        Hey NAYRA, translate this sign into English.
                      </p>
                    </div>

                    <div className="assistant-command-item">
                      <span className="command-quote-mark">&ldquo;</span>
                      <p className="command-text">
                        Hey NAYRA, explain what I&apos;m looking at.
                      </p>
                    </div>

                    <div className="assistant-command-item">
                      <span className="command-quote-mark">&ldquo;</span>
                      <p className="command-text">
                        Hey NAYRA, help me understand this object.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─── RIGHT: 40–45% Glasses Image Area (Direct Blend, No Placeholder Boxes) ─── */}
          <div ref={imageRef} className="nayra-assistant-visual">
            {settings.glassesImage ? (
              <img
                src={settings.glassesImage}
                alt={settings.glassesImageAlt}
                className="assistant-glasses-img"
                loading="lazy"
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
