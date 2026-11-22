import { useState, useRef, useEffect, useCallback } from 'react'
import { FAQ_CATEGORIES, type FAQCategoryKey } from './faqData'
import { gsap } from '../../../lib/animations'
import './NayraFAQSection.css'

interface NayraFAQSectionProps {
  id?: string
  defaultCategory?: FAQCategoryKey
  scrollTargetId?: string
}

export default function NayraFAQSection({
  id = 'faq',
  defaultCategory = 'general',
  scrollTargetId = '#footer',
}: NayraFAQSectionProps) {
  const [activeCategory, setActiveCategory] = useState<FAQCategoryKey>(defaultCategory)
  const [indicator, setIndicator] = useState<{ left: number; width: number }>({ left: 0, width: 0 })
  const [isTransitioning, setIsTransitioning] = useState(false)

  const sectionRef = useRef<HTMLElement>(null)
  const tabsListRef = useRef<HTMLDivElement>(null)
  const tabButtonRefs = useRef<Map<string, HTMLButtonElement>>(new Map())
  const contentGridRef = useRef<HTMLDivElement>(null)
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => {
    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current)
  }, [])

  const currentCategory =
    FAQ_CATEGORIES.find((cat) => cat.key === activeCategory) || FAQ_CATEGORIES[0]

  // Split items into 2 editorial columns (left & right)
  const midIndex = Math.ceil(currentCategory.items.length / 2)
  const leftColumnItems = currentCategory.items.slice(0, midIndex)
  const rightColumnItems = currentCategory.items.slice(midIndex)

  // Update underline indicator position
  const updateIndicator = useCallback((key: FAQCategoryKey) => {
    const tabEl = tabButtonRefs.current.get(key)
    if (tabEl && tabsListRef.current) {
      const containerRect = tabsListRef.current.getBoundingClientRect()
      const tabRect = tabEl.getBoundingClientRect()
      const left = tabRect.left - containerRect.left + tabsListRef.current.scrollLeft
      const width = tabRect.width
      setIndicator({ left, width })
    }
  }, [])

  useEffect(() => {
    updateIndicator(activeCategory)
    const handleResize = () => updateIndicator(activeCategory)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [activeCategory, updateIndicator])

  // Initial GSAP reveal animation
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const revealElements = el.querySelectorAll('.faq-scroll-reveal')

    const ctx = gsap.context(() => {
      if (revealElements.length > 0) {
        gsap.fromTo(
          revealElements,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      }
    }, el)

    return () => ctx.revert()
  }, [])

  // Switch category with graceful fade transition
  const handleCategoryChange = (key: FAQCategoryKey) => {
    if (key === activeCategory) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      setActiveCategory(key)
      return
    }

    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current)
    setIsTransitioning(true)
    transitionTimerRef.current = setTimeout(() => {
      setActiveCategory(key)
      setIsTransitioning(false)
      transitionTimerRef.current = null
    }, 140)
  }

  // Keyboard navigation for accessible tabs
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    const categoriesCount = FAQ_CATEGORIES.length
    let nextIndex: number | null = null

    if (e.key === 'ArrowRight') {
      nextIndex = (index + 1) % categoriesCount
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (index - 1 + categoriesCount) % categoriesCount
    } else if (e.key === 'Home') {
      nextIndex = 0
    } else if (e.key === 'End') {
      nextIndex = categoriesCount - 1
    }

    if (nextIndex !== null) {
      e.preventDefault()
      const nextCategory = FAQ_CATEGORIES[nextIndex].key
      handleCategoryChange(nextCategory)
      const nextButton = tabButtonRefs.current.get(nextCategory)
      nextButton?.focus()
    }
  }

  // Bottom circular down arrow action
  const handleScrollDown = (e: React.MouseEvent) => {
    e.preventDefault()
    const target = document.querySelector(scrollTargetId)
    if (target) {
      target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })
    }
  }

  return (
    <section ref={sectionRef} className="nayra-faq-section" id={id} aria-label="Frequently Asked Questions">
      <div className="nayra-faq-container">
        {/* ─── 1. TOP EDITORIAL HEADER ─── */}
        <header className="nayra-faq-header faq-scroll-reveal">
          <span className="nayra-faq-eyebrow">FAQ</span>
          <h2 className="nayra-faq-heading">Have any questions?</h2>
          <p className="nayra-faq-subtext">Everything you need to know about NAYRA.</p>
        </header>

        {/* ─── 2. HORIZONTAL CATEGORY NAVIGATION ─── */}
        <nav
          className="nayra-faq-nav-wrapper faq-scroll-reveal"
          aria-label="FAQ Category Navigation"
        >
          <div
            ref={tabsListRef}
            className="nayra-faq-tabs"
            role="tablist"
            aria-label="FAQ Categories"
          >
            {FAQ_CATEGORIES.map((cat, index) => {
              const isActive = cat.key === activeCategory
              return (
                <button
                  key={cat.key}
                  ref={(el) => {
                    if (el) tabButtonRefs.current.set(cat.key, el)
                    else tabButtonRefs.current.delete(cat.key)
                  }}
                  role="tab"
                  id={`faq-tab-${cat.key}`}
                  aria-selected={isActive}
                  aria-controls={`faq-panel-${cat.key}`}
                  tabIndex={isActive ? 0 : -1}
                  className={`faq-tab-btn ${isActive ? 'faq-tab-btn--active' : ''}`}
                  onClick={() => handleCategoryChange(cat.key)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                >
                  {cat.label}
                </button>
              )
            })}

            {/* Smooth Royal Purple Underline Indicator */}
            <span
              className="faq-tab-indicator"
              style={{
                transform: `translateX(${indicator.left}px)`,
                width: `${indicator.width}px`,
                opacity: indicator.width > 0 ? 1 : 0,
              }}
              aria-hidden="true"
            />
          </div>
        </nav>

        {/* ─── 3. FAQ QUESTIONS — EDITORIAL TWO-COLUMN LAYOUT ─── */}
        <div
          ref={contentGridRef}
          role="tabpanel"
          id={`faq-panel-${activeCategory}`}
          aria-labelledby={`faq-tab-${activeCategory}`}
          className={`nayra-faq-content faq-scroll-reveal ${
            isTransitioning ? 'nayra-faq-content--fading' : ''
          }`}
        >
          {/* Column 1 (Left Column) */}
          <div className="nayra-faq-column">
            {leftColumnItems.map((item) => (
              <article key={item.id} className="nayra-faq-item">
                <h3 className="faq-item-question">{item.question}</h3>
                <p className="faq-item-answer">{item.answer}</p>
              </article>
            ))}
          </div>

          {/* Column 2 (Right Column) */}
          <div className="nayra-faq-column">
            {rightColumnItems.map((item) => (
              <article key={item.id} className="nayra-faq-item">
                <h3 className="faq-item-question">{item.question}</h3>
                <p className="faq-item-answer">{item.answer}</p>
              </article>
            ))}
          </div>
        </div>

        {/* ─── 4. BOTTOM DETAIL: MINIMAL CIRCULAR DOWN-ARROW OUTLINE ─── */}
        <div className="nayra-faq-bottom faq-scroll-reveal">
          <button
            type="button"
            className="faq-scroll-down-btn"
            onClick={handleScrollDown}
            aria-label="Scroll to footer section"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <polyline points="19 12 12 19 5 12" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
