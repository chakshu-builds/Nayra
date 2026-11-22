# NAYRA frontend architecture

## Runtime diagram

```text
User scroll / tap / keyboard
            |
            v
       React App.tsx
            |
   +--------+---------+-----------------+
   |                  |                 |
   v                  v                 v
HeroSection        ImpactSection     Other sections
   |                  |                 |
   |                  v                 +-- FAQ, specifications,
   |             BentoCard & Modal           assistant simulation,
   v                  |                      dot-matrix canvas
useScrollFrames       v
   |           IntersectionObserver
   v                  |
FrameLoader         <video> source
   |                  |
   v                  v
300 static WebP      Static MP4/WebM
files served by host files served by host
```

## Frame lifecycle (responsive scroll performance update)

1. `FrameLoader.preloadInitial()` starts with frame 1 and then schedules opening-frame prefetch.
2. `ScrollTrigger` calculates the latest scroll-progress frame; `useScrollFrames` coalesces rapid changes into one `requestAnimationFrame` update.
3. The requested frame starts loading immediately, with no 35ms timer that could be reset indefinitely during continuous scrolling. A direction-aware queue prioritizes ahead-of-scroll frames and retains some behind for reversals.
4. At most five desktop or three mobile scheduled image requests run concurrently. Obsolete distant requests are cancelled and pending queued frames are reprioritized on fast jumps.
5. A bounded LRU retains up to 36 desktop or 18 mobile decoded images. Mobile uses 151 sampled 960×540 frames, reducing decode and network bandwidth relative to the 1920×1080 desktop sequence. Frame 1 is pinned for the initial fallback.
6. For a missing exact frame, the closest decoded nearby frame is preferred; otherwise the last **displayed** image stays visible (no snap-back to frame 1). A new decoded frame schedules a single repaint even if the user has stopped scrolling.
7. Canvas drawing skips repeat images, reuses the 2D context, and limits rendered pixels to 3 million. Resizing only redraws when dimensions change; image decoding happens ahead of first canvas presentation where supported.
8. Unmount cancels outstanding requests and scheduled callbacks. Browsers may still keep decoded or HTTP-cached content independently of application LRU.

The actual frame rate remains dependent on network conditions, device power, and browser behavior. These optimizations are tested at the loader level; physical device profiling is still needed to quantify FPS and responsiveness.

## Interaction and accessibility

- Nav uses section anchors and respects `prefers-reduced-motion`.
- Specifications use native disclosure buttons and `aria-expanded` / `aria-controls`.
- Video dialog keeps keyboard focus inside, restores focus after closing, handles Escape and navigation keys, and locks document scrolling while open.
- Video cards use posters and proximity observers, with previews paused outside the viewport.
- The assistant and LED matrix are **visual simulations**, not model output.

## Future hardware/AI — not in this repository

The concept proposes camera capture, image understanding, OCR, optional cloud reasoning, and audio responses. None of that processing, hardware, model code, data collection, or encryption is implemented here. A separate future project would require threat modelling, consent controls, accessibility testing, and hardware validation.
