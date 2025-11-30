import React from 'react'
import { motion } from 'framer-motion'

const PersonalizationSection = () => {
  // Animation Variants
  const circleVariants = {
    hidden: { scale: 0.8, opacity: 0, rotate: -45 },
    visible: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: { duration: 1, type: 'spring', stiffness: 100, damping: 15 }
    }
  }

  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' }
    }
  }

  const stepsContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.2 }
    }
  }

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
  }

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
    },
    tap: { scale: 0.95 }
  }

  return (
    <section className="relative section-padding overflow-hidden" style={{
      background: ' radial-gradient(circle,rgba(255, 255, 255, 1) 0%, rgba(196, 205, 242, 1) 51%, rgba(196, 205, 242, 1) 51%, rgba(255, 255, 255, 1) 100%)'
    }}>
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Circle Image */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={circleVariants}
            className="order-2 lg:order-1 flex justify-center lg:justify-start"
           >
            <div className="relative w-[350px] h-[350px] md:w-[450px] md:h-[450px] lg:w-[500px] lg:h-[500px]">
              {/* Circle Container */}
              <motion.div
                whileHover={{ scale: 1.0 }}
                animate={{ rotate: [0, -360] }} // anti-clockwise
                transition={{
               duration: 20,          // speed of one full rotation (seconds)
               repeat: Infinity,      // loop forever
               ease: "linear",        // constant speed
               }}
                className="absolute inset-0 rounded-full overflow-hidden shadow-2xl bg-white/10 backdrop-blur-sm border-4 border-white/30"
              >
                <img
                  src="/images/circle.png"
                  alt="How to start with NEWS AI"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to a gradient circle if image doesn't load
                    e.target.style.display = 'none'
                    e.target.parentElement.style.background = 'linear-gradient(135deg, #3d66e3ff 0%, #6181ccff 100%)'
                  }}
                />
              </motion.div>

              {/* Decorative circles around main circle */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm"
              />
              <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-white/15 backdrop-blur-sm"
              />
            </div>
          </motion.div>

          {/* Right - How to Start Text */}
          <div className="order-1 lg:order-2">
            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={titleVariants}
              className="font-cinzel text-3xl md:text-4xl lg:text-5xl font-bold text-text-dark mb-6 leading-tight"
            >
              How to Start with NEWS AI
            </motion.h2>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stepsContainerVariants}
              className="space-y-6"
            >
              <motion.div variants={stepVariants} className="flex gap-4">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-blue flex items-center justify-center text-white font-bold"
                >
                  1
                </motion.div>
                <div>
                  <h3 className="text-xl font-semibold text-text-dark mb-2">
                    Create Your Account
                  </h3>
                  <p className="text-base text-text-secondary leading-relaxed">
                    Sign up in seconds and start your journey to smarter news consumption. No credit card required.
                  </p>
                </div>
              </motion.div>

              <motion.div variants={stepVariants} className="flex gap-4">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-blue flex items-center justify-center text-white font-bold"
                >
                  2
                </motion.div>
                <div>
                  <h3 className="text-xl font-semibold text-text-dark mb-2">
                    Choose Your Interests
                  </h3>
                  <p className="text-base text-text-secondary leading-relaxed">
                    Select topics that matter to you. Our AI learns your preferences and delivers personalized content.
                  </p>
                </div>
              </motion.div>

              <motion.div variants={stepVariants} className="flex gap-4">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-blue flex items-center justify-center text-white font-bold"
                >
                  3
                </motion.div>
                <div>
                  <h3 className="text-xl font-semibold text-text-dark mb-2">
                    Get Smart Summaries
                  </h3>
                  <p className="text-base text-text-secondary leading-relaxed">
                    Receive AI-powered summaries of the latest news, tailored to your interests and delivered in real-time.
                  </p>
                </div>
              </motion.div>
            </motion.div>

            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="mt-8 bg-brand-blue text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors duration-300 shadow-lg"
            >
              Get Started Now
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PersonalizationSection
