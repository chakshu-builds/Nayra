import { forwardRef, useRef, useEffect, useState } from 'react'
import type { BentoImpactCardItem } from '../../../types'
import './BentoCard.css'

interface BentoCardProps {
  card: BentoImpactCardItem
  className?: string
  style?: React.CSSProperties
  isModalOpen?: boolean
  onSelect?: (card: BentoImpactCardItem) => void
}

export const BentoCard = forwardRef<HTMLElement, BentoCardProps>(
  ({ card, className = '', style, isModalOpen, onSelect }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null)
    const cardRef = useRef<HTMLElement | null>(null)
    const posterRef = useRef<HTMLImageElement | null>(null)

    // Lazy attachment: video element & sources are NOT mounted into DOM until within 200px of viewport
    const [isSourcesLoaded, setIsSourcesLoaded] = useState(false)

    // 1. Proximity Observer: only attach video URL when card approaches viewport (200px margin)
    useEffect(() => {
      const container = cardRef.current
      if (!container) return

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (prefersReducedMotion) return

      const proximityObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              setIsSourcesLoaded(true)
              proximityObserver.disconnect()
              break
            }
          }
        },
        { rootMargin: '200px 0px' }
      )

      proximityObserver.observe(container)
      return () => proximityObserver.disconnect()
    }, [])

    // 2. Playback Observer: autoplay only when sufficiently visible (>=25%), pause immediately when leaving (<15%)
    // Operates via direct DOM calls with ZERO React state updates during scrolling to ensure smooth 60fps
    useEffect(() => {
      const container = cardRef.current
      if (!container || !isSourcesLoaded) return

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (prefersReducedMotion) return

      const playbackObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const video = videoRef.current
            if (!video) continue

            if (entry.isIntersecting && entry.intersectionRatio >= 0.25 && !isModalOpen) {
              const playPromise = video.play()
              if (playPromise !== undefined) {
                playPromise.catch(() => {
                  // Autoplay blocked by browser policy or low-power mode; poster remains visible
                })
              }
            } else if (entry.intersectionRatio < 0.15 || !entry.isIntersecting) {
              if (!video.paused) {
                video.pause()
              }
            }
          }
        },
        { threshold: [0, 0.15, 0.25] }
      )

      playbackObserver.observe(container)
      return () => playbackObserver.disconnect()
    }, [isSourcesLoaded, isModalOpen])

    // 3. Pause video when the detailed modal is open or when browser tab is hidden
    useEffect(() => {
      const video = videoRef.current
      if (!video) return

      if (isModalOpen && !video.paused) {
        video.pause()
      }

      const handleVisibilityChange = () => {
        if (document.hidden && !video.paused) {
          video.pause()
        }
      }

      document.addEventListener('visibilitychange', handleVisibilityChange)
      return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
    }, [isModalOpen])

    return (
      <article
        ref={(node) => {
          cardRef.current = node
          if (typeof ref === 'function') {
            ref(node)
          } else if (ref) {
            ref.current = node
          }
        }}
        className={`bento-card bento-card--${card.id} ${className}`}
        style={style}
        role="button"
        tabIndex={0}
        onClick={() => onSelect?.(card)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onSelect?.(card)
          }
        }}
        aria-label={`${card.title} - Click to expand demonstration`}
      >
        {/* Lightweight WebP Poster (Always loaded first, reserves fixed 3:4 aspect ratio to prevent CLS) */}
        <img
          ref={posterRef}
          src={card.posterSrc}
          alt={card.alt}
          className="bento-card-poster"
          loading="lazy"
          decoding="async"
        />

        {/* Video element: only mounted when card approaches within 200px */}
        {isSourcesLoaded && (
          <video
            ref={videoRef}
            className="bento-card-video"
            playsInline
            muted
            loop
            preload="none"
            aria-label={card.alt}
            onPlaying={() => posterRef.current?.classList.add('bento-card-poster--hidden')}
            onPause={() => posterRef.current?.classList.remove('bento-card-poster--hidden')}
          >
            {/* Mobile (<= 680px) VP9 WebM */}
            <source
              src={card.sources.webm_540}
              type="video/webm"
              media="(max-width: 680px)"
            />
            {/* Mobile (<= 680px) H.264 MP4 */}
            <source
              src={card.sources.mp4_540}
              type="video/mp4"
              media="(max-width: 680px)"
            />
            {/* Desktop (> 680px) VP9 WebM */}
            <source src={card.sources.webm_720} type="video/webm" />
            {/* Desktop (> 680px) H.264 MP4 */}
            <source src={card.sources.mp4_720} type="video/mp4" />
          </video>
        )}

        {/* Cinematic gradient scrim for readable text contrast */}
        <div className="bento-card-scrim" />

        {/* Text written directly on top of the video */}
        <div className="bento-card-overlay">
          <h3 className="bento-card-title">{card.title}</h3>
        </div>
      </article>
    )
  }
)

BentoCard.displayName = 'BentoCard'
