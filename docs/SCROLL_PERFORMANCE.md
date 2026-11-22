# Scroll performance update — Vercel handoff

## Confirmed code-level causes of lag

- The prior `loadAroundPosition()` reset a 35ms priority timer after every scroll progress change. Continuous 60Hz updates could prevent the required frame request from starting until scrolling paused. The 120ms neighbor-prefetch timer could be similarly deferred.
- On a large scroll jump, `getFrame()` could return the opening image when the desired frame was unavailable, making the product animation flash backwards.
- Full HD source images were decoded on mobile and the canvas could create high-resolution rendering surfaces on high-DPR devices. The result could be memory and rendering pressure.
- Lenis `duration: 1.2` made mouse-wheel input feel heavy on the hero's 300-frame sequence.

## Changes in this revision

- **Immediate priority:** `src/lib/frameLoader.ts` dispatches the current frame immediately; prefetch targets are queued in front-of-scroll order and buffered behind for reversals.
- **Cancellation and bounded concurrency:** 5 desktop / 3 mobile scheduled image requests maximum; obsolete distant requests can be cancelled so fast jumps receive priority.
- **Adaptive display fallback:** the nearest cached decoded frame is used first; otherwise the last successfully displayed image remains on the canvas, never forced back to frame 1 after scrolling forward.
- **Async decoding and fewer canvas draws:** decode where supported, coalesce callbacks on rAF, avoid React state updates for invisible loading progress, skip duplicate image drawing.
- **Canvas pixel budget:** reuse a 2D context and cap the canvas at 3 million backing pixels while preserving cover cropping and the existing CSS presentation.
- **Mobile source optimization:** added 151 sampled 960×540 WebP frames in `public/nayra-frames-mobile/` (approximately 2.9 MiB total). Desktop retains all original 300 full-HD frames.
- **Lower input latency:** Lenis duration 1.2 → 0.85; GSAP progress follows the latest ScrollTrigger values.

## What was deliberately NOT changed

- Existing NAYRA theme, text, product frames, GSAP storytelling overlays, mobile layouts, other website sections, product positioning, and video assets.
- No false claim of working AI inference or hardware implementation was added.
- No forced download of all 300 desktop frames; static media is requested on demand.

## Checks and Vercel instructions

- Confirm `npm ci && npm run check` on Windows before pushing; the previously shared terminal output proved the *earlier* ZIP passed, not this revision.
- Vercel static Vite settings: build command `npm run build`, output directory `dist`, project root directory containing `package.json`. Images are in `public/`, included automatically in Vite's `dist/` output.
- Verify on the *deployed* URL: cold-load hero scroll, fast scroll, reverse scrolling, mobile 4G, media playback and navigation. Vercel deployment may have materially different loading characteristics from localhost.
- Set `VITE_SITE_URL` to the real site origin for social previews after the deployment URL is confirmed.

**Important:** A successful type check or unit test does not measure browser FPS. Browser/device profiling and deployed-site validation are still pending. No 60 FPS guarantee or Hack2Skill selection guarantee is claimed.
