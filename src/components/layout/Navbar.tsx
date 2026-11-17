import { useState, useEffect, useCallback } from 'react'
import type { NavLink } from '../../types'
import './Navbar.css'

const NAV_LINKS: NavLink[] = [
  { label: 'Explore', href: '#impact' },
  { label: 'Technology', href: '#technology' },
  { label: 'Experience', href: '#meet-nayra' },
  { label: 'Specifications', href: '#accessibility' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    let lastScrolled = false
    const handleScroll = () => {
      const isScrolled = window.scrollY > 40
      if (isScrolled !== lastScrolled) {
        lastScrolled = isScrolled
        setScrolled(isScrolled)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setMobileMenuOpen(false)

    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  return (
    <header className="navbar-wrapper">
      <nav
        className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="navbar__container">
          {/* Left: Brand Wordmark */}
          <div className="navbar__left">
            <a
              href="#hero"
              className="navbar__brand"
              onClick={(e) => handleNavClick(e, '#hero')}
              aria-label="NAYRA Home"
            >
              NAYRA<span className="navbar__brand-dot">.</span>
            </a>
          </div>

          {/* Center: Desktop Navigation Links */}
          <ul className="navbar__menu">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="navbar__link"
                  onClick={(e) => handleNavClick(e, link.href)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Right: Primary Action CTA & Mobile Hamburger */}
          <div className="navbar__right">
            <a
              href="#vision"
              className="navbar__cta-btn"
              onClick={(e) => handleNavClick(e, '#vision')}
            >
              Get Early Access
            </a>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              className={`navbar__hamburger ${mobileMenuOpen ? 'navbar__hamburger--active' : ''}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              aria-expanded={mobileMenuOpen}
            >
              <span className="hamburger-line" />
              <span className="hamburger-line" />
              <span className="hamburger-line" />
            </button>
          </div>
        </div>

        {/* Mobile Fullscreen Overlay Menu */}
        <div
          className={`navbar__mobile-overlay ${mobileMenuOpen ? 'navbar__mobile-overlay--open' : ''}`}
          aria-hidden={!mobileMenuOpen}
        >
          <div className="navbar__mobile-content">
            <ul className="navbar__mobile-menu">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="navbar__mobile-link"
                    onClick={(e) => handleNavClick(e, link.href)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="navbar__mobile-action">
              <a
                href="#vision"
                className="btn btn--primary"
                onClick={(e) => handleNavClick(e, '#vision')}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Get Early Access
              </a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
