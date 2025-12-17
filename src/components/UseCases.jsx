import React from 'react'
import { motion } from 'framer-motion'
import { FiTrendingUp, FiBriefcase, FiBook, FiSearch } from 'react-icons/fi'

const UseCases = () => {
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

  const useCases = [
    {
      icon: FiTrendingUp,
      title: 'Investors & Traders',
      description: 'Track markets, macro moves, and crypto without staring at charts all day. Stay ahead of breaking financial news that impacts your portfolio.',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      icon: FiBriefcase,
      title: 'Founders & Executives',
      description: 'Stay ahead of industry shifts, competitor moves, and global trends. Make informed decisions with real-time intelligence at your fingertips.',
       gradient: 'from-blue-500 to-blue-600'
    },
    {
      icon: FiBook,
      title: 'Knowledge Workers & Students',
      description: 'Turn hours of reading into minutes with smart summaries. Focus on learning and understanding, not endless scrolling.',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      icon: FiSearch,
      title: 'Researchers & Journalists',
      description: 'Quickly map how a story is evolving across different sources. Compare perspectives and identify emerging narratives in real-time.',
      gradient: 'from-blue-500 to-blue-600'
    }
  ]

  return (
    <section className="relative section-padding overflow-hidden" style={{
      background: 'linear-gradient(to bottom, #F8F9FF 0%, #E7EBFF 100%)'
    }}>
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={headerVariants}
          className="text-center mb-16"
        >
          <h2 className="font-cinzel text-3xl md:text-4xl lg:text-5xl font-bold text-text-dark mb-4">
            Built for People Who Can't Afford to Miss What Matters
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            Whether you're tracking markets, building a company, or staying informed, NEWS AI delivers the intelligence you need.
          </p>
        </motion.div>

        {/* Use Cases Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={gridContainerVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10"
        >
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ scale: 1.05, y: -10, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
                className="group backdrop-blur-md bg-white/60 border border-white/80 rounded-3xl p-8 shadow-xl"
              >
                {/* Icon */}
                <motion.div
                  variants={iconVariants}
                  whileHover={{ rotate: 360, scale: 1.15 }}
                  transition={{ duration: 0.6 }}
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${useCase.gradient} flex items-center justify-center shadow-lg mb-6`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </motion.div>

                {/* Title */}
                <h3 className="font-cinzel text-2xl font-bold text-text-dark mb-4">
                  {useCase.title}
                </h3>

                {/* Description */}
                <p className="text-base text-text-secondary leading-relaxed">
                  {useCase.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

export default UseCases
