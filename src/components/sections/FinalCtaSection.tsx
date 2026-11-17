import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/animations'
import './FinalCtaSection.css'

export default function FinalCtaSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const anim = gsap.fromTo(
      '.final-cta-card',
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      }
    )

    return () => {
      anim.kill()
    }
  }, [])

  const handleScrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section ref={sectionRef} className="final-cta-section" id="cta">
      <div className="final-cta-container">
        <div className="final-cta-card">
          {/* Subtle Ambient Radial Purple Glow */}
          <div className="final-cta-glow" aria-hidden="true" />

          <div className="final-cta-content">
            <span className="final-cta-eyebrow">THE FUTURE OF ASSISTIVE VISION</span>
            <h2 className="final-cta-headline">
              A more accessible world starts with a new perspective.
            </h2>
            <p className="final-cta-text">
              Discover the possibilities of NAYRA.
            </p>
            <div className="final-cta-actions">
              <a
                href="#hero"
                className="btn btn--primary final-cta-btn"
                onClick={handleScrollToTop}
              >
                Explore NAYRA
                <span className="btn-arrow">↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

