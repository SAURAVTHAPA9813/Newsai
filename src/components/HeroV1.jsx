import React from 'react'
import { motion } from 'framer-motion'
import { FiPlay, FiBarChart2, FiShare2, FiBookmark, FiTrendingUp, FiActivity } from 'react-icons/fi'

const HeroV1 = () => {
  // Animation Variants
  const heroTextVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' }
    }
  }

  const subtextVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: 0.3, duration: 0.6 }
    }
  }

  const cardFloat = (delay = 0) => ({
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
      delay
    }
  })

  return (
    <section className="relative bg-hero-bg overflow-hidden">
      {/* First Screen - Only Headline (100vh) */}
      <div className="relative min-h-screen flex items-center justify-center pb-10">
        <div className="container-custom relative z-10">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={heroTextVariants}
            className="font-cinzel text-3xl md:text-5xl lg:text-[56px] font-normal text-text-primary text-center leading-tight tracking-wide uppercase max-w-4xl mx-auto mb-6"
          >
            STAY INFORMED WITH REAL-TIME, AI-CURATED NEWS FROM TRUSTED SOURCES.
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={subtextVariants}
            className="font-[Fauna One] text-lg text-base md:text-lg text-text-secondary text-center max-w-2xl mx-auto"
          >
            Our smart engine analyzes thousands of articles, summarizes them instantly, and delivers only what matters most to you.
          </motion.p>
        </div>
      </div>

      {/* Second Screen - Globe with Cards (starts after scroll) */}
      <div className="relative w-full" style={{ height: '120vh' }}>
        {/* 3D Globe - Centered */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <motion.div
            className="relative"
            animate={{
              rotate: 360
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear'
            }}
          >
            <img
              src="/images/ball.png"
              alt="Globe"
              className="object-contain opacity-90"
              style={{
                width: '1200px',
                height: '1200px',
                maxWidth: 'none',
                filter: 'drop-shadow(0 0 60px rgba(65, 105, 225, 0.4))'
              }}
              onLoad={() => console.log('Globe image loaded')}
              onError={() => console.error('Globe image failed to load')}
            />
          </motion.div>
        </div>
{/* Floating Cards Container */}
<div className="relative z-20 w-full max-w-6xl mx-auto h-[600px] md:h-[700px] lg:h-[800px] px-4">

  {/* Card 1 - Bottom Left - "Manage what news" */}
  <motion.div
    initial={{ opacity: 0, x: -100 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, type: 'spring', stiffness: 100, damping: 15 }}
    animate={cardFloat(0)}
    whileHover={{ scale: 1.05, y: -10 }}
    className="
      absolute 
      bottom-[5%] md:bottom-[8%] lg:bottom-[10%]
      left-[2%] md:left-[5%] lg:left-[8%]
      w-[280px] md:w-[320px]
      backdrop-blur-md bg-white/30 border border-white/20 
      rounded-2xl p-6 shadow-xl
    "
  >
    <div className="flex gap-4">
      <img
        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"
        alt="User"
        className="w-20 h-20 rounded-full object-cover flex-shrink-0"
      />
      <div className="flex-1">
        <h3 className="font-[Fauna One] text-lg text-base font-semibold text-text-dark mb-2 leading-snug">
          Manage what news gets in your feed early
        </h3>
        <p className="font-[Fauna One] text-lg text-sm text-text-secondary mb-4 leading-relaxed">
          It's good to know what's happening in the world right now.
        </p>
        <button className="font-[Fauna One] text-lg bg-button-dark text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-button-hover transition-colors">
          Join Now
        </button>
      </div>
    </div>
  </motion.div>

  {/* Card 2 - Top Center - "AI DRIVES RECORD" */}
  <motion.div
 initial={{ opacity: 0, y: -100, x: "-50%" }}          // <- center
  whileInView={{ opacity: 1, y: 0, x: "-50%" }} 
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay: 0.2, type: 'spring', stiffness: 100, damping: 15 }}
    animate={{
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 0.5
      }
    }}
    whileHover={{ scale: 1.0, y: -10 }}
    className="
      absolute 
     -top-[10%] md:-top-[8%] lg:-top-[2%]
      left-1/2 -translate-x-1/2
      w-[320px] md:w-[380px]
      backdrop-blur-md bg-white/30 border border-white/20
      rounded-2xl p-6 shadow-xl
    "
  >
    <span className="badge mb-3">GLOBAL INTELLIGENCE</span>

    <h3 className="font-[Fauna One] text-lg text-xl md:text-2xl font-bold text-text-dark mb-4 leading-tight">
      AI DRIVES RECORD MARKET SURGE
    </h3>

    <img
      src="/images/white card.png"
      alt="News Card"
      className="w-full h-[140px] md:h-[160px] object-cover rounded-lg mb-3"
    />

    <p className="font-[Fauna One] text-lg text-sm text-text-secondary mb-4 leading-relaxed">
      Our smart engine analyzes this real-time financial data, identifying trends and insights that matter to your portfolio.
    </p>

    <div className="flex items-center gap-4 text-gray-400">
      <FiBarChart2 className="w-4 h-4 hover:text-brand-blue cursor-pointer transition-colors" />
      <FiShare2 className="w-4 h-4 hover:text-brand-blue cursor-pointer transition-colors" />
      <FiBookmark className="w-4 h-4 hover:text-brand-blue cursor-pointer transition-colors" />
      <FiTrendingUp className="w-4 h-4 hover:text-brand-blue cursor-pointer transition-colors" />
      <FiActivity className="w-4 h-4 hover:text-brand-blue cursor-pointer transition-colors" />
    </div>
  </motion.div>

  {/* Card 3 - Bottom Right - "CRYPTO CURRENCY" */}
  <motion.div
    initial={{ opacity: 0, x: 100 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay: 0.4, type: 'spring', stiffness: 100, damping: 15 }}
    animate={cardFloat(1)}
    whileHover={{ scale: 1.05, y: -10 }}
    className="
      absolute 
      bottom-[5%] md:bottom-[8%] lg:bottom-[10%]
      right-[2%] md:right-[5%] lg:right-[8%]
      w-[280px] md:w-[320px]
      backdrop-blur-md bg-white/30 border border-white/20 
      rounded-2xl p-6 shadow-xl text-center
    "
  >
    <div className="w-28 h-28 md:w-32 md:h-32 mx-auto mb-4 rounded-full flex items-center justify-center"
         style={{ background: 'rgba(100, 150, 255, 0.1)' }}>
      <svg className="w-16 h-16 md:w-20 md:h-20 text-brand-blue" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" />
      </svg>
    </div>

    <h3 className="text-lg md:text-xl font-bold text-text-dark mb-2 tracking-wide">
      CRYPTO CURRENCY
    </h3>

    <p className="font-[Fauna One] text-lg text-sm text-text-secondary leading-relaxed">
      Get latest news about online markets, share and stocks
    </p>
  </motion.div>
</div>
      </div>
      {/* Third Screen - Large "NEWS AI" Text */}
      <div className="relative min-h-screen flex items-center justify-center py-20">
        <motion.h2
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, type: 'spring', stiffness: 100, damping: 15 }}
          className="font-cinzel text-[80px] md:text-[150px] lg:text-[200px] xl:text-[280px] font-bold text-center leading-none tracking-wider"
          style={{
            background: 'linear-gradient(135deg, #4169E1 0%, #5B8DEF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          NEWS AI
        </motion.h2>
      </div>
    </section>
  )
}

export default HeroV1