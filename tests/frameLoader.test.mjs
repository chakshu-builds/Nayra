import test from 'node:test'
import assert from 'node:assert/strict'
import { FrameLoader, TOTAL_FRAMES } from '../src/lib/frameLoader.ts'

// Image is a browser global. Simulate asynchronous successful image requests
// without installing a browser or connecting to a network.
function installImageMock({ fail = () => false, slow = () => false } = {}) {
  const previous = globalThis.Image
  const requested = []
  class FakeImage {
    decoding = 'auto'
    onload = null
    onerror = null
    #src = ''
    set src(value) {
      this.#src = value
      requested.push(value)
      if (slow(value)) return
      queueMicrotask(() => {
        if (fail(value)) this.onerror?.(new Error('test load failure'))
        else this.onload?.()
      })
    }
    get src() { return this.#src }
    removeAttribute(name) { if (name === 'src') this.#src = '' }
  }
  globalThis.Image = FakeImage
  return { requested, restore: () => { globalThis.Image = previous } }
}

test('paths are correctly zero-padded and clamped', () => {
  const loader = new FrameLoader()
  assert.equal(TOTAL_FRAMES, 300)
  assert.equal(loader.getFramePath(1), '/nayra-frames/frame_0001.webp')
  assert.equal(loader.getFramePath(300), '/nayra-frames/frame_0300.webp')
  assert.equal(loader.getFramePath(-3), '/nayra-frames/frame_0001.webp')
  loader.destroy()
})

test('concurrent calls to a frame use one image request', async () => {
  const mock = installImageMock()
  try {
    const loader = new FrameLoader()
    const first = loader.loadFrame(9)
    assert.strictEqual(first, loader.loadFrame(9))
    await first
    assert.equal(mock.requested.length, 1)
    assert.strictEqual(await loader.loadFrame(9), loader.getFrame(9))
    assert.equal(mock.requested.length, 1)
    loader.destroy()
  } finally { mock.restore() }
})

test('desktop cache evicts distant frames while retaining first frame', async () => {
  const mock = installImageMock()
  try {
    const loader = new FrameLoader()
    await loader.loadFrame(1)
    for (let i = 2; i <= 80; i++) await loader.loadFrame(i)
    assert.equal(loader.hasFrame(1), true)
    assert.equal(loader.hasFrame(80), true)
    assert.equal(loader.hasFrame(2), false)
    assert.equal(loader.cache.size <= 36, true)
    assert.equal(loader.getProgress() > 0, true)
    assert.equal(loader.getProgress() <= 1, true)
    loader.destroy()
  } finally { mock.restore() }
})

test('mobile sampling downloads fewer frames, and progress stays bounded', async () => {
  const mock = installImageMock()
  try {
    let reported = 0
    const loader = new FrameLoader({ reducedFrames: true, onProgress: (loaded, total) => { reported = loaded / total } })
    await loader.loadFrame(1)
    await loader.loadFrame(2)
    assert.equal(mock.requested.length, 2)
    assert.equal(mock.requested[1], '/nayra-frames-mobile/frame_0003.webp')
    assert.equal(reported <= 1, true)
    loader.destroy()
  } finally { mock.restore() }
})

test('missing image produces a controlled rejection', async () => {
  const mock = installImageMock({ fail: (url) => url.includes('0099') })
  try {
    const loader = new FrameLoader()
    await assert.rejects(loader.loadFrame(99), /Failed to load frame 99/)
    assert.equal(loader.hasFrame(99), false)
    loader.destroy()
  } finally { mock.restore() }
})

test('destroy cancels pending image requests', async () => {
  const mock = installImageMock({ slow: () => true })
  try {
    const loader = new FrameLoader()
    const pending = loader.loadFrame(50)
    loader.destroy()
    await assert.rejects(pending, /cancelled/)
    assert.equal(loader.cache.size, 0)
  } finally { mock.restore() }
})

test('preloadInitial reveals first frame and does not load all 300 frames', async () => {
  const mock = installImageMock()
  try {
    let ready = false
    const loader = new FrameLoader({ onFirstFrameReady: () => { ready = true } })
    await loader.preloadInitial()
    assert.equal(ready, true)
    assert.equal(mock.requested.length <= 9, true)
    assert.equal(loader.hasFrame(1), true)
    loader.destroy()
  } finally { mock.restore() }
})

test('the current frame starts downloading immediately without a debounce', async () => {
  const mock = installImageMock()
  try {
    const loader = new FrameLoader()
    loader.loadAroundPosition(15)
    assert.ok(mock.requested.some((url) => url.endsWith('0015.webp')))
    loader.loadAroundPosition(90)
    loader.loadAroundPosition(210)
    await new Promise((resolve) => setTimeout(resolve, 0))
    assert.ok(mock.requested.some((url) => url.endsWith('0210.webp')))
    loader.destroy()
  } finally { mock.restore() }
})

test('rapid jumps cancel stale downloads and respect a concurrency limit', async () => {
  const mock = installImageMock({ slow: () => true })
  try {
    const loader = new FrameLoader()
    loader.loadAroundPosition(30)
    assert.ok(loader.inFlight.size <= 5)
    loader.loadAroundPosition(220)
    assert.ok(loader.inFlight.has(220), 'new target must have priority even with a full pool')
    assert.ok(loader.inFlight.size <= 5)
    assert.ok([...loader.inFlight.keys()].every((key) => Math.abs(key - 220) <= 16))
    loader.destroy()
  } finally { mock.restore() }
})

test('a missed distant frame preserves the last displayed frame', async () => {
  const mock = installImageMock()
  try {
    const loader = new FrameLoader()
    const opening = await loader.loadFrame(1)
    assert.equal(loader.getFrame(1), opening)
    const later = await loader.loadFrame(90)
    assert.equal(loader.getFrame(90), later)
    assert.equal(loader.getFrame(275), later, 'must never flash back to frame 1')
    loader.destroy()
  } finally { mock.restore() }
})

test('prefetch order favors the newest scroll direction with reverse support', async () => {
  const mock = installImageMock({ slow: () => true })
  try {
    const loader = new FrameLoader()
    loader.loadAroundPosition(120)
    assert.ok(loader.inFlight.has(120))
    loader.loadAroundPosition(100)
    assert.ok(loader.inFlight.has(100))
    assert.ok(loader.queue.includes(99) || loader.inFlight.has(99))
    loader.destroy()
  } finally { mock.restore() }
})

test('mobile loader uses compact assets but desktop keeps full-resolution frames', () => {
  const desktop = new FrameLoader()
  const mobile = new FrameLoader({ reducedFrames: true })
  assert.equal(desktop.getFramePath(95), '/nayra-frames/frame_0095.webp')
  assert.equal(mobile.getFramePath(95), '/nayra-frames-mobile/frame_0095.webp')
  assert.equal(mobile.getFramePath(300), '/nayra-frames-mobile/frame_0300.webp')
  desktop.destroy()
  mobile.destroy()
})
