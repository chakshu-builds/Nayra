import { useEffect, useRef, useState, useCallback } from 'react'
import type { BentoImpactCardItem } from '../../../types'
import './VideoDetailModal.css'

interface VideoDetailModalProps {
  card: BentoImpactCardItem | null
  cards: BentoImpactCardItem[]
  onClose: () => void
  onNavigate: (card: BentoImpactCardItem) => void
}

export function VideoDetailModal({ card, cards, onClose, onNavigate }: VideoDetailModalProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [isTypingComplete, setIsTypingComplete] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const typingTimeoutRef = useRef<number | null>(null)

  const currentIndex = cards.findIndex((c) => c.id === card?.id)
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex < cards.length - 1

  // Handle navigation
  const handlePrev = useCallback(() => {
    if (hasPrev) {
      onNavigate(cards[currentIndex - 1])
    }
  }, [hasPrev, cards, currentIndex, onNavigate])

  const handleNext = useCallback(() => {
    if (hasNext) {
      onNavigate(cards[currentIndex + 1])
    }
  }, [hasNext, cards, currentIndex, onNavigate])

  // Toggle Play/Pause
  const togglePlayPause = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {})
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }, [])

  // Toggle Audio Mute
  const toggleMute = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation()
    const video = videoRef.current
    if (!video) return
    if (video.muted) {
      video.muted = false
      video.volume = 1.0
      setIsMuted(false)
      video.play().then(() => setIsPlaying(true)).catch(() => {})
    } else {
      video.muted = true
      setIsMuted(true)
    }
  }, [])

  // Keyboard navigation & escape listener
  useEffect(() => {
    if (!card) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowLeft') {
        handlePrev()
      } else if (e.key === 'ArrowRight') {
        handleNext()
      } else if (e.key === 'm' || e.key === 'M') {
        toggleMute()
      } else if (e.key === ' ') {
        e.preventDefault()
        togglePlayPause()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [card, onClose, handlePrev, handleNext, togglePlayPause, toggleMute])

  // Scroll lock when active
  useEffect(() => {
    if (!card) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [card])

  // Play video with real sound when card opens or switches
  useEffect(() => {
    const video = videoRef.current
    if (!video || !card) return

    // Prefer unmuted audio playback on user click
    video.muted = false
    video.volume = 1.0

    const playPromise = video.play()
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true)
          setIsMuted(false)
        })
        .catch(() => {
          // If unmuted autoplay is disallowed by browser policy, fallback smoothly to muted
          video.muted = true
          setIsMuted(true)
          video.play().then(() => setIsPlaying(true)).catch(() => {})
        })
    }
  }, [card])

  // Typewriter effect execution floating in the air
  useEffect(() => {
    if (!card) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const narrative = card.narrative

    if (prefersReducedMotion) {
      typingTimeoutRef.current = window.setTimeout(() => {
        setDisplayedText(narrative)
        setIsTypingComplete(true)
      }, 0)
      return () => {
        if (typingTimeoutRef.current) window.clearTimeout(typingTimeoutRef.current)
      }
    }

    let charIndex = 0

    const typeNextChar = () => {
      if (charIndex < narrative.length) {
        const currentChar = narrative[charIndex]
        setDisplayedText(narrative.slice(0, charIndex + 1))
        charIndex += 1

        let delay = 18
        if (currentChar === '.' || currentChar === '!' || currentChar === '?') {
          delay = 140
        } else if (currentChar === ',' || currentChar === ';' || currentChar === ':') {
          delay = 60
        }

        typingTimeoutRef.current = window.setTimeout(typeNextChar, delay)
      } else {
        setIsTypingComplete(true)
      }
    }

    typingTimeoutRef.current = window.setTimeout(typeNextChar, 250)

    return () => {
      if (typingTimeoutRef.current) {
        window.clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [card])

  if (!card) return null

  // Prefer audio-enabled MP4 if available
  const videoSource = card.audioSrc || card.sources.mp4_720

  return (
    <div
      className="cinema-stage-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cinema-video-title"
    >
      {/* ─── Ambient Floating Header ─── */}
      <div className="cinema-floating-topbar">
        <div className="cinema-topbar-brand">
          <span className="cinema-indicator-dot" />
          <span className="cinema-indicator-text">{card.category}</span>
        </div>

        <div className="cinema-topbar-actions">
          {/* Topbar navigation switcher: no overlap with video or text */}
          <div className="cinema-topbar-nav">
            <button
              type="button"
              className="cinema-nav-arrow-btn"
              onClick={handlePrev}
              disabled={!hasPrev}
              aria-label="Previous video demonstration"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <span className="cinema-topbar-counter">
              0{currentIndex + 1} / 0{cards.length}
            </span>
            <button
              type="button"
              className="cinema-nav-arrow-btn"
              onClick={handleNext}
              disabled={!hasNext}
              aria-label="Next video demonstration"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          <button
            type="button"
            className="cinema-mute-pill"
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
          >
            {isMuted ? (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="1" y1="1" x2="23" y2="23" />
                  <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
                  <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
                <span>SOUND MUTED</span>
              </>
            ) : (
              <>
                <span className="cinema-soundwaves">
                  <span className="bar bar-1" />
                  <span className="bar bar-2" />
                  <span className="bar bar-3" />
                </span>
                <span>AUDIO PLAYING</span>
              </>
            )}
          </button>

          <button
            type="button"
            className="cinema-floating-close"
            onClick={onClose}
            aria-label="Close cinematic view (Esc)"
          >
            <span>ESC</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* ─── Immersive Cinema Viewport (Centered Vertically & Horizontally) ─── */}
      <div className="cinema-stage-viewport">
        {/* VIDEO IN CENTER */}
        <div className="cinema-video-portal" onClick={togglePlayPause}>
          <video
            ref={videoRef}
            src={videoSource}
            poster={card.posterSrc}
            className="cinema-video-element"
            playsInline
            loop
            preload="auto"
            aria-label={card.alt}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onVolumeChange={() => {
              if (videoRef.current) {
                setIsMuted(videoRef.current.muted)
              }
            }}
            onEnded={() => {
              const video = videoRef.current
              if (video) {
                video.currentTime = 0
                video.play().catch(() => {})
              }
            }}
          />

          {/* Minimal Play/Pause Floating Hint on Pause */}
          {!isPlaying && (
            <div className="cinema-pause-overlay">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
          )}
        </div>

        {/* PURE TYPEWRITER TEXT (Centered Vertically and Horizontally) */}
        <div className="cinema-air-story">
          <div className="cinema-air-narrative-wrap">
            <p className="cinema-air-narrative">
              {displayedText}
              <span className={`cinema-air-cursor ${isTypingComplete ? 'cinema-air-cursor--soft' : ''}`}>|</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
