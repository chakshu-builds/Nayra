# NAYRA upgrade report — November 2026

## Code changes completed

1. Replaced always-growing 300-frame background loading with demand-driven, frame-coalescing requests and a bounded LRU (26 desktop frames, 14 mobile frames). The first frame remains available as a fallback; requests and timers are cleaned on unmount.
2. Added precise repaint callback when a requested scroll frame finishes loading, and clamped loading progress.
3. Fixed broken processor image `/image/image copy.png` by referencing the existing `NAYRA_RV1106_Chip_Banner.webp` file.
4. Added modal focus trapping, focus return, keyboard video access, named dialog heading, and `Escape`/arrow key support.
5. Replaced non-native specification interactions with accessible disclosure buttons, with `aria-expanded` and `aria-controls`.
6. Added skip-to-content navigation and reduced-motion-aware nav and footer scrolling.
7. Marked the assistant response and scenarios as illustrative, and corrected misleading FAQ statements about already-working hardware, voice, privacy/security, and an absent sign-up form.
8. Removed three unreferenced original 1080p videos; retained optimized, used WebM/MP4 media and poster variants. Media removed: approx. 16.4 MB (uncompressed).
9. Added 8 built-in Node unit tests for loader paths, in-flight deduplication, LRU, mobile sampling, error handling, cleanup, initial loading, and rapid-scroll coalescing.
10. Added a static asset validator for 300 frames and literal media links.
11. Added GitHub Actions checks, LICENSE, honest README, architecture and submission guides, and optional absolute social preview URL support.
12. Removed build artifacts, dependencies, and `.git` history from the deliverable ZIP (not from the user's existing GitHub repository).

## Locally verified

- `npm test`: **8/8 pass** on Node 22.
- `npm run verify:assets`: **pass**.
- `tsc --noEmit -p tsconfig.app.json`: **pass** using available TypeScript 5.8.
- `tsc --noEmit -p tsconfig.node.json`: **pass** using available TypeScript 5.8.

## Not yet independently verified

- `npm ci`, `npm run lint`, and full `npm run build`: dependency retrieval timed out in this isolated environment. The provided GitHub Actions workflow will validate them after upload.
- Browser visual regression and real-device Lighthouse/CLS/INP/FPS figures: no browser deployment was run here.
- Specific Hack2Skill score or Top 10 outcome: cannot be guaranteed or calculated from an unknown evaluation system.

## Before submission

Run `npm ci && npm run check`, deploy the application, check the output on mobile and keyboard, set an absolute `VITE_SITE_URL`, and add the actual live deployment link to README. See `SUBMISSION_CHECKLIST.md`.

## Smooth-scroll follow-up (November 2026)

An additional performance revision was created after the user's local build succeeded but the 300-frame scroll experience felt delayed. See [`SCROLL_PERFORMANCE.md`](SCROLL_PERFORMANCE.md) for actual fixes and limitations. The above section remains the historical report for the previous ZIP, and its initial LRU numbers/test counts describe that previous version only.
