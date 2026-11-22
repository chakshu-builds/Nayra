import { useEffect, useRef, useState } from 'react'
import { gsap } from '../../../lib/animations'
import type { BentoImpactCardItem } from '../../../types'
import { BentoCard } from './BentoCard'
import { VideoDetailModal } from './VideoDetailModal'
import './ImpactSection.css'

const BENTO_CARDS: BentoImpactCardItem[] = [
  {
    id: 'visual-intelligence',
    number: '01',
    category: '01 / VISUAL INTELLIGENCE',
    title: "See beyond what's visible",
    narrative:
      "A visually impaired person navigates a bustling street. As they approach potential obstacles—a utility pole and an elevated curb—NAYRA's onboard optical neural network detects the terrain in real time. The intelligent system computes precise spatial depth, projecting a dynamic bounding box and delivering directional acoustic guidance through open-ear audio temples, enabling confident movement without interruption.",
    keyPoints: [
      'Real-time obstacle detection & bounding box projection',
      'Sub-15ms low-latency edge AI processing',
      'Non-intrusive directional acoustic cues',
    ],
    audioSrc: '/Videos/obstacle-detection-audio-720p.mp4',
    sources: {
      webm_720: '/Videos/obstacle-detection-720p.webm',
      mp4_720: '/Videos/obstacle-detection-720p.mp4',
      webm_540: '/Videos/obstacle-detection-540p.webm',
      mp4_540: '/Videos/obstacle-detection-540p.mp4',
    },
    posterSrc: '/Videos/obstacle-detection-poster.webp',
    alt: 'Visually impaired person using NAYRA smart glasses to identify obstacles while walking',
  },
  {
    id: 'everyday-assistance',
    number: '02',
    category: '02 / EVERYDAY ASSISTANCE',
    title: 'Help, right when you need it',
    narrative:
      "An elderly gentleman searches for his prescribed medicine box on a dining table. Utilizing contextual scene memory and semantic object recognition, NAYRA identifies the exact object coordinates. A gentle, reassuring voice cue announces: 'Medicine box located on your front right, beside the water glass.' Restoring everyday autonomy and peace of mind with dignity.",
    keyPoints: [
      'Contextual visual memory and semantic search',
      'Everyday essential object localization',
      'Warm conversational voice assistance',
    ],
    audioSrc: '/Videos/medicine-assistance-audio-720p.mp4',
    sources: {
      webm_720: '/Videos/medicine-assistance-720p.webm',
      mp4_720: '/Videos/medicine-assistance-720p.mp4',
      webm_540: '/Videos/medicine-assistance-540p.webm',
      mp4_540: '/Videos/medicine-assistance-540p.mp4',
    },
    posterSrc: '/Videos/medicine-assistance-poster.webp',
    alt: 'Elderly man using NAYRA smart glasses to remember where he placed his medicines',
  },
  {
    id: 'personal-safety',
    number: '03',
    category: '03 / PERSONAL SAFETY',
    title: 'Your safety, within reach',
    narrative:
      "Navigating unfamiliar surroundings at night, a woman senses an immediate safety concern. With a subtle, discrete touch-and-hold interaction on the smart frame temple, she activates NAYRA's encrypted SOS protocol. The glasses instantly broadcast pinpoint GPS coordinates and live situational context to designated emergency contacts, confirming alert dispatch on her paired smartphone in seconds.",
    keyPoints: [
      'Discrete one-touch emergency activation',
      'End-to-end encrypted telemetry & GPS dispatch',
      'Instant paired smartphone confirmation',
    ],
    audioSrc: '/Videos/sos-safety-audio-720p.mp4',
    sources: {
      webm_720: '/Videos/sos-safety-720p.webm',
      mp4_720: '/Videos/sos-safety-720p.mp4',
      webm_540: '/Videos/sos-safety-540p.webm',
      mp4_540: '/Videos/sos-safety-540p.mp4',
    },
    posterSrc: '/Videos/sos-safety-poster.webp',
    alt: "Woman activating NAYRA smart glasses' SOS functionality and receiving smartphone confirmation",
  },
]

export default function ImpactSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const pinWrapperRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const [selectedCard, setSelectedCard] = useState<BentoImpactCardItem | null>(null)

  useEffect(() => {
    const section = sectionRef.current
    const pinWrapper = pinWrapperRef.current
    const header = headerRef.current
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[]

    if (!section || !pinWrapper || cards.length < 3) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    // Central GSAP MatchMedia for responsive scroll orchestration
    const mm = gsap.matchMedia()

    // ─── DESKTOP & TABLET (>= 768px): Pinned Bento Cluster Separation ───
    mm.add('(min-width: 768px)', () => {
      const cardLeft = cards[0]
      const cardCenter = cards[1]
      const cardRight = cards[2]

      if (!cardLeft || !cardCenter || !cardRight) return

      // Compute pixel shift once during initialization (zero layout recalculation during scrub)
      const stageEl = stageRef.current
      const gap = stageEl ? parseFloat(window.getComputedStyle(stageEl).gap) || 28 : 28
      const shift = cardLeft.offsetWidth + gap

      // Initial clustered fan state in center (2D hardware-accelerated transforms)
      gsap.set(cardLeft, {
        x: shift,
        rotate: -4.5,
        scale: 0.94,
        zIndex: 2,
        transformOrigin: 'center center',
      })
      gsap.set(cardCenter, {
        x: 0,
        rotate: 0,
        scale: 1,
        zIndex: 10,
        transformOrigin: 'center center',
      })
      gsap.set(cardRight, {
        x: -shift,
        rotate: 4.5,
        scale: 0.94,
        zIndex: 2,
        transformOrigin: 'center center',
      })

      // Main scrubbed separation timeline pinned to viewport
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: pinWrapper,
          scrub: 0.8,
          anticipatePin: 1,
        },
      })

      // Subtle initial fade-in of header elements
      if (header) {
        const headerReveals = header.querySelectorAll('.bento-header-reveal')
        if (headerReveals.length > 0) {
          tl.fromTo(
            headerReveals,
            { opacity: 0.85, y: 8 },
            { opacity: 1, y: 0, duration: 0.2, ease: 'power1.out' },
            0
          )
        }
      }

      // Synchronized separation into the 3-column Bento grid
      tl.to(
        cardLeft,
        {
          x: 0,
          rotate: 0,
          scale: 1,
          zIndex: 4,
          ease: 'power2.inOut',
          duration: 1,
        },
        0
      )
        .to(
          cardRight,
          {
            x: 0,
            rotate: 0,
            scale: 1,
            zIndex: 4,
            ease: 'power2.inOut',
            duration: 1,
          },
          0
        )
        .to(
          cardCenter,
          {
            scale: 1,
            zIndex: 4,
            ease: 'power2.inOut',
            duration: 1,
          },
          0
        )

      // Titles bloom into full prominence as cards separate (cached query)
      const titles = cards.map((c) => c.querySelector('.bento-card-title')).filter(Boolean)
      if (titles.length > 0) {
        tl.fromTo(
          titles,
          { opacity: 0.85 },
          { opacity: 1, duration: 0.8, ease: 'power1.out' },
          0.2
        )
      }
    })

    // ─── MOBILE (< 768px): Touch-Friendly Vertical Stack ───
    mm.add('(max-width: 767px)', () => {
      // Reset any desktop transforms
      cards.forEach((card) => {
        gsap.set(card, { clearProps: 'all' })
      })

      if (header) {
        gsap.fromTo(
          header.querySelectorAll('.bento-header-reveal'),
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: header,
              start: 'top 85%',
            },
          }
        )
      }

      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
            },
          }
        )
      })
    })

    return () => {
      mm.revert()
    }
  }, [])

  return (
    <section ref={sectionRef} className="bento-impact-section" id="impact">
      <div ref={pinWrapperRef} className="bento-pin-wrapper">
        <div className="bento-container">
          {/* ─── Opening Cinematic Brand Statement ─── */}
          <header ref={headerRef} className="bento-impact-header">
            <span className="bento-eyebrow bento-header-reveal">A MORE ACCESSIBLE WORLD</span>
            <h2 className="bento-tagline bento-header-reveal">
              The world is full of possibilities.<br />
              <span className="bento-tagline-highlight">Access should be too.</span>
            </h2>
            <p className="bento-lead bento-header-reveal">
              We&apos;re exploring how intelligent assistive technology can help make everyday
              experiences more accessible.
            </p>
          </header>

          {/* ─── Three Full-Bleed Video Bento Cards ─── */}
          <div ref={stageRef} className="bento-cards-stage">
            {BENTO_CARDS.map((card, idx) => (
              <div
                key={card.id}
                ref={(el) => {
                  cardRefs.current[idx] = el
                }}
                className={`bento-card-slot bento-card-slot--${card.id}`}
              >
                <BentoCard
                  card={card}
                  isModalOpen={selectedCard !== null}
                  onSelect={(c) => setSelectedCard(c)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Theatrical Video & Typewriter Explainer Modal ─── */}
      <VideoDetailModal
        key={selectedCard?.id ?? 'none'}
        card={selectedCard}
        cards={BENTO_CARDS}
        onClose={() => setSelectedCard(null)}
        onNavigate={(card) => setSelectedCard(card)}
      />
    </section>
  )
}
