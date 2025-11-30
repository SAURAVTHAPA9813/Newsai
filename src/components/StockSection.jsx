import React from 'react'
import { motion } from 'framer-motion'
import { FiTrendingUp, FiBarChart2, FiDollarSign } from 'react-icons/fi'

const StockSection = () => {
  // Animation Variants
  const headerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' }
    }
  }

  const gridContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
  }

  const iconVariants = {
    hidden: { rotate: -180, scale: 0 },
    visible: {
      rotate: 0,
      scale: 1,
      transition: { duration: 0.6, type: 'spring', stiffness: 100, damping: 15 }
    }
  }

  const stockCards = [
    {
      icon: FiTrendingUp,
      title: 'Market Trends',
      description: 'Stay ahead with real-time market trends and analysis. Track the latest movements in global stock markets and make informed investment decisions.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: FiBarChart2,
      title: 'Stock Analysis',
      description: 'Get comprehensive stock analysis powered by AI. Understand market dynamics, company performance, and future projections with detailed insights.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: FiDollarSign,
      title: 'Investment Insights',
      description: 'Discover smart investment opportunities with AI-driven recommendations. Maximize returns and minimize risks with data-backed financial guidance.',
      color: 'from-blue-500 to-blue-600'
    }
  ]

  return (
    <section className="section-padding bg-section-bg">
      <div className="container-custom">
        {/* Heading */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={headerVariants}
          className="text-center mb-12"
        >
          <h2 className="font-cinzel text-3xl md:text-4xl lg:text-5xl font-bold text-text-dark mb-4 leading-tight">
            Powerful for Markets & Crypto
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            Whether you're tracking stocks, crypto, or global markets, NEWS AI delivers the intelligence you need to stay ahead of financial movements.
          </p>
        </motion.div>

        {/* Crypto Background Image */}
        <motion.img
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          animate={{ y: [0, -20, 0] }}
          style={{ animationDuration: '4s', animationIterationCount: 'infinite' }}
          src="/images/coin.png"
          alt="Crypto Background"
          onError={(e) => {
            e.target.style.display = 'none'
            console.log('Crypto background image not found')
          }}
        />



        {/* Three Stock Cards with Glassmorphism */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={gridContainerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {stockCards.map((card, index) => {
            const Icon = card.icon
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ scale: 1.05, y: -10, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
                className="backdrop-blur-md bg-white/30 border border-white/20 rounded-2xl p-8 shadow-xl"
              >
                {/* Icon */}
                <div className="mb-6 flex justify-center">
                  <motion.div
                    variants={iconVariants}
                    whileHover={{ rotate: 360, scale: 1.15 }}
                    transition={{ duration: 0.6 }}
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </motion.div>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-text-dark mb-4 text-center">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="text-text-secondary leading-relaxed text-center mb-6">
                  {card.description}
                </p>

                {/* CTA Button */}
                <div className="flex justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-brand-blue text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors duration-300 shadow-md"
                  >
                    Learn More
                  </motion.button>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
          </div>
    </section>
  )
}

export default StockSection
