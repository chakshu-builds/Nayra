# PromptWars submission checklist

Before submitting the repository link:

- [ ] Push only source + required static assets. Do not commit `.git/`, `node_modules/`, `dist/`, `.env`, private keys, or old ZIP archives.
- [ ] Open the GitHub repository anonymously and confirm every README link works.
- [ ] `npm ci` completes on your machine.
- [ ] `npm run check` finishes successfully (lint, tests, media, TypeScript, build).
- [ ] GitHub Actions has a green check for the exact submitted commit.
- [ ] Publish the `dist/` folder and open the deployed app in incognito mode.
- [ ] Paste the **real deployment URL** into README and submission form; none is supplied by default.
- [ ] Test hero scroll, all three modal videos, navigation, mobile menu, LED display, FAQ, and specification disclosures.
- [ ] Verify small mobile (360px), tablet (768px), desktop (1440px) and keyboard-only navigation.
- [ ] Enable reduced motion and ensure content is usable with native scrolling.
- [ ] Verify that the browser console has no uncaught errors, broken image requests, or missing videos.
- [ ] Capture accurate screenshots and publish a short *real* screen recording if requested.
- [ ] State clearly that the AI glasses, assistant, OCR, SOS and hardware functions are concept simulations/planned.
- [ ] Check event rules for originality, eligibility, AI usage, and evaluation criteria; do not assume the evaluator checks only GitHub source.

### Quick commands

```bash
npm ci
npm run check
npm run dev
```

### Known limitations

A full production build and multi-browser interaction testing still need verification in a machine able to install project dependencies. No guarantee of any competition placement is possible. Do not claim successful deploy or working AI inference based on a static code review.
