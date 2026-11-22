import { useEffect, useRef } from 'react'
import { gsap } from '../../../lib/animations'
import './NayraEditorialSection.css'

export interface NayraEditorialSectionProps {
  id?: string
  /** Configurable source URL for portrait image 1 (Outdoor capture experience) */
  image1Src?: string
  image1Alt?: string
  /** Configurable source URL for portrait image 2 (Voice assistance interaction) */
  image2Src?: string
  image2Alt?: string
}

export default function NayraEditorialSection({
  id = 'editorial-features',
  image1Src = '/image/NAYRA_Mountain.webp',
  image1Alt = 'Person capturing an outdoor mountain experience with NAYRA smart glasses',
  image2Src = '/image/NAYRA_Cafe.webp',
  image2Alt = 'Person interacting with NAYRA in a cafe through intelligent voice assistance',
}: NayraEditorialSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const leftTextRef = useRef<HTMLDivElement>(null)
  const rightTextRef = useRef<HTMLDivElement>(null)
  const image1Ref = useRef<HTMLDivElement>(null)
  const image2Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const elements = [
      leftTextRef.current,
      image1Ref.current,
      image2Ref.current,
      rightTextRef.current,
    ].filter(Boolean)

    const ctx = gsap.context(() => {
      gsap.fromTo(
        elements,
        {
          opacity: 0,
          y: 28,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.14,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      )
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section id={id} ref={sectionRef} className="nayra-editorial-section" aria-label="NAYRA Storage and Intelligence">
      <div className="nayra-editorial-container">
        <div className="editorial-grid">
          {/* Column 1: Left Text Block (Top-Aligned on Desktop, Group 1 on Mobile) */}
          <div ref={leftTextRef} className="editorial-col editorial-col--text-left">
            <div className="editorial-text-wrap">
              <h2 className="editorial-heading">
                Built-In <span className="editorial-accent">Storage.</span>
              </h2>
              <p className="editorial-paragraph">
                Capture the moments that matter, hands-free. Store photos and videos directly on NAYRA, so your
                memories stay with you even when your phone isn't around.
              </p>
            </div>
          </div>

          {/* Column 2: Tall Portrait Image 1 (Outdoor capture experience) */}
          <div ref={image1Ref} className="editorial-col editorial-col--media-1">
            <div
              className="editorial-image-frame"
              role="img"
              aria-label={image1Alt}
            >
              {image1Src && (
                <img
                  src={image1Src}
                  alt={image1Alt}
                  className="editorial-img"
                  loading="lazy"
                  decoding="async"
                />
              )}
            </div>
          </div>

          {/* Column 3: Tall Portrait Image 2 (Voice assistance interaction) */}
          <div ref={image2Ref} className="editorial-col editorial-col--media-2">
            <div
              className="editorial-image-frame"
              role="img"
              aria-label={image2Alt}
            >
              {image2Src && (
                <img
                  src={image2Src}
                  alt={image2Alt}
                  className="editorial-img"
                  loading="lazy"
                  decoding="async"
                />
              )}
            </div>
          </div>

          {/* Column 4: Right Text Block (Bottom-Aligned on Desktop, Group 2 on Mobile) */}
          <div ref={rightTextRef} className="editorial-col editorial-col--text-right">
            <div className="editorial-text-wrap">
              <h2 className="editorial-heading">
                Intelligence, <span className="editorial-accent">Always Within Reach.</span>
              </h2>
              <p className="editorial-paragraph">
                From understanding your surroundings to answering questions in real time, NAYRA brings intelligent
                assistance into your everyday life. Just ask, and let NAYRA handle the rest.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
