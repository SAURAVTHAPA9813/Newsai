/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'page-bg': 'rgb(237, 241, 255)',
        'navbar-bg': 'rgba(240, 243, 255, 0.8)',
        'hero-bg': 'rgb(206, 217, 245)',
        'hero-alt-bg': 'rgb(220, 227, 245)',
        'section-bg': 'rgb(220, 227, 245)',
        'card-bg': 'rgba(255, 255, 255, 0.95)',
        'glassy-card': 'rgba(255, 255, 255, 0.7)',
        'text-primary': '#3D4457',
        'text-secondary': '#5C6378',
        'text-accent': '#4169E1',
        'text-dark': '#2C3142',
        'brand-blue': '#4169E1',
        'button-dark': '#2C3142',
        'button-hover': '#3D4457',
        'badge-bg': 'rgba(100, 120, 180, 0.1)',
        'badge-text': '#5C6378',
        'globe-blue': '#5B8DEF',
        'globe-light': '#A8C8FF',

        // Soft UI additions
        'soft-white': 'rgba(255, 255, 255, 0.8)',
        'soft-glass': 'rgba(255, 255, 255, 0.6)',
        'soft-border': 'rgba(255, 255, 255, 0.3)',
        'soft-shadow': 'rgba(65, 105, 225, 0.1)',

        // Verification badge colors
        'verified-green': '#10B981',
        'likely-cyan': '#06B6D4',
        'misleading-red': '#EF4444',

        // Anxiety guard
        'anxiety-amber': 'rgba(255, 191, 0, 0.4)',

        // Neon colors for motion graphics
        'neon-cyan': '#00F0FF',
        'neon-teal': '#00FFD1',
        'neon-purple': '#B026FF',
        'neon-yellow': '#FFE500',
        'neon-pink': '#FF006E',
        'electric-blue': '#0080FF',
        'dark-bg': '#0A0A0F',
        'dark-grey': '#1A1A24',

        // 🔵 Blue Serenity - Primary Blues (Brand Foundation)
        'serenity-royal': '#4169E1',      // Royal Blue (Primary actions, hover states)
        'serenity-light': '#5B8DEF',      // Light Blue (Gradient highlights, secondary)
        'serenity-deep': '#3D66E3',       // Deep Blue (Dark mode, serious CTAs)
        'serenity-mid': '#6181CC',        // Medium Blue (Transitions)
        'serenity-highlight': '#8AAAF7',  // Light Blue Highlight (Center accents)

        // ⚪ Blue Serenity - Backgrounds
        'serenity-bg-white': '#FFFFFF',      // Pure white (Card backgrounds, data tables)
        'serenity-bg-lightest': '#F8F9FF',   // Very light blue-white (Section backgrounds)
        'serenity-bg-light': '#E7EBFF',      // Light blue (Subtle section dividers)
        'serenity-bg-default': '#F9FAFC',    // Almost white (Dashboard default background)
        'serenity-bg-hover': '#E8EFFE',      // Softest blue (Hover states on cards)
        'serenity-bg-gradient-1': '#C2D5FF', // Light blue (Gradient stops)
        'serenity-bg-gradient-2': '#C4CDF2', // Light blue (Multiple sections)
        'serenity-bg-gradient-3': '#DFE0F0', // Light gray-blue (Gradient start)
        'serenity-bg-gradient-4': '#F2F5FF', // Very light blue (Gradient end)
        'serenity-bg-gradient-5': '#CFDEff', // Light blue (FAQ gradient)

        // 🔲 Blue Serenity - Neutral Grays (Supporting Elements)
        'serenity-gray-lightest': '#F5F5F5',  // Light gray (Disabled states, borders)
        'serenity-gray-light': '#D0D5DD',     // Medium gray (Card borders, dividers)
        'serenity-gray-medium': '#6B7280',    // Medium-dark gray (Secondary text)
        'serenity-gray-dark': '#374151',      // Dark gray (Primary text, labels)

        // 💙 Blue Serenity - Alice Blue & Lavender Series
        'alice-blue': '#edf2fb',      // Alice blue base
        'lavender-1': '#e2eafc',      // Lavender lightest
        'lavender-2': '#d7e3fc',      // Lavender light
        'periwinkle-1': '#ccdbfd',    // Periwinkle lightest
        'periwinkle-2': '#c1d3fe',    // Periwinkle light
        'baby-blue-ice': '#abc4ff',   // Baby blue ice
        'periwinkle-3': '#b6ccfe',    // Periwinkle medium

        // 🎯 Professional Icon Color System
        'icon': {
          // Primary Icon Colors
          'primary': '#4169E1',         // Brand actions, primary icons
          'secondary': '#6B7280',       // Default state, non-interactive icons
          'tertiary': '#9CA3AF',        // Subtle, low-priority icons
          'on-dark': '#FFFFFF',         // Icons on dark backgrounds
          'on-light': '#2C3142',        // Icons on light backgrounds

          // Semantic Status Colors
          'success': '#10B981',         // Green-600 - Success, positive, complete
          'warning': '#F59E0B',         // Amber-500 - Warning, caution
          'error': '#EF4444',           // Red-500 - Error, critical, destructive
          'info': '#3B82F6',            // Blue-500 - Information, help

          // Verification Status (Specific to NEWS AI)
          'verified': '#10B981',        // Green-600 - Verified content
          'likely': '#06B6D4',          // Cyan-600 - Likely true
          'unverified': '#6B7280',      // Gray-500 - Unverified
          'misleading': '#EF4444',      // Red-500 - Misleading content

          // Interactive States
          'active': '#4169E1',          // Active/selected state
          'inactive': '#D1D5DB',        // Inactive/unselected
          'disabled': '#9CA3AF',        // Disabled state
          'hover': '#3D66E3',           // Hover state (darker blue)

          // Brand Variants (Blue Serenity Integration)
          'primary-hover': '#3D66E3',   // serenity-deep
          'primary-light': '#5B8DEF',   // serenity-light
          'secondary-hover': '#4169E1', // Elevates to primary on hover
        },
      },
      fontFamily: {
        'nevera': ['Nevera', 'sans-serif'],
        'cinzel': ['Cinzel', 'serif'],
      },
      animation: {
        'glitch': 'glitch 0.3s cubic-bezier(.25,.46,.45,.94) infinite',
        'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
        'slide-in-left': 'slide-in-left 0.6s cubic-bezier(.25,.46,.45,.94) both',
        'slide-in-right': 'slide-in-right 0.6s cubic-bezier(.25,.46,.45,.94) both',
        'flicker': 'flicker 0.15s infinite',
        'shake': 'shake 0.3s cubic-bezier(.36,.07,.19,.97) both',
      },
      keyframes: {
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        'neon-pulse': {
          '0%, 100%': { opacity: '1', textShadow: '0 0 10px currentColor, 0 0 20px currentColor' },
          '50%': { opacity: '0.8', textShadow: '0 0 20px currentColor, 0 0 40px currentColor' },
        },
        'slide-in-left': {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-2px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(2px)' },
        },
      },
      backdropBlur: {
        'xs': '2px',
        'soft': '20px',
        'card': '16px',
      },
      boxShadow: {
        'glassy': '0 8px 32px rgba(0, 0, 0, 0.1)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 12px 40px rgba(0, 0, 0, 0.15)',
        'soft': '0 8px 32px rgba(65, 105, 225, 0.1)',
        'soft-hover': '0 12px 48px rgba(65, 105, 225, 0.15)',
        'anxiety': '0 0 20px rgba(255, 191, 0, 0.4)',
      },
      backgroundImage: {
        'crypto-gradient': 'radial-gradient(at top left, #8A9EFF 0%, #E7EBFF 30%, #F8F9FF 70%)',
        'globe-gradient': 'radial-gradient(circle at 30% 30%, #A8C8FF 0%, #5B8DEF 50%, #4169E1 100%)',

        // 🎨 Blue Serenity - Homepage Gradient System

        // HeroV1 - Text Gradient (2-stop)
        'hero-text-gradient': 'linear-gradient(135deg, #4169E1 0%, #5B8DEF 100%)',

        // ProblemSolution - Section Background (3-stop)
        'problem-solution-gradient': 'linear-gradient(147deg, rgba(255, 255, 255, 1) 0%, rgba(194, 213, 255, 1) 51%, rgba(231, 235, 255, 1) 100%)',

        // PersonalizationSection - Radial Background
        'personalization-gradient': 'radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(196, 205, 242, 1) 51%, rgba(196, 205, 242, 1) 51%, rgba(255, 255, 255, 1) 100%)',

        // PersonalizationSection - Image Fallback
        'personalization-fallback': 'linear-gradient(135deg, #3D66E3 0%, #6181CC 100%)',

        // ProductPreview - Complex 3-Stop Background (335deg diagonal)
        'product-preview-gradient': 'linear-gradient(335deg, rgba(223, 224, 240, 1) 2%, rgba(196, 205, 242, 1) 51%, rgba(242, 245, 255, 1) 100%)',

        // FAQ - Complex 5-Stop Background (335deg diagonal)
        'faq-gradient': 'linear-gradient(335deg, rgba(255, 255, 255, 1) 0%, rgba(207, 222, 255, 1) 29%, rgba(196, 205, 242, 1) 51%, rgba(196, 205, 242, 1) 51%, rgba(255, 255, 255, 1) 100%)',

        // FinalCTA - Centered Highlight Gradient
        'final-cta-gradient': 'linear-gradient(135deg, #4169E1 0%, #8AAAF7 50%, #4169E1 100%)',

        // Dashboard-Specific Gradients
        'dashboard-hero': 'linear-gradient(135deg, #4169E1 0%, #5B8DEF 50%, #8AAAF7 100%)',
        'dashboard-card': 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 249, 255, 0.9) 100%)',
        'dashboard-sidebar': 'linear-gradient(180deg, rgba(255, 255, 255, 0.8) 0%, rgba(237, 242, 251, 0.8) 100%)',
        'dashboard-widget': 'linear-gradient(135deg, rgba(237, 242, 251, 1) 0%, rgba(255, 255, 255, 1) 100%)',

        // Radial Gradients for Orbs & Special Elements
        'orb-gradient': 'radial-gradient(circle, rgba(65, 105, 225, 0.2) 0%, rgba(65, 105, 225, 0) 70%)',
        'glow-gradient': 'radial-gradient(circle, rgba(138, 170, 247, 0.3) 0%, transparent 70%)',

        // Icon Box Gradients (UseCases style)
        'icon-blue-cyan': 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
        'icon-purple-pink': 'linear-gradient(135deg, #A855F7 0%, #EC4899 100%)',
        'icon-green-emerald': 'linear-gradient(135deg, #22C55E 0%, #10B981 100%)',
        'icon-orange-red': 'linear-gradient(135deg, #F97316 0%, #EF4444 100%)',
        'icon-brand-blue': 'linear-gradient(135deg, #4169E1 0%, #2563EB 100%)',

        // StockSection - Three Gradients
        'stock-blue': 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
        'stock-purple': 'linear-gradient(135deg, #A855F7 0%, #9333EA 100%)',
        'stock-green': 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
      },
    },
  },
  plugins: [],
}
