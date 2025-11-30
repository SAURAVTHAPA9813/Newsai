import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FiCheck } from 'react-icons/fi'

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState('monthly')

  // Animation Variants
  const headerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 40 },
    visible: (index) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { 
        duration: 0.6, 
        delay: index * 0.15,
        type: 'spring', 
        stiffness: 100, 
        damping: 15 
      }
    })
  }

  const toggleVariants = {
    tap: { scale: 0.95 }
  }

  // Pricing Data
  const pricingPlans = [
    {
      name: 'Pro',
      monthlyPrice: 15,
      quarterlyPrice: 135,
      description: 'Perfect for individuals',
      features: [
        'AI-powered news summaries',
        'Personalized feed curation',
        'Real-time updates',
        '100+ trusted sources',
        'Basic analytics',
        'Email support'
      ],
      buttonText: 'Get Started',
      buttonStyle: 'outline'
    },
    {
      name: 'Pro Plus',
      monthlyPrice: 25,
      quarterlyPrice: 225,
      description: 'Best for professionals',
      features: [
        'Everything in Pro',
        'Advanced AI insights',
        'Custom news categories',
        '500+ premium sources',
        'Advanced analytics dashboard',
        'Priority support',
        'API access',
        'Team collaboration (up to 5)'
      ],
      buttonText: 'Get Started',
      buttonStyle: 'outline',
      popular: true
    },
    {
      name: 'Custom',
      isCustom: true,
      description: 'Tailored for enterprises',
      features: [
        'Everything in Pro Plus',
        'Unlimited team members',
        'Custom AI training',
        'White-label solution',
        'Dedicated account manager',
        'SLA guarantee',
        'Custom integrations',
        'Advanced security features'
      ],
      buttonText: "Let's Talk!",
      buttonStyle: 'gradient'
    }
  ]

  const getPrice = (plan) => {
    if (plan.isCustom) return null
    return billingCycle === 'monthly' ? plan.monthlyPrice : plan.quarterlyPrice
  }

  return (
    <section 
      id="pricing" 
      className="relative section-padding overflow-hidden" 
      style={{
        background: 'linear-gradient(to bottom, #FAFBFF 0%, #F0F2F5 100%)'
      }}
    >
      <div className="container-custom max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={headerVariants}
          className="text-center mb-12"
        >
          <h2 className="font-cinzel text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Choose your right plan!
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Select the perfect plan that fits your needs and budget.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white rounded-full p-1.5 shadow-lg border border-gray-200">
            <motion.button
              variants={toggleVariants}
              whileTap="tap"
              onClick={() => setBillingCycle('monthly')}
              className={`
                relative px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300
                ${billingCycle === 'monthly' 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' 
                  : 'text-gray-600 hover:text-gray-900'
                }
              `}
            >
              Monthly
            </motion.button>
            <motion.button
              variants={toggleVariants}
              whileTap="tap"
              onClick={() => setBillingCycle('quarterly')}
              className={`
                relative px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300
                ${billingCycle === 'quarterly' 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' 
                  : 'text-gray-600 hover:text-gray-900'
                }
              `}
            >
              Quarterly 
              <span className={billingCycle === 'quarterly' ? 'text-white' : 'text-blue-600'}>
                {' '}(save 10%)
              </span>
            </motion.button>
          </div>
        </motion.div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-6">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
              whileHover={{ 
                y: -8, 
                transition: { duration: 0.3 } 
              }}
              className={`
                relative bg-white rounded-3xl p-8 shadow-xl
                ${plan.popular ? 'ring-2 ring-blue-500' : 'border border-gray-200'}
                overflow-hidden
              `}
            >
              {/* Custom Plan Gradient Background */}
              {plan.isCustom && (
                <div 
                  className="absolute inset-0 opacity-40 pointer-events-none"
                  style={{
                    background: 'linear-gradient(154deg, rgba(163, 194, 255, 1) 0%, rgba(240, 242, 245, 1) 100%)'
                  }}
                />
              )}

              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-1.5 rounded-bl-2xl text-xs font-bold">
                  MOST POPULAR
                </div>
              )}

              <div className="relative z-10">
                {/* Plan Name Badge */}
                <div className="inline-flex items-center bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
                  {plan.name}
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-6">
                  {plan.description}
                </p>

                {/* Pricing */}
                <div className="mb-8">
                  {plan.isCustom ? (
                    <div className="mb-2">
                      <h3 className="text-4xl font-bold text-gray-900">
                        Let's Talk!
                      </h3>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-5xl font-bold text-gray-900">
                        ${getPrice(plan)}
                      </span>
                      <span className="text-gray-500 text-base">
                        /month
                      </span>
                    </div>
                  )}
                  {!plan.isCustom && billingCycle === 'quarterly' && (
                    <p className="text-sm text-green-600 font-medium">
                      Billed ${getPrice(plan) * 3} quarterly
                    </p>
                  )}
                </div>

                {/* Features List */}
                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-start gap-3"
                    >
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                        <FiCheck className="w-3.5 h-3.5 text-blue-600" />
                      </div>
                      <span className="text-sm text-gray-700">
                        {feature}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    w-full px-6 py-3.5 rounded-xl font-semibold text-base transition-all duration-300
                    ${plan.buttonStyle === 'gradient'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl'
                      : plan.buttonStyle === 'outline'
                      ? 'border-2 border-blue-600 text-gray-900 hover:bg-blue-600 hover:text-white'
                      : 'bg-blue-600 text-white hover:bg-blue-800'
                    }
                  `} 
                >
                  {plan.buttonText}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-center mt-12"
        >
          <p className="text-base text-gray-600">
            All plans include a 14-day free trial. No credit card required.{' '}
            <a href="#faq" className="text-blue-600 font-semibold hover:underline">
              View FAQ
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default Pricing