import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register plugins once centrally
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/**
 * Standard staggered fade-in animation for section items
 */
export function animateSectionEnter(
  triggerElement: HTMLElement,
  targetElements: NodeListOf<Element> | Element[],
  options?: {
    yOffset?: number
    duration?: number
    stagger?: number
    start?: string
  }
) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) return null

  return gsap.fromTo(
    targetElements,
    { opacity: 0, y: options?.yOffset ?? 32 },
    {
      opacity: 1,
      y: 0,
      duration: options?.duration ?? 0.8,
      stagger: options?.stagger ?? 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: triggerElement,
        start: options?.start ?? 'top 75%',
        toggleActions: 'play none none reverse',
      },
    }
  )
}

export { gsap, ScrollTrigger }

