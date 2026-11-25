import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/animations'
import './FinalCtaSection.css'

export default function FinalCtaSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    const content = contentRef.current
    if (!el || !content) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const anim = gsap.fromTo(
      content,
      { opacity: 0, y: 32 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    )

    return () => {
      anim.kill()
    }
  }, [])

  return (
    <section ref={sectionRef} className="final-cta-section" id="cta" aria-label="NAYRA Vision">
      {/* Ambient Subtle Violet Glow */}
      <div className="final-cta-ambient" aria-hidden="true" />

      {/* Center-Aligned Minimalist Content */}
      <div ref={contentRef} className="final-cta-container">
        {/* Heading: Highlight only “natural.” in violet */}
        <h2 className="final-cta-heading">
          Technology that feels <span className="final-cta-violet">natural.</span>
        </h2>

        {/* Description */}
        <p className="final-cta-description">
          NAYRA brings vision, voice, and intelligence together in everyday eyewear.
        </p>

        {/* Supporting text */}
        <p className="final-cta-supporting">
          Designed to understand your surroundings, answer your questions, and make everyday experiences more accessible.
        </p>

        {/* Closing tagline: Highlight “See Beyond.” in violet */}
        <p className="final-cta-tagline">
          <span className="final-cta-violet-tag">See Beyond.</span> Experience More.
        </p>
      </div>

      {/* Subtle Glowing Violet Curved Line Along the Bottom */}
      <div className="final-cta-curve-wrap" aria-hidden="true">
        <svg
          viewBox="0 0 1440 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="final-cta-curve-svg"
        >
          <defs>
            <linearGradient id="ctaBottomCurveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0" />
              <stop offset="20%" stopColor="#8B5CF6" stopOpacity="0.35" />
              <stop offset="50%" stopColor="#C4B5FD" stopOpacity="0.85" />
              <stop offset="80%" stopColor="#8B5CF6" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
            </linearGradient>
            <filter id="ctaBottomCurveGlow" x="-10%" y="-40%" width="120%" height="180%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <path
            d="M-20,54 Q720,10 1460,54"
            stroke="url(#ctaBottomCurveGrad)"
            strokeWidth="1.75"
            filter="url(#ctaBottomCurveGlow)"
          />
        </svg>
      </div>
    </section>
  )
}
