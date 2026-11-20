import { useEffect, useRef } from 'react'
import { gsap } from '../../../lib/animations'
import './NayraAssistantSection.css'

export interface VoicePromptItem {
  query: string
  context?: string
}

export interface VoicePromptGroup {
  wakeWord: string
  prompts: VoicePromptItem[]
}

export interface ArchitectureModule {
  code: string
  name: string
  status: string
  badgeVariant?: 'developed' | 'implemented' | 'pending'
}

export interface NayraAssistantConfig {
  title: string
  coreIdea: string
  voicePrompts: VoicePromptGroup[]
  architecture: ArchitectureModule[]
  devNote: string
  glassesImage?: string
  glassesImageAlt?: string
}

export const DEFAULT_ASSISTANT_CONFIG: NayraAssistantConfig = {
  title: 'NAYRA — AI-Powered Assistive Smart Glasses',
  coreIdea:
    'Gives blind and visually impaired individuals real-time, contextual audio assistance so they can identify objects, read signs, recognize familiar people, and navigate obstacles more independently. It is an integrated assistive vision platform, not just an object detector or OCR reader.',
  voicePrompts: [
    {
      wakeWord: 'Say "Hey NAYRA"',
      prompts: [
        {
          query: 'Who is standing right in front of me?',
          context: 'Familiar person recognition + relationship context',
        },
        {
          query: 'What obstacle is ahead, and how far is it?',
          context: 'Object detection, ByteTrack tracking & spatial depth estimation',
        },
        {
          query: 'Read this signboard or label in English or Hindi.',
          context: 'Hindi & English OCR',
        },
      ],
    },
    {
      wakeWord: 'Say "Hey Siri / Google"',
      prompts: [
        {
          query: 'Read my last message and reply with "Sounds good, thanks!"',
        },
        {
          query: 'Remind me about my 3 PM Thursday meeting.',
        },
        {
          query: 'Give me a quick summary of what\'s around me.',
        },
      ],
    },
  ],
  architecture: [
    { code: '01', name: 'Camera Input', status: 'Developed', badgeVariant: 'developed' },
    { code: '02', name: 'Camera Management', status: 'Developed', badgeVariant: 'developed' },
    { code: '03', name: 'Object Detection (YOLOv10 ONNX)', status: 'Developed', badgeVariant: 'developed' },
    { code: '04', name: 'Object Tracking (ByteTrack)', status: 'Developed', badgeVariant: 'developed' },
    { code: '05', name: 'Spatial Awareness (Depth Estimation)', status: 'Developed', badgeVariant: 'developed' },
    { code: '06', name: 'Familiar Person Recognition', status: 'Developed', badgeVariant: 'developed' },
    { code: '06 Extension', name: 'Personal Context Database', status: 'Implemented', badgeVariant: 'implemented' },
    { code: '07', name: 'Hindi + English OCR', status: 'PoCs complete; integration pending', badgeVariant: 'pending' },
  ],
  devNote:
    'Tested on an NVIDIA RTX 4050 Laptop GPU with ONNX Runtime and CUDA acceleration. Software perception modules are being developed and tested, while full wearable hardware, integrated real-time experience, and user-level safety validation are still in progress.',
  // Open/blank space reserved for specs image (clean placeholder ready to drop image into later)
  glassesImage: '',
  glassesImageAlt: 'NAYRA Assistive Smart Glasses hardware specifications',
}

interface NayraAssistantSectionProps {
  id?: string
  config?: Partial<NayraAssistantConfig>
}

export default function NayraAssistantSection({
  id = 'ai-assistant',
  config = {},
}: NayraAssistantSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const slotRef = useRef<HTMLDivElement>(null)

  const data: NayraAssistantConfig = {
    ...DEFAULT_ASSISTANT_CONFIG,
    ...config,
  }

  useEffect(() => {
    const section = sectionRef.current
    const content = contentRef.current
    if (!section || !content) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const reveals = content.querySelectorAll('.asst-reveal')
    const slotEl = slotRef.current

    const ctx = gsap.context(() => {
      if (reveals.length > 0) {
        gsap.fromTo(
          reveals,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 82%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      }

      if (slotEl) {
        gsap.fromTo(
          slotEl,
          { opacity: 0, scale: 0.98 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      }
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="nayra-assistant-section" id={id} aria-label="NAYRA Assistive Smart Glasses">
      <div className="nayra-assistant-container">
        <div className="nayra-assistant-grid">
          {/* ─── LEFT: Content & Information ─── */}
          <div ref={contentRef} className="nayra-assistant-left">
            {/* Header: Title & Core Idea */}
            <header className="assistant-header asst-reveal">
              <span className="assistant-badge">ASSISTIVE VISION INTELLIGENCE</span>
              <h2 className="assistant-title">{data.title}</h2>
              <p className="assistant-core-idea">{data.coreIdea}</p>
            </header>

            {/* Sample Voice Prompts */}
            <div className="assistant-block asst-reveal">
              <h3 className="assistant-block-title">Sample Voice Prompts</h3>
              <div className="voice-prompts-grid">
                {data.voicePrompts.map((group, idx) => (
                  <div key={idx} className="voice-prompt-group">
                    <span className="wake-word-tag">{group.wakeWord}</span>
                    <ul className="prompt-items-list">
                      {group.prompts.map((item, pIdx) => (
                        <li key={pIdx} className="prompt-item">
                          <span className="prompt-quote">&ldquo;</span>
                          <div className="prompt-body">
                            <span className="prompt-query">{item.query}</span>
                            {item.context && (
                              <span className="prompt-context">({item.context})</span>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Technical Architecture & Status */}
            <div className="assistant-block asst-reveal">
              <h3 className="assistant-block-title">Current Technical Architecture &amp; Status</h3>
              <div className="architecture-grid">
                {data.architecture.map((item, idx) => (
                  <div key={idx} className="arch-item">
                    <span className="arch-code">{item.code}</span>
                    <span className="arch-name">{item.name}</span>
                    <span className={`arch-status-badge status--${item.badgeVariant || 'developed'}`}>
                      <span className="arch-dot" />
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dev & Hardware Note */}
            <div className="dev-hardware-note asst-reveal" role="note">
              <div className="note-header">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <span>Dev &amp; Hardware Note</span>
              </div>
              <p className="note-text">{data.devNote}</p>
            </div>
          </div>

          {/* ─── RIGHT: Open/Blank Space Reserved for Specs Image ─── */}
          <div ref={slotRef} className="nayra-assistant-right">
            <div className="specs-image-slot">
              {data.glassesImage ? (
                <img
                  src={data.glassesImage}
                  alt={data.glassesImageAlt || 'NAYRA Assistive Smart Glasses'}
                  className="specs-rendered-img"
                  loading="lazy"
                />
              ) : (
                /* Clean Placeholder Slot Ready to Drop Image Asset Into Later */
                <div className="specs-slot-placeholder" aria-label="Reserved specs image placeholder">
                  <div className="placeholder-content">
                    <div className="placeholder-icon-circle">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </div>
                    <span className="placeholder-title">Specs Image Slot</span>
                    <span className="placeholder-desc">Open space reserved for NAYRA glasses / hardware visual</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
