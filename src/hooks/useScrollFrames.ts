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

  // Request a frame render (throttled with requestAnimationFrame)
  const setFrameIndex = useCallback((targetIndex: number) => {
    const clampedIndex = Math.min(
      TOTAL_FRAMES,
      Math.max(1, Math.round(targetIndex))
    )

    if (clampedIndex === currentFrameRef.current) return
    currentFrameRef.current = clampedIndex

    cancelAnimationFrame(rafIdRef.current)
    rafIdRef.current = requestAnimationFrame(() => {
      onFrameChangeRef.current?.(clampedIndex)
    })

    frameLoaderRef.current?.loadAroundPosition(clampedIndex)
  }, [])

  // Retrieve an image element for a specific index
  const getFrame = useCallback((index: number) => {
    return frameLoaderRef.current?.getFrame(index) ?? null
  }, [])

  useEffect(() => {
    const isMobile = window.innerWidth < 768

    const loader = new FrameLoader({
      reducedFrames: isMobile,
      onProgress: (loaded, total) => {
        setLoadProgress(Math.round((loaded / total) * 100))
      },
      onFirstFrameReady: () => {
        setIsReady(true)
        onFrameChangeRef.current?.(1)
      },
    })

    frameLoaderRef.current = loader

    // Preload initial critical frames, then progressively stream the rest
    loader.preloadInitial().then(() => {
      loader.loadRemaining()
    })

    return () => {
      cancelAnimationFrame(rafIdRef.current)
      loader.destroy()
    }
  }, [])

  return {
    isReady,
    loadProgress,
    totalFrames: TOTAL_FRAMES,
    setFrameIndex,
    getFrame,
  }
}
