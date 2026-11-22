/**
 * NAYRA's direction-aware scroll frame loader.
 *
 * The requested frame is dispatched immediately (no continuously-reset debounce).
 * A small priority queue preloads around the scroll direction, and abandoned
 * distant requests are cancelled. Decoded images live in a bounded LRU cache.
 * We retain the last displayed frame when a distant requested frame is not
 * available yet; scrolling must never flash back to the opening frame.
 */
import type { FrameLoaderOptions } from '../types'

export const TOTAL_FRAMES = 300
const FRAME_PATH = '/nayra-frames/frame_'
const MOBILE_FRAME_PATH = '/nayra-frames-mobile/frame_'
const FRAME_EXT = '.webp'

interface PendingImage {
  promise: Promise<HTMLImageElement>
  cancel: () => void
}

export class FrameLoader {
  private readonly cache = new Map<number, HTMLImageElement>()
  private readonly inFlight = new Map<number, PendingImage>()
  private readonly visitedFrames = new Set<number>()
  private readonly sampleRate: number
  private readonly maxCachedFrames: number
  private readonly maxConcurrentRequests: number
  private readonly onProgress?: FrameLoaderOptions['onProgress']
  private readonly onFirstFrameReady?: FrameLoaderOptions['onFirstFrameReady']
  private readonly onFrameLoaded?: FrameLoaderOptions['onFrameLoaded']
  private queue: number[] = []
  private destroyed = false
  private target = 1
  private scrollDirection = 1
  private firstFramePromise: Promise<void> | null = null
  private firstFrameImage: HTMLImageElement | null = null
  private lastDisplayedImage: HTMLImageElement | null = null

  constructor(options: FrameLoaderOptions = {}) {
    this.sampleRate = options.reducedFrames ? 2 : 1
    // Deliberate cache limits: these are 1920×1080 source images, and decoded
    // bitmap memory is substantially greater than the WebP download size.
    this.maxCachedFrames = options.reducedFrames ? 18 : 36
    this.maxConcurrentRequests = options.reducedFrames ? 3 : 5
    this.onProgress = options.onProgress
    this.onFirstFrameReady = options.onFirstFrameReady
    this.onFrameLoaded = options.onFrameLoaded
  }

  private normalize(index: number): number {
    if (!Number.isFinite(index)) return 1
    const clamped = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(index)))
    return Math.min(TOTAL_FRAMES, 1 + Math.round((clamped - 1) / this.sampleRate) * this.sampleRate)
  }

  public getFramePath(index: number): string {
    const padded = String(Math.max(1, Math.min(TOTAL_FRAMES, Math.round(index)))).padStart(4, '0')
    const folder = this.sampleRate === 2 ? MOBILE_FRAME_PATH : FRAME_PATH
    return `${folder}${padded}${FRAME_EXT}`
  }

  private touch(index: number): HTMLImageElement | null {
    const frame = this.cache.get(index)
    if (!frame) return null
    this.cache.delete(index)
    this.cache.set(index, frame)
    return frame
  }

  private recordFrame(index: number, image: HTMLImageElement): void {
    this.cache.delete(index)
    this.cache.set(index, image)
    this.visitedFrames.add(index)

    // Retain the opening frame for first paint, but evict distant LRU frames.
    while (this.cache.size > this.maxCachedFrames) {
      const oldest = this.cache.keys().next().value
      if (oldest === undefined) break
      if (oldest === 1) {
        const first = this.cache.get(1)
        this.cache.delete(1)
        if (first) this.cache.set(1, first)
      } else {
        this.cache.delete(oldest)
      }
    }

    const total = Math.ceil(TOTAL_FRAMES / this.sampleRate)
    this.onProgress?.(Math.min(this.visitedFrames.size, total), total)
    this.onFrameLoaded?.(index, image)
  }

  /** Public API retains request de-duplication and cancellation on destroy. */
  public loadFrame(index: number): Promise<HTMLImageElement> {
    if (this.destroyed) return Promise.reject(new Error('Frame loader destroyed'))
    const key = this.normalize(index)
    const hit = this.touch(key)
    if (hit) return Promise.resolve(hit)
    const pending = this.inFlight.get(key)
    if (pending) return pending.promise

    const image = new Image()
    image.decoding = 'async'
    let settled = false
    let rejectRequest: (error: Error) => void = () => {}

    const promise = new Promise<HTMLImageElement>((resolve, reject) => {
      rejectRequest = reject
      const cleanup = () => {
        image.onload = null
        image.onerror = null
        this.inFlight.delete(key)
      }
      const fail = (error: Error) => {
        if (settled) return
        settled = true
        cleanup()
        reject(error)
      }
      image.onload = () => {
        // Decode before first canvas use when browser supports it, reducing
        // synchronous image decode pauses on the animation frame.
        const decoded = typeof image.decode === 'function'
          ? image.decode().catch(() => undefined)
          : Promise.resolve()
        void decoded.then(() => {
          if (settled) return
          if (this.destroyed) {
            fail(new Error('Frame loader destroyed'))
            return
          }
          settled = true
          cleanup()
          if (key === 1) this.firstFrameImage = image
          this.recordFrame(key, image)
          resolve(image)
        })
      }
      image.onerror = () => fail(new Error(`Failed to load frame ${key}`))
    })

    this.inFlight.set(key, {
      promise,
      cancel: () => {
        if (settled) return
        settled = true
        image.onload = null
        image.onerror = null
        this.inFlight.delete(key)
        image.removeAttribute('src')
        rejectRequest(new Error('Frame request cancelled'))
      },
    })
    image.src = this.getFramePath(key)
    return promise
  }

  /** First meaningful paint, then dispatch a small buffered neighborhood. */
  public preloadInitial(): Promise<void> {
    if (this.firstFramePromise) return this.firstFramePromise
    this.firstFramePromise = this.loadFrame(1)
      .then((image) => {
        this.onFirstFrameReady?.(image)
        if (!this.destroyed && this.target === 1) this.loadAroundPosition(1)
      })
      .catch((error: unknown) => {
        if (!this.destroyed) console.warn('NAYRA: opening frame could not load', error)
      })
    return this.firstFramePromise
  }

  /**
   * Reprioritize pending work on every scroll update. Unlike the former
   * 35ms/120ms timers, the current frame never waits for scrolling to stop.
   */
  public loadAroundPosition(frameIndex: number): void {
    if (this.destroyed) return
    const next = this.normalize(frameIndex)
    if (next > this.target) this.scrollDirection = 1
    else if (next < this.target) this.scrollDirection = -1
    this.target = next

    const step = this.sampleRate
    const ahead = this.scrollDirection
    const plan: number[] = [next]
    // Prioritize forward motion while keeping a buffer for rapid reversals.
    for (let distance = 1; distance <= 8; distance++) {
      const forward = next + ahead * distance * step
      if (forward >= 1 && forward <= TOTAL_FRAMES) plan.push(this.normalize(forward))
      if (distance <= 4) {
        const backward = next - ahead * distance * step
        if (backward >= 1 && backward <= TOTAL_FRAMES) plan.push(this.normalize(backward))
      }
    }
    this.queue = [...new Set(plan)].filter((index) => !this.cache.has(index) && !this.inFlight.has(index))

    // A fast scroll jump must not be blocked by in-flight frames from the old
    // viewport. Never cancel the opening frame while it is first loading.
    const keepDistance = step * 16
    for (const [index, pending] of this.inFlight) {
      if (index !== 1 && Math.abs(index - next) > keepDistance) pending.cancel()
    }
    // Reserve capacity for the actual frame, even when older near-frame
    // prefetches have filled every connection slot.
    if (!this.cache.has(next) && !this.inFlight.has(next) &&
      this.inFlight.size >= this.maxConcurrentRequests) {
      const expendable = [...this.inFlight.keys()]
        .filter((index) => index !== 1 && Math.abs(index - next) > step * 2)
        .sort((a, b) => Math.abs(b - next) - Math.abs(a - next))[0]
      if (expendable !== undefined) this.inFlight.get(expendable)?.cancel()
    }
    this.dispatchQueue()
  }

  private dispatchQueue(): void {
    if (this.destroyed) return
    while (this.inFlight.size < this.maxConcurrentRequests && this.queue.length > 0) {
      const index = this.queue.shift()
      if (index === undefined) break
      if (this.cache.has(index) || this.inFlight.has(index)) continue
      void this.loadFrame(index)
        .catch(() => { /* obsolete or failed images keep the last visible frame */ })
        .finally(() => {
          if (!this.destroyed) this.dispatchQueue()
        })
    }
  }

  /** Prefer the nearest already-decoded image, never jump back to frame 1. */
  public getFrame(index: number): HTMLImageElement | null {
    const target = this.normalize(index)
    let chosenIndex = target
    let candidate = this.touch(target)
    if (!candidate) {
      const maxDistance = this.sampleRate * 16
      let nearestDistance = Infinity
      for (const key of this.cache.keys()) {
        const distance = Math.abs(key - target)
        if (distance > maxDistance) continue
        // For ties, favor the direction we are scrolling.
        if (distance < nearestDistance ||
          (distance === nearestDistance && (key - target) * this.scrollDirection > 0)) {
          nearestDistance = distance
          chosenIndex = key
          candidate = this.cache.get(key) ?? null
        }
      }
      if (candidate) this.touch(chosenIndex)
    }
    if (candidate) this.lastDisplayedImage = candidate
    return candidate ?? this.lastDisplayedImage ?? this.firstFrameImage
  }

  public hasFrame(index: number): boolean {
    return this.cache.has(this.normalize(index))
  }

  public getProgress(): number {
    return Math.min(1, this.visitedFrames.size / Math.ceil(TOTAL_FRAMES / this.sampleRate))
  }

  public destroy(): void {
    if (this.destroyed) return
    this.destroyed = true
    this.queue = []
    for (const pending of this.inFlight.values()) pending.cancel()
    this.inFlight.clear()
    this.cache.clear()
    this.firstFrameImage = null
    this.lastDisplayedImage = null
  }
}

export default FrameLoader
