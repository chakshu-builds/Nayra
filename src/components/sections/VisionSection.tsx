import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/animations'
import './VisionSection.css'

export default function VisionSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    const content = contentRef.current
    if (!el || !content) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        end: 'top 35%',
        scrub: 0.6,
      },
    })

    tl.fromTo(
      '.vision-eyebrow',
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.6 }
    )
      .fromTo(
        '.vision-headline',
        { opacity: 0, y: 36 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.4'
      )
      .fromTo(
        '.vision-description',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7 },
        '-=0.5'
      )

    return () => {
      tl.kill()
    }
  }, [])

  return (
    <section ref={sectionRef} className="vision-section" id="vision">
      <div className="vision-container">
        <div ref={contentRef} className="vision-content">
          <span className="vision-eyebrow">OUR VISION</span>
          <div className="vision-divider" />
          <h2 className="vision-headline">
            Technology should make life<br className="vision-br" />
            <span className="vision-highlight"> more accessible.</span>
          </h2>
          <p className="vision-description">
            Everyday experiences should not be limited by the barriers people face.
            NAYRA explores how intelligent perception and respectful hardware can
            provide subtle, natural assistance throughout daily life.
          </p>
        </div>
      </div>
    </section>
  )
}

