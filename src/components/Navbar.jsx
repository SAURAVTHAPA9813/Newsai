import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiSearch, FiMenu, FiX, FiUser, FiBell } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import IconButton from './common/IconButton'
import Icon from './common/Icon'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const location = useLocation()
  const { isAuthenticated } = useAuth()

  // Landing page links for public users
  const publicNavLinks = [
    { name: 'Home', href: '/' },
    { name: 'Product', href: '#features', scroll: true },
    { name: 'Use Cases', href: '#use-cases', scroll: true },
    { name: 'Pricing', href: '#pricing', scroll: true },
    { name: 'About', href: '/about' },
  ]

  // Navbar is now public-only (authenticated users see sidebar instead)
  const navLinks = publicNavLinks

  // Handle smooth scroll for anchor links
  const handleNavClick = (e, link) => {
    if (link.scroll && link.href.startsWith('#')) {
      e.preventDefault()
      const element = document.querySelector(link.href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  return (
    <>
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-navbar-bg border-b border-serenity-royal/10">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl text-serenity-royal transition-transform group-hover:rotate-90 duration-300">✕</span>
            <span className="text-xl font-semibold text-serenity-royal tracking-wide">NEWS AI</span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-8 ml-12">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href && link.href !== '/'
              return (
                <li key={link.name}>
                  {link.scroll ? (
                    <a
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link)}
                      className="font-medium text-[15px] transition-colors duration-300 relative group text-text-secondary hover:text-serenity-royal cursor-pointer"
                    >
                      {link.name}
                      <span className="absolute left-0 bottom-[-4px] h-[2px] bg-serenity-royal transition-all duration-300 w-0 group-hover:w-full" />
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className={`font-medium text-[15px] transition-colors duration-300 relative group ${
                        isActive ? 'text-serenity-royal' : 'text-text-secondary hover:text-serenity-royal'
                      }`}
                    >
                      {link.name}
                      <span className={`absolute left-0 bottom-[-4px] h-[2px] bg-serenity-royal transition-all duration-300 ${
                        isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      }`} />
                    </Link>
                  )}
                </li>
              )
            })}
          </ul>

          {/* Right Side - Icons */}
          <div className="flex items-center gap-4">

            {/* User Profile or Auth Buttons */}
            {isAuthenticated ? (
              <Link to="/profile">
                <IconButton
                  icon={FiUser}
                  label="User Profile"
                  variant="secondary"
                  size="md"
                />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden md:block px-4 py-2 rounded-lg border-2 border-serenity-royal text-serenity-royal font-semibold hover:bg-serenity-royal/10 transition-all text-sm"
                >
                  Login
                </Link>
                <Link
                  to="/login"
                  className="hidden md:block px-5 py-2 rounded-lg bg-serenity-royal text-white font-semibold hover:bg-serenity-deep transition-all text-sm shadow-lg hover:shadow-xl"
                >
                  Get Started
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-text-secondary hover:text-serenity-royal transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              <Icon
                icon={isMenuOpen ? FiX : FiMenu}
                size="lg"
                color="secondary"
                decorative
              />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-serenity-royal/10">
            <ul className="flex flex-col gap-4">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.href && link.href !== '/'
                return (
                  <li key={link.name}>
                    {link.scroll ? (
                      <a
                        href={link.href}
                        onClick={(e) => {
                          handleNavClick(e, link)
                          setIsMenuOpen(false)
                        }}
                        className="block font-medium text-[15px] transition-colors duration-300 py-2 text-text-secondary hover:text-serenity-royal cursor-pointer"
                      >
                        {link.name}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className={`block font-medium text-[15px] transition-colors duration-300 py-2 ${
                          isActive ? 'text-serenity-royal' : 'text-text-secondary hover:text-serenity-royal'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                )
              })}
              {/* Mobile Auth Buttons */}
              {!isAuthenticated && (
                <>
                  <li>
                    <Link
                      to="/login"
                      className="block text-center px-4 py-2 rounded-lg border-2 border-serenity-royal text-serenity-royal font-semibold hover:bg-serenity-royal/10 transition-all text-sm"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/login"
                      className="block text-center px-5 py-2 rounded-lg bg-serenity-royal text-white font-semibold hover:bg-serenity-deep transition-all text-sm shadow-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </div>
    </nav>

    </>
  )
}

export default Navbar
