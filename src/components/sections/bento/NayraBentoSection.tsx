import { useEffect, useRef } from 'react'
import { gsap } from '../../../lib/animations'
import './NayraBentoSection.css'

/**
 * Centralized image configuration for NAYRA 5-Card Bento Grid.
 * Preconfigured with high-fidelity vector renders matching the design screenshot.
 * Custom images can be provided via props to replace any slot.
 */
export interface BentoImageConfig {
  nayraHero: string
  rv1106Processor: string
  dualCameras: string
  openEarAudio: string
  powerArchitecture: string
}

export const BENTO_IMAGE_CONFIG: BentoImageConfig = {
  nayraHero: '/bento/nayra-glasses-render.svg',
  rv1106Processor: '/bento/rv1106-chip-render.svg',
  dualCameras: '/bento/dual-cameras-render.svg',
  openEarAudio: '/bento/open-ear-audio-render.svg',
  powerArchitecture: '/bento/power-architecture-render.svg',
}

export interface BentoCardData {
  glassesCard: {
    brand: string
    subtitle: string
    title: string
    description: string
    imageAlt: string
    features: Array<{
      label: string
      icon: 'see' | 'hear' | 'understand' | 'assist'
    }>
  }
  chipCard: {
    badge: string
    title: string
    description: string
    imageAlt: string
    specs?: string[]
  }
  cameraCard: {
    title: string
    description: string
    imageAlt: string
  }
  audioCard: {
    title: string
    description: string
    imageAlt: string
  }
  powerCard: {
    title: string
    description: string
    imageAlt: string
  }
}

const DEFAULT_BENTO_DATA: BentoCardData = {
  glassesCard: {
    brand: 'NAYRA.',
    subtitle: 'THE AI SMART GLASSES',
    title: 'More Than Glasses.',
    description: 'Your everyday AI companion.',
    imageAlt: 'NAYRA AI smart glasses',
    features: [
      { label: 'See', icon: 'see' },
      { label: 'Hear', icon: 'hear' },
      { label: 'Understand', icon: 'understand' },
      { label: 'Assist', icon: 'assist' },
    ],
  },
  chipCard: {
    badge: 'EDGE AI NPU',
    title: 'Powered by Rockchip RV1106',
    description:
      'An edge AI processing core designed for lightweight local intelligence, working alongside connected AI services for advanced capabilities.',
    imageAlt: 'Rockchip RV1106 processor',
    specs: [
      'Edge AI Processing',
      'Lightweight On-Device Inference',
      'Connected AI Architecture',
    ],
  },
  cameraCard: {
    title: 'Dual Cameras',
    description: 'See more. Understand your surroundings.',
    imageAlt: 'NAYRA dual cameras',
  },
  audioCard: {
    title: 'Open-Ear Audio',
    description: 'Clear audio responses while staying aware of your surroundings.',
    imageAlt: 'NAYRA open-ear audio',
  },
  powerCard: {
    title: 'Power Architecture',
    description: 'Compact power management for everyday assistance.',
    imageAlt: 'NAYRA power architecture',
  },
}

interface NayraBentoSectionProps {
  id?: string
  data?: Partial<BentoCardData>
  images?: Partial<BentoImageConfig>
}

export default function NayraBentoSection({
  id = 'meet-nayra',
  data = {},
  images: customImages = {},
}: NayraBentoSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  const content = {
    ...DEFAULT_BENTO_DATA,
    ...data,
  }

  const images: BentoImageConfig = {
    ...BENTO_IMAGE_CONFIG,
    ...customImages,
  }

  useEffect(() => {
    const el = sectionRef.current
    const grid = gridRef.current
    if (!el || !grid) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const cards = grid.querySelectorAll('.bento-item')
    const headerItems = el.querySelectorAll('.nayra-bento-reveal')

    const ctx = gsap.context(() => {
      if (headerItems.length > 0) {
        gsap.fromTo(
          headerItems,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      }

      gsap.fromTo(
        cards,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: grid,
            start: 'top 82%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="nayra-bento-section" id={id}>
      <div className="nayra-bento-container">
        {/* Section Header */}
        <header className="nayra-bento-header">
          <span className="nayra-bento-eyebrow nayra-bento-reveal">INTELLIGENT SYSTEM ARCHITECTURE</span>
          <h2 className="nayra-bento-heading nayra-bento-reveal">
            Engineered for effortless everyday assistance.
          </h2>
          <p className="nayra-bento-subtext nayra-bento-reveal">
            A cohesive hardware and software foundation designed around perception, intelligence, and comfort.
          </p>
        </header>

        {/* Exactly 5 Cards Bento Grid (40% Left / 60% Right) */}
        <div ref={gridRef} className="nayra-bento-grid">
          {/* ─── CARD 1: Large Left Card (~40% Width, Spanning Both Rows) ─── */}
          <article className="bento-item bento-item--glasses">
            {/* Top: Main hero text */}
            <div className="bento-glasses-header">
              <span className="bento-glasses-subtitle">{content.glassesCard.subtitle}</span>
              <h3 className="bento-glasses-title">{content.glassesCard.title}</h3>
              <p className="bento-glasses-desc">{content.glassesCard.description}</p>
            </div>

            {/* Middle: Directly centered hero image (no nested box or placeholder shapes) */}
            <div className="bento-hero-media">
              {images.nayraHero ? (
                <img
                  src={images.nayraHero}
                  alt={content.glassesCard.imageAlt}
                  className="bento-hero-img"
                  loading="lazy"
                />
              ) : null}
            </div>

            {/* Bottom: Feature labels at the bottom */}
            <div className="bento-glasses-pillars">
              <div className="bento-pillar-pill">
                <span className="pillar-icon-dot">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </span>
                <span className="pillar-label">See</span>
              </div>

              <div className="bento-pillar-pill">
                <span className="pillar-icon-dot">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                  </svg>
                </span>
                <span className="pillar-label">Hear</span>
              </div>

              <div className="bento-pillar-pill">
                <span className="pillar-icon-dot">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a6 6 0 0 0-6 6c0 2.5 1.5 4.5 3 6v2a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-2c1.5-1.5 3-3.5 3-6a6 6 0 0 0-6-6Z" />
                    <path d="M9 22h6" />
                  </svg>
                </span>
                <span className="pillar-label">Understand</span>
              </div>

              <div className="bento-pillar-pill">
                <span className="pillar-icon-dot">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3v18" />
                    <path d="M3 12h18" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </span>
                <span className="pillar-label">Assist</span>
              </div>
            </div>
          </article>

          {/* ─── CARD 2: Wide Horizontal Card on Top Right (~60% Width, Row 1) ─── */}
          <article className="bento-item bento-item--chip">
            {/* Left: Processor text */}
            <div className="bento-chip-content">
              <h3 className="bento-chip-title">
                Powered by Rockchip<br />RV1106
              </h3>
              <p className="bento-chip-desc">{content.chipCard.description}</p>
              
              {content.chipCard.specs && (
                <div className="bento-chip-tags">
                  {content.chipCard.specs.map((spec, i) => (
                    <span key={i} className="chip-tag-pill">
                      <span className="chip-tag-dot" />
                      {spec}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Directly integrated processor image area (no nested box or placeholder shapes) */}
            <div className="bento-chip-media">
              {images.rv1106Processor ? (
                <img
                  src={images.rv1106Processor}
                  alt={content.chipCard.imageAlt}
                  className="bento-chip-img"
                  loading="lazy"
                />
              ) : null}
            </div>
          </article>

          {/* ─── CARD 3: Dual Cameras (Text & Icon at Top, Media at Bottom) ─── */}
          <article className="bento-item bento-item--component bento-item--camera">
            {/* Top: Icon and Text */}
            <div className="bento-component-header">
              <div className="bento-component-icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                  <circle cx="12" cy="13" r="3" />
                </svg>
              </div>
              <h3 className="bento-component-title">{content.cameraCard.title}</h3>
              <p className="bento-component-desc">{content.cameraCard.description}</p>
            </div>

            {/* Bottom: Media Area peeking from bottom */}
            <div className="bento-component-media">
              {images.dualCameras ? (
                <img
                  src={images.dualCameras}
                  alt={content.cameraCard.imageAlt}
                  className="bento-component-img"
                  loading="lazy"
                />
              ) : null}
            </div>
          </article>

          {/* ─── CARD 4: Open-Ear Audio (Text & Icon at Top, Media at Bottom) ─── */}
          <article className="bento-item bento-item--component bento-item--audio">
            {/* Top: Icon and Text */}
            <div className="bento-component-header">
              <div className="bento-component-icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </svg>
              </div>
              <h3 className="bento-component-title">{content.audioCard.title}</h3>
              <p className="bento-component-desc">{content.audioCard.description}</p>
            </div>

            {/* Bottom: Media Area peeking from bottom */}
            <div className="bento-component-media">
              {images.openEarAudio ? (
                <img
                  src={images.openEarAudio}
                  alt={content.audioCard.imageAlt}
                  className="bento-component-img"
                  loading="lazy"
                />
              ) : null}
            </div>
          </article>

          {/* ─── CARD 5: Power Architecture (Text & Icon at Top, Media at Bottom) ─── */}
          <article className="bento-item bento-item--component bento-item--power">
            {/* Top: Icon and Text */}
            <div className="bento-component-header">
              <div className="bento-component-icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="16" height="10" rx="2" ry="2" />
                  <line x1="22" y1="11" x2="22" y2="13" />
                  <path d="m11 9-3 3h4l-3 3" />
                </svg>
              </div>
              <h3 className="bento-component-title">{content.powerCard.title}</h3>
              <p className="bento-component-desc">{content.powerCard.description}</p>
            </div>

            {/* Bottom: Media Area peeking from bottom */}
            <div className="bento-component-media">
              {images.powerArchitecture ? (
                <img
                  src={images.powerArchitecture}
                  alt={content.powerCard.imageAlt}
                  className="bento-component-img"
                  loading="lazy"
                />
              ) : null}
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
