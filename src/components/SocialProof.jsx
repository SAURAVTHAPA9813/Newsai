import React from 'react'
import { motion } from 'framer-motion'
import { FiActivity, FiDatabase, FiZap } from 'react-icons/fi'

const SocialProof = () => {
  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.15
      }
    }
  }

  const statCardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
  }

  const iconPulse = {
    scale: [1, 1.1, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }

  return (
    <section className="relative py-12 overflow-hidden" style={{
      background: 'linear-gradient(to bottom, #F8F9FF 0%, #E7EBFF 100%)'
    }}>
      <div className="container-custom">
        {/* Stats Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
        >
          {/* Stat 1 */}
          <motion.div
            variants={statCardVariants}
            whileHover={{ scale: 1.05, y: -5 }}
            className="flex flex-col items-center text-center space-y-3"
          >
            <motion.div
              animate={iconPulse}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-blue to-blue-600 flex items-center justify-center shadow-lg"
            >
              <FiActivity className="w-8 h-8 text-white" />
            </motion.div>
            <div className="font-cinzel text-4xl font-bold text-brand-blue">
              10,000+
            </div>
            <p className="text-base text-text-secondary font-medium">
              Articles analyzed daily
            </p>
          </motion.div>

          {/* Stat 2 */}
          <motion.div
            variants={statCardVariants}
            whileHover={{ scale: 1.05, y: -5 }}
            className="flex flex-col items-center text-center space-y-3"
          >
            <motion.div
              animate={iconPulse}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-blue to-blue-600 flex items-center justify-center shadow-lg"
            >
              <FiDatabase className="w-8 h-8 text-white" />
            </motion.div>
            <div className="font-cinzel text-4xl font-bold text-brand-blue">
              50+
            </div>
            <p className="text-base text-text-secondary font-medium">
              Trusted publishers
            </p>
          </motion.div>

          {/* Stat 3 */}
          <motion.div
            variants={statCardVariants}
            whileHover={{ scale: 1.05, y: -5 }}
            className="flex flex-col items-center text-center space-y-3"
          >
            <motion.div
              animate={iconPulse}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-blue to-blue-600 flex items-center justify-center shadow-lg"
            >
              <FiZap className="w-8 h-8 text-white" />
            </motion.div>
            <div className="font-cinzel text-4xl font-bold text-brand-blue">
              &lt;2s
            </div>
            <p className="text-base text-text-secondary font-medium">
              Summaries generated
            </p>
          </motion.div>
        </motion.div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-10 text-center"
        >
          <p className="text-sm text-text-secondary font-medium uppercase tracking-wider">
            Powered by AI • Curated by Experts • Trusted by Thousands
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default SocialProof
