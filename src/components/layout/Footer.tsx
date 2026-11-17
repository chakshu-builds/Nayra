import './Footer.css'

const CURRENT_YEAR = new Date().getFullYear()

export default function Footer() {
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault()
    const target = document.querySelector(targetId)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-container">
        <div className="footer-top">
          {/* Brand Info */}
          <div className="footer-brand-col">
            <a
              href="#hero"
              className="footer-brand"
              onClick={(e) => handleScrollTo(e, '#hero')}
              aria-label="NAYRA Home"
            >
              NAYRA<span className="brand-dot">.</span>
            </a>
            <p className="footer-tagline">
              See Beyond. Experience More.
            </p>
            <span className="footer-badge">
              AI-POWERED ASSISTIVE SMART GLASSES
            </span>
          </div>

          {/* Nav Links */}
          <nav className="footer-nav-grid" aria-label="Footer Navigation">
            <div className="footer-nav-col">
              <span className="footer-nav-heading">NAVIGATION</span>
              <ul className="footer-nav-list">
                <li><a href="#hero" onClick={(e) => handleScrollTo(e, '#hero')}>Home</a></li>
                <li><a href="#vision" onClick={(e) => handleScrollTo(e, '#vision')}>Our Vision</a></li>
                <li><a href="#technology" onClick={(e) => handleScrollTo(e, '#technology')}>Technology</a></li>
                <li><a href="#meet-nayra" onClick={(e) => handleScrollTo(e, '#meet-nayra')}>Features</a></li>
                <li><a href="#accessibility" onClick={(e) => handleScrollTo(e, '#accessibility')}>Accessibility</a></li>
              </ul>
            </div>

            <div className="footer-nav-col">
              <span className="footer-nav-heading">PILLARS</span>
              <ul className="footer-nav-list">
                <li><a href="#meet-nayra" onClick={(e) => handleScrollTo(e, '#meet-nayra')}>See</a></li>
                <li><a href="#meet-nayra" onClick={(e) => handleScrollTo(e, '#meet-nayra')}>Understand</a></li>
                <li><a href="#meet-nayra" onClick={(e) => handleScrollTo(e, '#meet-nayra')}>Assist</a></li>
              </ul>
            </div>
          </nav>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p className="footer-copy">
            © {CURRENT_YEAR} NAYRA. ALL RIGHTS RESERVED.
          </p>
          <div className="footer-meta">
            <span>300 ULTRA HD WEBP FRAMES</span>
            <span className="footer-bullet">•</span>
            <span>FRAME-BY-FRAME CINEMATOGRAPHY</span>
            <span className="footer-bullet">•</span>
            <span>ON-DEVICE AI</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
