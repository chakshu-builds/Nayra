import { useEffect, useRef } from 'react'
import { animateSectionEnter } from '../../lib/animations'
import type { PillarItem } from '../../types'
import './MeetNayraSection.css'

const PILLARS: PillarItem[] = [
  {
    step: '01',
    name: 'SEE',
    label: 'Intelligent Vision',
    description:
      'Capture and interpret the surrounding environment through intelligent visual perception, mirroring natural human vision with high-fidelity sensory input.',
    metric: 'Real-Time Spatial Input',
  },
  {
    step: '02',
    name: 'UNDERSTAND',
    label: 'On-Device AI Engine',
    description:
      'Process visual and contextual information using AI. Neural architectures decode scenes, text, and environmental cues with instant semantic understanding.',
    metric: 'Sub-Millisecond Inference',
  },
  {
    step: '03',
    name: 'ASSIST',
    label: 'Contextual Guidance',
    description:
      'Deliver context-aware assistance that supports everyday activities through discreet acoustic feedback and intuitive, natural interaction.',
    metric: 'Seamless Daily Flow',
  },
]

export default function MeetNayraSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const cards = el.querySelectorAll('.pillar-card')
    const anim = animateSectionEnter(el, cards, {
      yOffset: 36,
      duration: 0.8,
      stagger: 0.18,
    })

    return () => {
      anim?.kill()
    }
  }, [])

  return (
    <section ref={sectionRef} className="meet-section" id="meet-nayra">
      <div className="meet-container">
        <header className="meet-header">
          <span className="meet-eyebrow">CORE ARCHITECTURE</span>
          <h2 className="meet-headline">More than wearable technology.</h2>
          <p className="meet-subtitle">
            A harmonious integration of intelligent perception, neural processing,
            and contextual support designed to elevate personal independence.
          </p>
        </header>

        <div className="pillars-grid">
          {PILLARS.map((pillar) => (
            <article key={pillar.name} className="pillar-card">
              <div className="pillar-card__top">
                <span className="pillar-step">{pillar.step}</span>
                <span className="pillar-badge">{pillar.name}</span>
              </div>
              <h3 className="pillar-title">{pillar.label}</h3>
              <p className="pillar-desc">{pillar.description}</p>
              <div className="pillar-footer">
                <span className="pillar-metric">{pillar.metric}</span>
                <span className="pillar-dot" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

