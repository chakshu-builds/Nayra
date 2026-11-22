/**
 * NAYRA TypeScript Type Definitions
 */

export interface NavLink {
  label: string
  href: string
}

export interface PillarItem {
  step: string
  name: string
  label: string
  description: string
  metric: string
}

export interface AccessibilityUseCase {
  tag: string
  title: string
  summary: string
  details: string
  iconSvg: React.ReactNode
}

export interface TechDomain {
  category: string
  title: string
  description: string
}

export interface BentoImpactCardItem {
  id: string
  number: string
  category: string
  title: string
  narrative: string
  keyPoints?: string[]
  audioSrc?: string
  sources: {
    mp4_720: string
    webm_720: string
    mp4_540: string
    webm_540: string
  }
  posterSrc: string
  alt: string
}

export interface FrameLoaderOptions {
  onProgress?: (loaded: number, total: number) => void
  onFirstFrameReady?: (img: HTMLImageElement) => void
  onFrameLoaded?: (index: number, img: HTMLImageElement) => void
  reducedFrames?: boolean
}

