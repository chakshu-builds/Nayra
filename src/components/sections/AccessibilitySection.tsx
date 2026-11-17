import { useEffect, useRef } from 'react'
import { animateSectionEnter } from '../../lib/animations'
import type { AccessibilityUseCase } from '../../types'
import './AccessibilitySection.css'

const USE_CASES: AccessibilityUseCase[] = [
  {
    tag: 'PERCEPTION',
    title: 'Visual Assistance',
    summary: 'Help users with visual impairments better understand their surroundings.',
    details:
      'Real-time scene interpretation identifies key objects, reads signs and printed documents, and provides spatial navigation cues through subtle acoustic guidance.',
    iconSvg: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    tag: 'RECALL',
    title: 'Memory Support',
    summary: 'Support everyday reminders and contextual memory assistance.',
    details:
      'Discreet notifications recall familiar faces, appointments, and task sequences, helping users maintain confidence and personal autonomy in daily interactions.',
    iconSvg: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
  {
    tag: 'AUDIO TRANSLATION',
    title: 'Hearing Assistance',
    summary: 'Explore contextual sound information and visual notifications for users with hearing difficulties.',
    details:
      'Translates ambient auditory signals like doorbells, alarms, and speech into subtle haptic patterns and visual alerts within peripheral awareness.',
    iconSvg: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M11 5L6 9H2v6h4l5 4V5z" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      </svg>
    ),
  },
  {
    tag: 'AWARENESS',
    title: 'Everyday Safety',
    summary: 'Provide useful environmental awareness and safety-related assistance.',
    details:
      'Detects low obstacles, approaching hazards, crosswalk signals, and changes in terrain, offering gentle proximity warnings that enhance outdoor mobility.',
    iconSvg: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
]

export default function AccessibilitySection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const items = el.querySelectorAll('.access-card')
    const anim = animateSectionEnter(el, items, {
      yOffset: 32,
      duration: 0.8,
      stagger: 0.15,
    })

    return () => {
      anim?.kill()
    }
  }, [])

  return (
    <section ref={sectionRef} className="access-section" id="accessibility">
      <div className="access-container">
        <header className="access-header">
          <span className="access-eyebrow">HUMAN-CENTERED DESIGN</span>
          <h2 className="access-headline">Designed for accessibility.</h2>
          <p className="access-desc">
            Technology is most powerful when it bridges lived experiences. NAYRA is engineered
            with authentic, respectful functionality that supports everyday human capability.
          </p>
        </header>

        <div className="access-grid">
          {USE_CASES.map((uc) => (
            <article key={uc.title} className="access-card">
              <div className="access-card__header">
                <div className="access-card__icon">{uc.iconSvg}</div>
                <span className="access-card__tag">{uc.tag}</span>
              </div>
              <h3 className="access-card__title">{uc.title}</h3>
              <p className="access-card__summary">{uc.summary}</p>
              <p className="access-card__details">{uc.details}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

