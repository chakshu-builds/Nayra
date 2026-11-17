import { useEffect, useRef } from 'react'
import { animateSectionEnter } from '../../lib/animations'
import type { TechDomain } from '../../types'
import './TechnologySection.css'

const TECH_DOMAINS: TechDomain[] = [
  {
    category: 'OPTICS',
    title: 'Visual Perception',
    description:
      'High-dynamic-range foveal optical sensors capture environmental geometry, ambient illumination, and motion vectors with low optical distortion.',
  },
  {
    category: 'ACOUSTICS',
    title: 'Audio Input & Output',
    description:
      'Beamforming microphone arrays filter out ambient clutter while directional acoustic transducers deliver crisp, private synthetic feedback without blocking natural ear canals.',
  },
  {
    category: 'COMPUTE',
    title: 'On-Device Processing',
    description:
      'Dedicated low-power embedded coprocessor handles immediate sensor fusion, motion calibration, and power management with thermal equilibrium.',
  },
  {
    category: 'INTELLIGENCE',
    title: 'AI Inference',
    description:
      'Quantized multimodal neural networks operate with sub-millisecond local latency, ensuring high-speed classification and private user data residency.',
  },
  {
    category: 'WIRELESS',
    title: 'Connectivity',
    description:
      'Low-latency Bluetooth 5.3 and ultra-efficient wireless protocols maintain steady, secure synchronization with companion devices and cloud knowledge bases.',
  },
  {
    category: 'EXPERIENCE',
    title: 'Contextual Assistance',
    description:
      'Context-aware state machine predicts user intent, transforming continuous perceptual streams into timely, non-intrusive micro-guidance.',
  },
]

export default function TechnologySection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const cards = el.querySelectorAll('.tech-item')
    const anim = animateSectionEnter(el, cards, {
      yOffset: 30,
      duration: 0.75,
      stagger: 0.12,
    })

    return () => {
      anim?.kill()
    }
  }, [])

  return (
    <section ref={sectionRef} className="tech-section" id="technology">
      <div className="tech-container">
        <header className="tech-header">
          <span className="tech-eyebrow">SYSTEM ARCHITECTURE</span>
          <h2 className="tech-headline">Intelligence designed around you.</h2>
          <p className="tech-subtitle">
            A cohesive hardware and software foundation engineered to deliver
            subtle, continuous assistance without intrusive complexity.
          </p>
        </header>

        <div className="tech-matrix">
          {TECH_DOMAINS.map((item, index) => (
            <div key={item.title} className="tech-item">
              <div className="tech-item__top">
                <span className="tech-item__index">0{index + 1}</span>
                <span className="tech-item__cat">{item.category}</span>
              </div>
              <h3 className="tech-item__title">{item.title}</h3>
              <p className="tech-item__desc">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

