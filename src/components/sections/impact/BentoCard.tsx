import { forwardRef, useRef, useEffect } from 'react'
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

    // 1. Viewport-aware continuous playback observer
    // Generous 200px vertical margin ensures video stays buffered and playing smoothly without micro-stutters during scrolling
    useEffect(() => {
      const container = cardRef.current
      const video = videoRef.current
      if (!container || !video) return

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (prefersReducedMotion) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !isModalOpen) {
            video.play().catch(() => {
              // Autoplay policy or low-power fallback
            })
          } else {
            if (!video.paused) {
              video.pause()
            }
          }
        },
        { rootMargin: '200px 0px', threshold: 0.05 }
      )

      observer.observe(container)
      return () => observer.disconnect()
    }, [isModalOpen])

    // 2. Pause video when detailed modal is open or when browser tab is hidden
    useEffect(() => {
      const video = videoRef.current
      if (!video) return

      if (isModalOpen && !video.paused) {
        video.pause()
      }

      const handleVisibilityChange = () => {
        if (document.hidden && !video.paused) {
          video.pause()
        } else if (!document.hidden && !isModalOpen) {
          video.play().catch(() => {})
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
        {/* Full-Bleed Hardware-Accelerated Video (Continuous 60fps Loop) */}
        <video
          ref={videoRef}
          className="bento-card-video"
          autoPlay
          loop
          muted
          playsInline
          disablePictureInPicture
          disableRemotePlayback
          preload="auto"
          aria-label={card.alt}
          onPlaying={() => {
            if (posterRef.current) {
              posterRef.current.style.opacity = '0'
              posterRef.current.style.pointerEvents = 'none'
            }
          }}
        >
          {/* Hardware-accelerated MP4 (H.264 faststart) first for guaranteed zero-CPU 60fps decoding */}
          <source
            src={card.sources.mp4_720}
            type="video/mp4"
            media="(min-width: 681px)"
          />
          <source
            src={card.sources.mp4_540}
            type="video/mp4"
            media="(max-width: 680px)"
          />
          {/* WebM fallback */}
          <source src={card.sources.webm_720} type="video/webm" />
          <source src={card.sources.webm_540} type="video/webm" />
        </video>

        {/* Lightweight WebP Poster (Zero Layout Shift, gracefully fades out on play) */}
        <img
          ref={posterRef}
          src={card.posterSrc}
          alt={card.alt}
          className="bento-card-poster"
          loading="eager"
          decoding="async"
        />

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
