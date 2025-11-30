import React from 'react'
import { motion } from 'framer-motion'
import { FiZap, FiFileText, FiTarget, FiShield } from 'react-icons/fi'

const FeatureSection = () => {
  // Animation Variants
  const headerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' }
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  }

  const featureCardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
  }

  const phoneMockupVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.8, type: 'spring', stiffness: 100, damping: 15 }
    }
  }

  const iconRotate = {
    rotate: 360,
    transition: {
      duration: 5,
      repeat: 1,
      ease: 'linear'
    }
  }

  return (
    <section className="relative min-h-screen overflow-hidden py-20" style={{
      background: 'linear-gradient(to bottom, #F8F9FF 0%, #E7EBFF 100%)'
    }}>
      <div className="container-custom">
        {/* Header - Asymmetrical Layout */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={headerVariants}
          className="flex flex-col md:flex-row items-start gap-8 mb-20 pt-12 pb-8"
        >
          {/* Left 40% - Main Heading */}
          <div className="w-full md:w-[50%]">
              <h2 className="font-cinzel text-3xl md:text-5xl lg:text-[56px] font-normal text-text-primary">
             The AI-Powered Intelligence Platform
            </h2>
          </div>

          {/* Right 60% - Description */}
          <div className="w-full md:w-[50%] flex items-start md:pt-0">
            <p className="font-[Fauna One] text-lg text-base md:text-lg text-text-secondary leading-relaxed">
              Forget information overload. Our smart engine analyzes thousands of trusted articles in real-time, instantly summarizes the core facts, and delivers a personalized feed of only what matters most to your world.
            </p>
          </div>
        </motion.div>

        {/* Main Content - Phone Mockup with Feature Grid */}
        <div className="relative flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-8">
          {/* Mobile: Features stacked, Desktop: Grid layout */}
          <div className="w-full max-w-7xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12"
            >
            {/* Left Column - Top and Bottom Features */}
            <div className="flex flex-col justify-around space-y-8 lg:space-y-12 order-1 lg:order-1">
              {/* Real-Time AI Curation */}
              <motion.div
                variants={featureCardVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                className="flex flex-col items-start space-y-4 p-6"
              >
                <motion.div
                  animate={iconRotate}
                  className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-blue to-blue-600 flex items-center justify-center shadow-lg"
                >
                  <FiZap className="w-7 h-7 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-brand-blue">
                  Real-Time AI Curation
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  Our engine constantly analyzes thousands of reputable sources, filtering noise and surfacing vital stories as they break.
                </p>
              </motion.div>

              {/* Personalized News Feed */}
              <motion.div
                variants={featureCardVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                className="flex flex-col items-start space-y-4 p-6"
              >
                <motion.div
                  animate={iconRotate}
                  className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-blue to-blue-600 flex items-center justify-center shadow-lg"
                >
                  <FiTarget className="w-7 h-7 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-brand-blue">
                  Personalized News Feed
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  Your interests drive the platform. Our learning model adapts to your reading habits for a truly relevant experience.
                </p>
              </motion.div>
            </div>

            {/* Center Column - Phone Mockup */}
            <div className="flex items-center justify-center lg:col-span-1 order-2 lg:order-2">
              <motion.div
                variants={phoneMockupVariants}
                whileHover={{ scale: 1.08, rotateY: -8 }}
                className="relative"
                style={{
                  filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.25))'
                }}
              >
                {/* Phone Image */}
                <img
                  src={`${import.meta.env.BASE_URL}images/mobile.png`}
                  alt="Mobile Mockup"
                  className="w-[350px] md:w-[380px] lg:w-[320px] h-auto object-contain mx-auto"
                  style={{
                    transform: 'perspective(1000px) rotateY(-5deg)'
                  }}
                />

                {/* Content Overlay on Phone Screen */}
                <div className="absolute top-[15%] left-[10%] right-[10%] bottom-[15%]">
                  {/* Global Intelligence Card */}
                  <div className="backdrop-blur-md bg-white/90 border border-gray-200 rounded-2xl p-4 shadow-xl">
                    <span className="inline-block px-3 py-1 bg-brand-blue/10 text-brand-blue text-xs font-semibold rounded-full mb-2">
                      GLOBAL INTELLIGENCE
                    </span>

                    <h4 className="text-base font-bold text-text-dark mb-3 leading-tight">
                      AI DRIVES RECORD MARKET SURGE
                    </h4>

                    <img
                      src={`${import.meta.env.BASE_URL}images/white card.png`}
                      alt="News"
                      className="w-full h-24 object-cover rounded-lg mb-2"
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />

                    <p className="text-xs text-text-secondary mb-3 leading-relaxed line-clamp-2">
                      Our smart engine analyzes this real-time financial data, identifying trends and insights.
                    </p>

                    {/* Icon Row */}
                    <div className="flex items-center gap-3 text-gray-400">
                      <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                      <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                      <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Top and Bottom Features */}
            <div className="flex flex-col justify-around space-y-8 lg:space-y-12 order-3 lg:order-3">
              {/* Instant Smart Summaries */}
              <motion.div
                variants={featureCardVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                className="flex flex-col items-start space-y-4 p-6"
              >
                <motion.div
                  animate={iconRotate}
                  className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-blue to-blue-600 flex items-center justify-center shadow-lg"
                >
                  <FiFileText className="w-7 h-7 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-brand-blue">
                  Instant Smart Summaries
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  Get the full context in seconds: AI algorithms summarize complex articles into concise, easy-to-digest briefs.
                </p>
              </motion.div>

              {/* Trusted Source Verification */}
              <motion.div
                variants={featureCardVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                className="flex flex-col items-start space-y-4 p-6"
              >
                <motion.div
                  animate={iconRotate}
                  className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-blue to-blue-600 flex items-center justify-center shadow-lg"
                >
                  <FiShield className="w-7 h-7 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-brand-blue">
                  Trusted Source Verification
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  We ensure credibility. All news is vetted from a continuously updated list of trusted, high-authority publishers.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
      </div>
    </section>
  )
}

export default FeatureSection
