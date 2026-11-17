/**
 * NAYRA Frame Loader — High-Performance 300 WebP Landscape Frame Engine
 * 
 * Handles loading 300 landscape WebP frames (1920 × 1080):
 * - Prioritized Frame 1 instant reveal
 * - In-flight Promise deduplication (no polling intervals)
 * - Proximity lookahead preloading synchronized with scroll position
 * - Concurrency-limited progressive background stream
 * - In-memory Map cache with nearest-neighbor fallback
 * - Memory-conscious frame sampling for mobile devices
 */

import type { FrameLoaderOptions } from '../types'

export const TOTAL_FRAMES = 300
const FRAME_PATH = '/nayra-frames/frame_'
const FRAME_EXT = '.webp'

// Performance thresholds
const INITIAL_PRELOAD_COUNT = 15      // Immediately loaded around frame 1
const BATCH_SIZE = 12                 // Concurrent batch chunk size
const LOOKAHEAD_WINDOW = 35           // Lookahead window around active frame
const MOBILE_SAMPLE_RATE = 2          // Load every 2nd frame on mobile (150 frames)

export class FrameLoader {
  private cache: Map<number, HTMLImageElement> = new Map()
  private inFlight: Map<number, Promise<HTMLImageElement>> = new Map()
  private totalFrames: number = TOTAL_FRAMES
  private sampleRate: number = 1
  private onProgress?: (loaded: number, total: number) => void
  private onFirstFrameReady?: (img: HTMLImageElement) => void
  private abortController: AbortController | null = null

  constructor(options: FrameLoaderOptions = {}) {
    this.onProgress = options.onProgress
    this.onFirstFrameReady = options.onFirstFrameReady

    if (options.reducedFrames) {
      this.sampleRate = MOBILE_SAMPLE_RATE
    }
  }

  /**
   * Format index to 4-digit filename: frame_0001.webp -> frame_0300.webp
   */
  public getFramePath(index: number): string {
    const clamped = Math.max(1, Math.min(this.totalFrames, Math.round(index)))
    const padded = String(clamped).padStart(4, '0')
    return `${FRAME_PATH}${padded}${FRAME_EXT}`
  }

  /**
   * Load an individual frame with deduplicated in-flight promise
   */
  public loadFrame(index: number): Promise<HTMLImageElement> {
    const clamped = Math.max(1, Math.min(this.totalFrames, Math.round(index)))

    // Return cached image if available
    const cached = this.cache.get(clamped)
    if (cached) {
      return Promise.resolve(cached)
    }

    // Return existing in-flight promise if currently loading
    const pending = this.inFlight.get(clamped)
    if (pending) {
      return pending
    }

    // Create new fetch promise
    const loadPromise = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image()
      img.decoding = 'async'

      img.onload = () => {
        this.cache.set(clamped, img)
        this.inFlight.delete(clamped)
        this.onProgress?.(this.cache.size, Math.ceil(this.totalFrames / this.sampleRate))
        resolve(img)
      }

      img.onerror = () => {
        this.inFlight.delete(clamped)
        reject(new Error(`Failed to load frame ${clamped}`))
      }

      img.src = this.getFramePath(clamped)
    })

    this.inFlight.set(clamped, loadPromise)
    return loadPromise
  }

  /**
   * Preload initial batch with Frame 1 priority for instant paint
   */
  public async preloadInitial(): Promise<void> {
    this.abortController = new AbortController()

    // 1. Immediately request Frame 1
    try {
      const firstFrame = await this.loadFrame(1)
      this.onFirstFrameReady?.(firstFrame)
    } catch (e) {
      console.warn('Initial frame failed to load:', e)
    }

    // 2. Preload first cluster and key milestone frames
    const initialIndices: number[] = []
    for (let i = 1; i <= INITIAL_PRELOAD_COUNT; i += this.sampleRate) {
      initialIndices.push(i)
    }

    // Key milestone frames across the 300 range (e.g. 50, 100, 150, 200, 250, 300)
    const milestones = [50, 100, 150, 200, 250, 300]
    for (const m of milestones) {
      if (!initialIndices.includes(m)) initialIndices.push(m)
    }

    await this.loadBatch(initialIndices, 4)
  }

  /**
   * Concurrency-bounded batch loader
   */
  private async loadBatch(indices: number[], concurrency = 4): Promise<void> {
    const chunks: number[][] = []
    for (let i = 0; i < indices.length; i += concurrency) {
      chunks.push(indices.slice(i, i + concurrency))
    }

    for (const chunk of chunks) {
      if (this.abortController?.signal.aborted) return
      await Promise.allSettled(chunk.map((i) => this.loadFrame(i)))
    }
  }

  /**
   * Prioritize loading frames in proximity to user's active scroll position
   */
  public async loadAroundPosition(frameIndex: number): Promise<void> {
    const start = Math.max(1, frameIndex - LOOKAHEAD_WINDOW)
    const end = Math.min(this.totalFrames, frameIndex + LOOKAHEAD_WINDOW)
    const toLoad: number[] = []

    // Look ahead first
    for (let i = frameIndex; i <= end; i += this.sampleRate) {
      if (!this.cache.has(i)) toLoad.push(i)
    }
    // Look behind second
    for (let i = frameIndex - 1; i >= start; i -= this.sampleRate) {
      if (!this.cache.has(i)) toLoad.push(i)
    }

    if (toLoad.length > 0) {
      await this.loadBatch(toLoad, 4)
    }
  }

  /**
   * Progressively load all remaining frames in background with minimal main-thread pressure
   */
  public async loadRemaining(): Promise<void> {
    const remaining: number[] = []
    for (let i = 1; i <= this.totalFrames; i += this.sampleRate) {
      if (!this.cache.has(i)) remaining.push(i)
    }

    if (remaining.length > 0) {
      for (let i = 0; i < remaining.length; i += BATCH_SIZE) {
        if (this.abortController?.signal.aborted) return
        const batch = remaining.slice(i, i + BATCH_SIZE)
        await this.loadBatch(batch, 4)
        // Yield 12ms to main thread between batches for silky scroll smoothness
        await new Promise((r) => setTimeout(r, 12))
      }
    }
  }

  /**
   * Get exact or nearest cached frame (bidirectional nearest search)
   */
  public getFrame(index: number): HTMLImageElement | null {
    const clamped = Math.max(1, Math.min(this.totalFrames, Math.round(index)))

    if (this.cache.has(clamped)) {
      return this.cache.get(clamped)!
    }

    // Bidirectional search outward for the nearest loaded frame
    for (let offset = 1; offset <= 15; offset++) {
      const up = clamped + offset
      if (up <= this.totalFrames && this.cache.has(up)) {
        return this.cache.get(up)!
      }
      const down = clamped - offset
      if (down >= 1 && this.cache.has(down)) {
        return this.cache.get(down)!
      }
    }

    // Fallback to frame 1
    return this.cache.get(1) ?? null
  }

  /**
   * Check if a specific frame is in cache
   */
  public hasFrame(index: number): boolean {
    return this.cache.has(Math.max(1, Math.min(this.totalFrames, Math.round(index))))
  }

  /**
   * Normalized loading progress 0..1
   */
  public getProgress(): number {
    const effectiveTotal = Math.ceil(this.totalFrames / this.sampleRate)
    return Math.min(1, this.cache.size / effectiveTotal)
  }

  /**
   * Complete memory cleanup
   */
  public destroy(): void {
    this.abortController?.abort()
    this.cache.clear()
    this.inFlight.clear()
  }
}

export default FrameLoader

