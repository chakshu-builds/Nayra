import { useState, useRef, useEffect } from 'react'
import { animateSectionEnter } from '../../../lib/animations'
import './NayraSpecificationsSection.css'

interface SpecItem {
  id: string
  label: string
  value?: string
  expandable?: boolean
  details?: string
}

interface SpecColumn {
  title: string
  items: SpecItem[]
}

const SPEC_COLUMNS: SpecColumn[] = [
  {
    title: 'Design & Dimensions',
    items: [
      { id: 'c1-1', label: 'Product', value: 'NAYRA AI Smart Glasses' },
      { id: 'c1-2', label: 'Form Factor', value: 'Wearable smart eyewear' },
      { id: 'c1-3', label: 'Frame Style', value: 'Transparent' },
      { id: 'c1-4', label: 'Temple Design', value: 'Integrated electronics housing' },
      { id: 'c1-5', label: 'Camera Placement', value: 'Dual front-facing cameras' },
      { id: 'c1-6', label: 'Fit', value: 'Ergonomic eyewear design' },
    ],
  },
  {
    title: 'Hardware',
    items: [
      {
        id: 'c2-1',
        label: 'Processor',
        value: 'Rockchip RV1106 (proposed)',
        expandable: true,
        details: 'Evaluated for dedicated low-power edge neural network acceleration and camera sensor pipeline control.',
      },
      {
        id: 'c2-2',
        label: 'AI Processing',
        value: 'Hybrid Edge AI + Cloud',
        expandable: true,
        details: 'NAYRA balances instant responsiveness via lightweight local edge processing with advanced multimodal reasoning hosted securely in cloud or paired mobile infrastructure.',
      },
      { id: 'c2-3', label: 'Cameras', value: 'Dual camera modules' },
      { id: 'c2-4', label: 'Motion Sensor', value: 'IMU (proposed)' },
      { id: 'c2-5', label: 'Microphones', value: 'Integrated audio input' },
      { id: 'c2-6', label: 'Audio Output', value: 'Integrated micro-speaker' },
      { id: 'c2-7', label: 'Internal Storage', value: '32GB (target)' },
    ],
  },
  {
    title: 'Vision & AI',
    items: [
      {
        id: 'c3-1',
        label: 'Scene Understanding',
        expandable: true,
        details: 'Real-time contextual visual segmentation to identify spatial geometry, hazards, and surrounding environments.',
      },
      { id: 'c3-2', label: 'Object Recognition' },
      {
        id: 'c3-3',
        label: 'Text Recognition (OCR)',
        expandable: true,
        details: 'Extracts printed and digital typography from signs, menus, documents, and transit boards for audio vocalization.',
      },
      { id: 'c3-4', label: 'Voice Interaction' },
      { id: 'c3-5', label: 'Contextual Assistance' },
      { id: 'c3-6', label: 'Image Capture' },
      { id: 'c3-7', label: 'Video Capture' },
      { id: 'c3-8', label: 'AI-Powered Responses' },
    ],
  },
  {
    title: 'Connectivity & Experience',
    items: [
      { id: 'c4-1', label: 'Wireless Connectivity', value: 'Wi-Fi / Bluetooth (planned)' },
      {
        id: 'c4-2',
        label: 'Smartphone Integration',
        expandable: true,
        details: 'Seamless pairing with iOS and Android companion apps for telemetry, system configuration, and data synchronization.',
      },
      { id: 'c4-3', label: 'Hands-Free Operation' },
      { id: 'c4-4', label: 'Voice Commands' },
      { id: 'c4-5', label: 'Audio Feedback' },
      {
        id: 'c4-6',
        label: 'Connected AI Processing',
        expandable: true,
        details: 'Dynamic offloading architecture optimized for minimal latency and long battery life.',
      },
      { id: 'c4-7', label: 'Accessibility-Focused Experience' },
      { id: 'c4-8', label: 'Software Updates', value: 'Planned' },
    ],
  },
  {
    title: 'Capabilities',
    items: [
      { id: 'c5-1', label: 'See', value: 'Understand surroundings' },
      { id: 'c5-2', label: 'Understand', value: 'Interpret visual information' },
      { id: 'c5-3', label: 'Assist', value: 'Respond to user requests' },
      { id: 'c5-4', label: 'Read', value: 'Recognize printed text' },
      { id: 'c5-5', label: 'Capture', value: 'Photos and videos' },
      { id: 'c5-6', label: 'Listen', value: 'Voice command input' },
      { id: 'c5-7', label: 'Respond', value: 'Audio-based assistance' },
      {
        id: 'c5-8',
        label: 'Navigation Assistance',
        value: 'Planned',
        expandable: true,
        details: 'Directional spatial audio cues and proximity warnings to assist users with obstacle avoidance and outdoor navigation.',
      },
    ],
  },
]

interface NayraSpecificationsSectionProps {
  id?: string
}

export default function NayraSpecificationsSection({ id = 'specifications' }: NayraSpecificationsSectionProps) {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})
  const sectionRef = useRef<HTMLElement>(null)

  const toggleExpand = (itemId: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }))
  }

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const cols = el.querySelectorAll('.spec-column')
    const anim = animateSectionEnter(el, cols, {
      yOffset: 24,
      duration: 0.7,
      stagger: 0.1,
    })

    return () => {
      anim?.kill()
    }
  }, [])

  return (
    <section ref={sectionRef} className="spec-section" id={id}>
      <div className="spec-container">
        {/* Section Header */}
        <header className="spec-header">
          <h2 className="spec-headline">Detailed specifications.</h2>
          <p className="spec-subtitle">
            A comprehensive overview of NAYRA’s ergonomic architecture, edge-compute hardware,
            and intelligent perception capabilities.
          </p>
        </header>

        {/* 5-Column Editorial Specifications Grid */}
        <div className="spec-grid">
          {SPEC_COLUMNS.map((column, colIdx) => (
            <div key={column.title} className="spec-column">
              <h3 className="spec-col-title">
                <span className="spec-col-index">0{colIdx + 1}</span>
                {column.title}
              </h3>

              <div className="spec-col-list">
                {column.items.map((item) => {
                  const isExpanded = !!expandedItems[item.id]

                  return (
                    <div
                      key={item.id}
                      className={`spec-row ${item.expandable ? 'spec-row--expandable' : ''} ${
                        isExpanded ? 'spec-row--expanded' : ''
                      }`}
                      onClick={item.expandable ? () => toggleExpand(item.id) : undefined}
                      role={item.expandable ? 'button' : undefined}
                      tabIndex={item.expandable ? 0 : undefined}
                      onKeyDown={
                        item.expandable
                          ? (e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault()
                                toggleExpand(item.id)
                              }
                            }
                          : undefined
                      }
                      aria-expanded={item.expandable ? isExpanded : undefined}
                    >
                      <div className="spec-row__main">
                        <div className="spec-row__content">
                          <span className="spec-row__label">{item.label}</span>
                          {item.value && (
                            <span className="spec-row__value">{item.value}</span>
                          )}
                        </div>

                        {item.expandable && (
                          <span className="spec-row__chevron" aria-hidden="true">
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="6 9 12 15 18 9" />
                            </svg>
                          </span>
                        )}
                      </div>

                      {item.expandable && (
                        <div className={`spec-row__details ${isExpanded ? 'is-visible' : ''}`}>
                          <p>{item.details}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
