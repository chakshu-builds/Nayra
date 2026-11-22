import { useEffect, useRef, useState, useCallback } from 'react'
import { FrameLoader, TOTAL_FRAMES } from '../lib/frameLoader'

interface UseScrollFramesOptions {
  onFrameChange?: (index: number) => void
}

export function useScrollFrames(options?: UseScrollFramesOptions) {
  const [isReady, setIsReady] = useState(false)
  const [loadProgress, setLoadProgress] = useState(0)

  const frameLoaderRef = useRef<FrameLoader | null>(null)
  const currentFrameRef = useRef(1)
  const rafIdRef = useRef<number>(0)
  const onFrameChangeRef = useRef(options?.onFrameChange)

  useEffect(() => {
    onFrameChangeRef.current = options?.onFrameChange
  }, [options?.onFrameChange])

  // A single rAF handles both image and scroll events, preventing repeated
  // canvas draws or image-queue churn within one display refresh.
  const scheduleRender = useCallback(() => {
    if (rafIdRef.current) return
    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = 0
      const target = currentFrameRef.current
      frameLoaderRef.current?.loadAroundPosition(target)
      onFrameChangeRef.current?.(target)
    })
  }, [])

  const setFrameIndex = useCallback((targetIndex: number) => {
    const clampedIndex = Math.min(TOTAL_FRAMES, Math.max(1, Math.round(targetIndex)))
    if (clampedIndex === currentFrameRef.current) return
    currentFrameRef.current = clampedIndex
    scheduleRender()
  }, [scheduleRender])

  const getFrame = useCallback((index: number) => {
    return frameLoaderRef.current?.getFrame(index) ?? null
  }, [])

  useEffect(() => {
    const isMobile = window.innerWidth < 768
    let ready = false
    const loader = new FrameLoader({
      reducedFrames: isMobile,
      onProgress: (loaded, total) => {
        // Progress UI disappears after the first frame; don't re-render React
        // hundreds of times while background buffering is underway.
        if (!ready) setLoadProgress(Math.min(100, Math.round((loaded / total) * 100)))
      },
      onFirstFrameReady: () => {
        ready = true
        setIsReady(true)
        scheduleRender()
      },
      onFrameLoaded: () => {
        // Refresh the currently requested image when a prioritized or nearby
        // frame completes, even when the user has stopped scrolling.
        scheduleRender()
      },
    })
    frameLoaderRef.current = loader
    void loader.preloadInitial()

    return () => {
      cancelAnimationFrame(rafIdRef.current)
      rafIdRef.current = 0
      frameLoaderRef.current = null
      loader.destroy()
    }
  }, [scheduleRender])

  return {
    isReady,
    loadProgress,
    totalFrames: TOTAL_FRAMES,
    setFrameIndex,
    getFrame,
  }
}
