import { forwardRef, useImperativeHandle, useRef, useEffect, useCallback } from 'react'

export interface HeroCanvasHandle {
  drawFrame: (img: HTMLImageElement | null) => void
  resize: () => void
}

interface HeroCanvasProps {
  isVisible: boolean
}

// Source frames are 1920×1080; generating an oversized 4K canvas provides
// little visual benefit but increases per-frame pixel work considerably.
const MAX_CANVAS_PIXELS = 3_000_000

export const HeroCanvas = forwardRef<HeroCanvasHandle, HeroCanvasProps>(function HeroCanvas(
  { isVisible },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)
  const lastImgRef = useRef<HTMLImageElement | null>(null)

  const drawFrame = useCallback((img: HTMLImageElement | null) => {
    if (!img || img === lastImgRef.current) return
    const canvas = canvasRef.current
    if (!canvas) return
    if (!contextRef.current) contextRef.current = canvas.getContext('2d', { alpha: false })
    const ctx = contextRef.current
    if (!ctx) return

    const iw = img.naturalWidth || 1920
    const ih = img.naturalHeight || 1080
    const cw = canvas.width
    const ch = canvas.height
    if (!cw || !ch) return

    const scale = Math.max(cw / iw, ch / ih)
    const dw = iw * scale
    const dh = ih * scale
    try {
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh)
      lastImgRef.current = img
    } catch {
      // An image can become unavailable during a rapid request cancellation.
      // Keep the previous completed canvas frame instead of flashing blank.
    }
  }, [])

  const resize = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const w = rect.width || window.innerWidth
    const h = rect.height || window.innerHeight
    if (!w || !h) return

    const deviceLimit = w < 768 ? 1.5 : 2
    const dpr = Math.min(window.devicePixelRatio || 1, deviceLimit, Math.sqrt(MAX_CANVAS_PIXELS / (w * h)))
    const width = Math.max(1, Math.round(w * dpr))
    const height = Math.max(1, Math.round(h * dpr))
    // Canvas width/height assignments clear the bitmap. Only resize when
    // dimensions actually change, especially on mobile browser chrome shifts.
    if (canvas.width === width && canvas.height === height) return
    canvas.width = width
    canvas.height = height
    lastImgRef.current = null
    // Previous image is replayed after the canvas reset without waiting for
    // another ScrollTrigger update.
    const last = lastRenderedImageRef.current
    if (last) drawFrame(last)
  }, [drawFrame])

  const lastRenderedImageRef = useRef<HTMLImageElement | null>(null)
  const drawAndRemember = useCallback((img: HTMLImageElement | null) => {
    if (!img) return
    lastRenderedImageRef.current = img
    drawFrame(img)
  }, [drawFrame])

  useImperativeHandle(ref, () => ({
    drawFrame: drawAndRemember,
    resize,
  }), [drawAndRemember, resize])

  useEffect(() => {
    resize()
    window.addEventListener('resize', resize, { passive: true })
    return () => window.removeEventListener('resize', resize)
  }, [resize])

  return (
    <canvas
      ref={canvasRef}
      className={`hero-landscape-canvas ${isVisible ? 'hero-landscape-canvas--visible' : ''}`}
      aria-label="NAYRA AI-powered assistive smart glasses 16:9 landscape product advertisement"
    />
  )
})
