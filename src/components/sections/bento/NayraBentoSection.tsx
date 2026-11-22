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

const BENTO_IMAGE_CONFIG: BentoImageConfig = {
  nayraHero: '/image/NAYRA_Transparent_Temples.webp',
  rv1106Processor: '/image/NAYRA_RV1106_Chip_Banner.webp',
  dualCameras: '/image/NAYRA_Camera_Lavender.webp',
  openEarAudio: '/image/NAYRA_Open_Ear_Audio.webp',
  powerArchitecture: '/image/NAYRA_Power_Architecture.webp',
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
    badge?: string
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
    title: 'Powered by Rockchip RV1106',
    description: 'Edge AI Processor for real-time, on-device AI.',
    imageAlt: 'Rockchip RV1106 processor',
  },
  cameraCard: {
    title: 'Dual Cameras',
    description: 'Capture, understand and interpret your world in real time.',
    imageAlt: 'NAYRA dual cameras',
  },
  audioCard: {
    title: 'Open-Ear Audio',
    description: 'Directional speakers for clear, immersive sound without blocking your ears.',
    imageAlt: 'NAYRA open-ear audio',
  },
  powerCard: {
    title: 'All-Day Power',
    description: '1000 mAh battery with efficient power management for 3 – 5 hours of use.',
    imageAlt: 'NAYRA all-day power architecture',
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
          <h2 className="nayra-bento-heading nayra-bento-reveal">
            Engineered for effortless everyday assistance.
          </h2>
          <p className="nayra-bento-subtext nayra-bento-reveal">
            A cohesive hardware and software foundation designed around perception, intelligence, and comfort.
          </p>
        </header>

        {/* Exactly 5 Cards Bento Grid: Asymmetric Layout with Full-Width Bottom Banner */}
        <div ref={gridRef} className="nayra-bento-grid">
          {/* ─── CARD 1: Large Left Hero Card (~40% Width, Spanning Rows 1 & 2) ─── */}
          <article className="bento-item bento-item--glasses">
            {/* Top: Header */}
            <div className="bento-glasses-header">
              <span className="bento-glasses-brand">
                NAYRA<span className="bento-brand-dot">.</span>
              </span>
              <h3 className="bento-glasses-title">
                More Than <span className="bento-title-accent">Glasses.</span>
              </h3>
              <p className="bento-glasses-desc">{content.glassesCard.description}</p>
            </div>

            {/* Middle: Glasses Hero Image */}
            <div className="bento-glasses-media">
              {images.nayraHero && (
                <img
                  src={images.nayraHero}
                  alt={content.glassesCard.imageAlt}
                  className="bento-glasses-img"
                  loading="lazy"
                />
              )}
            </div>

            {/* Bottom: Feature Bar with Dividers */}
            <div className="bento-glasses-pillars">
              <div className="bento-pillar-item">
                <svg className="pillar-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                  <circle cx="12" cy="13" r="3" />
                </svg>
                <span className="pillar-label">See</span>
              </div>
              <div className="pillar-divider" aria-hidden="true" />
              <div className="bento-pillar-item">
                <svg className="pillar-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M17 5v14M7 5v14M2 9v6M22 9v6" />
                </svg>
                <span className="pillar-label">Hear</span>
              </div>
              <div className="pillar-divider" aria-hidden="true" />
              <div className="bento-pillar-item">
                <svg className="pillar-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a6 6 0 0 0-6 6c0 2.5 1.5 4.5 3 6v2a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-2c1.5-1.5 3-3.5 3-6a6 6 0 0 0-6-6Z" />
                  <path d="M9 22h6" />
                </svg>
                <span className="pillar-label">Understand</span>
              </div>
              <div className="pillar-divider" aria-hidden="true" />
              <div className="bento-pillar-item">
                <svg className="pillar-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m13 2-8 12h7l-2 8 8-12h-7l2-8z" />
                </svg>
                <span className="pillar-label">Assist</span>
              </div>
            </div>
          </article>

          {/* ─── CARD 2: Powered by Rockchip RV1106 (Top-Right Slot — Wide Card Spanning Top Right) ─── */}
          <article className="bento-item bento-item--chip">
            {/* Left: Content */}
            <div className="bento-chip-content">
              <div className="bento-chip-icon-box" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                  <rect x="9" y="9" width="6" height="6" />
                  <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
                </svg>
              </div>
              <h3 className="bento-chip-title">
                Powered by<br />Rockchip RV1106
              </h3>
              <p className="bento-chip-desc">{content.chipCard.description}</p>
            </div>

            {/* Right: Graphic */}
            <div className="bento-chip-media">
              {images.rv1106Processor && (
                <img
                  src={images.rv1106Processor}
                  alt={content.chipCard.imageAlt}
                  className="bento-chip-img"
                  loading="lazy"
                />
              )}
            </div>
          </article>

          {/* ─── CARD 3: Dual Cameras (Bottom-Right Col 1) ─── */}
          <article className="bento-item bento-item--sub bento-item--camera">
            <div className="bento-sub-media">
              {images.dualCameras && (
                <img
                  src={images.dualCameras}
                  alt={content.cameraCard.imageAlt}
                  className="bento-sub-img bento-sub-img--camera"
                  loading="lazy"
                />
              )}
            </div>
            <div className="bento-sub-footer">
              <div className="bento-sub-icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                  <circle cx="12" cy="13" r="3" />
                </svg>
              </div>
              <h3 className="bento-sub-title">{content.cameraCard.title}</h3>
              <p className="bento-sub-desc">{content.cameraCard.description}</p>
            </div>
          </article>

          {/* ─── CARD 4: Open-Ear Audio (Bottom-Right Col 2) ─── */}
          <article className="bento-item bento-item--sub bento-item--audio">
            <div className="bento-sub-media">
              {images.openEarAudio && (
                <img
                  src={images.openEarAudio}
                  alt={content.audioCard.imageAlt}
                  className="bento-sub-img bento-sub-img--audio"
                  loading="lazy"
                />
              )}
            </div>
            <div className="bento-sub-footer">
              <div className="bento-sub-icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </svg>
              </div>
              <h3 className="bento-sub-title">{content.audioCard.title}</h3>
              <p className="bento-sub-desc">{content.audioCard.description}</p>
            </div>
          </article>

          {/* ─── CARD 5: All-Day Power (Bottom-Right Col 3) ─── */}
          <article className="bento-item bento-item--sub bento-item--power">
            <div className="bento-sub-media">
              {images.powerArchitecture && (
                <img
                  src={images.powerArchitecture}
                  alt={content.powerCard.imageAlt}
                  className="bento-sub-img bento-sub-img--power"
                  loading="lazy"
                />
              )}
            </div>
            <div className="bento-sub-footer">
              <div className="bento-sub-icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="16" height="10" rx="2" ry="2" />
                  <line x1="22" y1="11" x2="22" y2="13" />
                  <path d="m11 9-3 3h4l-3 3" />
                </svg>
              </div>
              <h3 className="bento-sub-title">{content.powerCard.title}</h3>
              <p className="bento-sub-desc">{content.powerCard.description}</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
