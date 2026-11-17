import { forwardRef, useImperativeHandle, useRef, useEffect, useCallback } from 'react'

export interface HeroCanvasHandle {
  drawFrame: (img: HTMLImageElement | null) => void
  resize: () => void
}

interface HeroCanvasProps {
  isVisible: boolean
}

export const HeroCanvas = forwardRef<HeroCanvasHandle, HeroCanvasProps>(function HeroCanvas(
  { isVisible },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const lastImgRef = useRef<HTMLImageElement | null>(null)

  // Aspect-ratio-aware COVER rendering (100% viewport coverage, 0 black margins)
  const drawFrame = useCallback((img: HTMLImageElement | null) => {
    if (!img) return
    lastImgRef.current = img

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const cw = canvas.width
    const ch = canvas.height
    const iw = img.naturalWidth || 1920
    const ih = img.naturalHeight || 1080

    // True object-fit: COVER logic so the frame covers 100% of the viewport edge-to-edge
    const scale = Math.max(cw / iw, ch / ih)
    const dw = iw * scale
    const dh = ih * scale
    const dx = (cw - dw) / 2
    const dy = (ch - dh) / 2

    ctx.drawImage(img, dx, dy, dw, dh)
  }, [])

  // Viewport resize with Device Pixel Ratio scaling
  const resize = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = window.innerWidth
    const h = window.innerHeight

    canvas.width = Math.round(w * dpr)
    canvas.height = Math.round(h * dpr)

    if (lastImgRef.current) {
      drawFrame(lastImgRef.current)
    }
  }, [drawFrame])

  useImperativeHandle(ref, () => ({
    drawFrame,
    resize,
  }), [drawFrame, resize])

  useEffect(() => {
    resize()
    window.addEventListener('resize', resize)
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

