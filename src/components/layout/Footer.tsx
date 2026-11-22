import './Footer.css'

const CURRENT_YEAR = new Date().getFullYear()

export default function Footer() {
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault()
    const target = document.querySelector(targetId)
    if (target) {
      target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })
    }
  }

  return (
    <footer className="footer" id="footer" role="contentinfo">
      {/* Top subtle glowing hairline accent */}
      <div className="footer-top-accent" aria-hidden="true" />

      {/* Ambient background glow */}
      <div className="footer-ambient-glow" aria-hidden="true" />

      {/* Giant low-opacity NAYRA typography anchored in bottom background */}
      <div className="footer-giant-wordmark" aria-hidden="true">
        NAYRA
      </div>

      {/* Premium, minimal, transparent flowing wave-line pattern (No solid fills) */}
      <div className="footer-silk-wave-container" aria-hidden="true">
        <svg
          className="footer-silk-wave-svg"
          viewBox="0 0 1440 210"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Primary wave stroke gradient: soft white luminous crest with lavender falloff */}
            <linearGradient id="waveGradPrimary" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.2" />
              <stop offset="20%" stopColor="#C4B5FD" stopOpacity="0.75" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="78%" stopColor="#A78BFA" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.2" />
            </linearGradient>

            {/* Lavender highlight gradient */}
            <linearGradient id="waveGradLavender" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.12" />
              <stop offset="28%" stopColor="#C4B5FD" stopOpacity="0.55" />
              <stop offset="68%" stopColor="#DDD6FE" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.15" />
            </linearGradient>

            {/* Soft violet depth gradient */}
            <linearGradient id="waveGradViolet" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6D28D9" stopOpacity="0.1" />
              <stop offset="35%" stopColor="#A855F7" stopOpacity="0.45" />
              <stop offset="70%" stopColor="#9333EA" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#581C87" stopOpacity="0.1" />
            </linearGradient>

            {/* Soft white luminous gradient */}
            <linearGradient id="waveGradSoftWhite" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.12" />
              <stop offset="42%" stopColor="#F5F3FF" stopOpacity="0.65" />
              <stop offset="65%" stopColor="#C4B5FD" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.12" />
            </linearGradient>

            {/* Muted delicate violet gradient */}
            <linearGradient id="waveGradMuted" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4C1D95" stopOpacity="0.08" />
              <stop offset="40%" stopColor="#8B5CF6" stopOpacity="0.32" />
              <stop offset="75%" stopColor="#A78BFA" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#3B0764" stopOpacity="0.05" />
            </linearGradient>

            {/* Very subtle glow filter */}
            <filter id="waveSoftGlow" x="-10%" y="-30%" width="120%" height="160%">
              <feGaussianBlur stdDeviation="1.6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Wave 1 */}
          <path
            className="footer-wave-line footer-wave-line-1"
            d="M-40,88 C240,28 480,118 760,68 C1020,20 1260,105 1480,55"
            stroke="url(#waveGradPrimary)"
            strokeWidth="1.4"
            filter="url(#waveSoftGlow)"
          />
          {/* Wave 2 */}
          <path
            className="footer-wave-line footer-wave-line-2"
            d="M-40,58 C210,108 460,22 710,78 C970,128 1230,42 1480,88"
            stroke="url(#waveGradLavender)"
            strokeWidth="1.15"
          />
          {/* Wave 3 */}
          <path
            className="footer-wave-line footer-wave-line-3"
            d="M-40,110 C270,65 520,135 790,95 C1050,55 1280,122 1480,78"
            stroke="url(#waveGradViolet)"
            strokeWidth="1.0"
          />
          {/* Wave 4 */}
          <path
            className="footer-wave-line footer-wave-line-4"
            d="M-40,122 C290,132 540,68 820,52 C1090,38 1300,98 1480,112"
            stroke="url(#waveGradSoftWhite)"
            strokeWidth="1.1"
            filter="url(#waveSoftGlow)"
          />
          {/* Wave 5 */}
          <path
            className="footer-wave-line footer-wave-line-5"
            d="M-40,72 C180,42 410,92 660,58 C920,26 1180,85 1480,50"
            stroke="url(#waveGradMuted)"
            strokeWidth="0.9"
          />
          {/* Wave 6 */}
          <path
            className="footer-wave-line footer-wave-line-6"
            d="M-40,130 C230,138 490,105 750,116 C1010,126 1250,85 1480,118"
            stroke="url(#waveGradLavender)"
            strokeWidth="0.8"
          />
        </svg>
      </div>

      {/* Main Content Container */}
      <div className="footer-container">
        <div className="footer-top">
          {/* Brand Info (Left) */}
          <div className="footer-brand-col">
            <a
              href="#hero"
              className="footer-brand"
              onClick={(e) => handleScrollTo(e, '#hero')}
              aria-label="NAYRA Home"
            >
              <img
                src="/NAYRA_LOGO_OFFWHITE.svg"
                alt="NAYRA"
                className="footer__logo-img"
              />
            </a>
            <p className="footer-tagline">
              See Beyond. <span className="footer-tagline-highlight">Experience More.</span>
            </p>
          </div>

          {/* Nav Links Grid (Right) */}
          <nav className="footer-nav-grid" aria-label="Footer Navigation">
            {/* Right Column 1 — NAVIGATION */}
            <div className="footer-nav-col">
              <span className="footer-nav-heading">NAVIGATION</span>
              <ul className="footer-nav-list">
                <li><a href="#hero" onClick={(e) => handleScrollTo(e, '#hero')}>Home</a></li>
                <li><a href="#impact" onClick={(e) => handleScrollTo(e, '#impact')}>Our Vision</a></li>
                <li><a href="#features" onClick={(e) => handleScrollTo(e, '#features')}>Features</a></li>
                <li><a href="#experience" onClick={(e) => handleScrollTo(e, '#experience')}>Experience</a></li>
                <li><a href="#specifications" onClick={(e) => handleScrollTo(e, '#specifications')}>Specifications</a></li>
              </ul>
            </div>

            {/* Right Column 2 — PILLARS */}
            <div className="footer-nav-col">
              <span className="footer-nav-heading">PILLARS</span>
              <ul className="footer-nav-list">
                <li><a href="#meet-nayra" onClick={(e) => handleScrollTo(e, '#meet-nayra')}>See</a></li>
                <li><a href="#meet-nayra" onClick={(e) => handleScrollTo(e, '#meet-nayra')}>Understand</a></li>
                <li><a href="#ai-assistant" onClick={(e) => handleScrollTo(e, '#ai-assistant')}>Assist</a></li>
              </ul>
            </div>
          </nav>
        </div>

        {/* Bottom Bar: Clean copyright text only */}
        <div className="footer-bottom">
          <p className="footer-copy">
            © {CURRENT_YEAR} NAYRA. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  )
}
