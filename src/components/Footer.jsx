import React from 'react'
import { FiTwitter, FiFacebook, FiLinkedin, FiInstagram } from 'react-icons/fi'

const Footer = () => {
  const quickLinks = [
    { name: 'About Us', href: '#about' },
    { name: 'Features', href: '#features' },
    { name: 'Privacy Policy', href: '#privacy' },
    { name: 'Terms of Service', href: '#terms' },
  ]

  const socialLinks = [
    { name: 'Twitter', icon: <FiTwitter />, href: '#' },
    { name: 'Facebook', icon: <FiFacebook />, href: '#' },
    { name: 'LinkedIn', icon: <FiLinkedin />, href: '#' },
    { name: 'Instagram', icon: <FiInstagram />, href: '#' },
  ]

  return (
    <footer className="bg-section-bg border-t border-brand-blue/10">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1 - Logo & Tagline */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl text-brand-blue">✕</span>
              <span className="text-xl font-semibold text-brand-blue tracking-wide">NEWS AI</span>
            </div>
            <p className="text-text-secondary leading-relaxed mb-4">
              NEWS AI is an AI-powered intelligence platform built to help you stay ahead of world events, markets, and technology—without drowning in information.
            </p>
            <div className="space-y-2">
              <p className="text-text-secondary text-sm">
                <span className="font-semibold text-text-dark">Contact:</span>{' '}
                <a
                  href="mailto:support@newsai.com"
                  className="text-brand-blue hover:underline"
                >
                  support@newsai.com
                </a>
              </p>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-text-dark mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-text-secondary hover:text-brand-blue transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Social Media */}
          <div>
            <h3 className="text-lg font-semibold text-text-dark mb-4">Follow Us</h3>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center hover:bg-brand-blue hover:text-white transition-all duration-300 hover-scale"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 4 - Newsletter */}
          <div>
            <h3 className="text-lg font-semibold text-text-dark mb-4">Stay Updated</h3>
            <p className="text-text-secondary text-sm mb-4">
              Subscribe to our newsletter for the latest news and updates.
            </p>
            <form className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 rounded-lg bg-white border border-brand-blue/20 text-text-dark placeholder-text-secondary/50 focus:outline-none focus:border-brand-blue transition-colors"
              />
              <button
                type="submit"
                className="bg-button-dark text-white px-4 py-3 rounded-lg font-semibold hover:bg-button-hover transition-all hover-scale"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-brand-blue/10 text-center">
          <p className="text-text-secondary text-sm">
            &copy; 2025 NEWS AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
