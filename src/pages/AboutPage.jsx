import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiZap, FiCpu, FiShield, FiMail, FiMapPin, FiPhone, FiMessageCircle, FiLinkedin, FiTwitter, FiGithub, FiSend } from 'react-icons/fi'

const AboutPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })

  const features = [
    {
      icon: FiZap,
      title: 'AI-Powered Curation',
      description: 'Advanced algorithms analyze thousands of sources to bring you only what matters.'
    },
    {
      icon: FiCpu,
      title: 'Smart Summaries',
      description: 'Get the full story in seconds with AI-generated summaries of complex articles.'
    },
    {
      icon: FiShield,
      title: 'Trusted Sources',
      description: 'Only verified, credible news from reputable publishers makes it to your feed.'
    }
  ]

  const steps = [
    {
      number: '01',
      title: 'Select Your Interests',
      description: 'Choose topics and categories that matter to you',
      progress: 85
    },
    {
      number: '02',
      title: 'AI Analyzes & Curates',
      description: 'Our engine processes thousands of articles in real-time',
      progress: 92
    },
    {
      number: '03',
      title: 'Receive Personalized News',
      description: 'Get summaries and updates tailored to your preferences',
      progress: 78
    }
  ]

  const techStack = [
    { name: 'Real-Time Analysis', icon: FiZap },
    { name: 'NLP Technology', icon: FiCpu },
    { name: 'Machine Learning', icon: FiShield },
    { name: 'Verified Sources', icon: FiMessageCircle }
  ]

  const contactMethods = [
    {
      icon: FiMail,
      title: 'Email',
      primary: 'contact@newsai.com',
      secondary: 'support@newsai.com',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: FiPhone,
      title: 'Phone',
      primary: '+1 (555) 123-4567',
      secondary: 'Mon-Fri 9AM-6PM PST',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: FiMapPin,
      title: 'Location',
      primary: 'Silicon Valley, CA',
      secondary: 'United States',
      color: 'from-indigo-500 to-indigo-600'
    }
  ]

  const socialLinks = [
    { icon: FiLinkedin, name: 'LinkedIn', url: '#' },
    { icon: FiTwitter, name: 'Twitter', url: '#' },
    { icon: FiGithub, name: 'GitHub', url: '#' },
    { icon: FiMessageCircle, name: 'Discord', url: '#' }
  ]

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  const boxVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  }

  const scaleVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  }

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Hero Section - Split Screen */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Text Content */}
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="space-y-6"
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="inline-block"
              >
                <span className="text-brand-blue text-sm font-bold tracking-widest uppercase">
                  Next Generation News Platform
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="font-cinzel text-5xl md:text-7xl font-bold text-text-dark leading-tight"
              >
                About{' '}
                <span className="text-gradient">NEWS AI</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="text-xl md:text-2xl text-text-secondary leading-relaxed"
              >
                Revolutionizing how you consume news with{' '}
                <span className="text-brand-blue font-bold">AI-powered intelligence</span>{' '}
                and personalization
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="flex gap-4 pt-4"
              >
                <div className="h-1 w-32 bg-gradient-to-r from-brand-blue to-purple-500 rounded-full"></div>
                <div className="h-1 w-24 bg-gradient-to-r from-purple-500 to-blue-400 rounded-full"></div>
                <div className="h-1 w-16 bg-gradient-to-r from-blue-400 to-brand-blue rounded-full"></div>
              </motion.div>
            </motion.div>

            {/* Right Side - CIRCLE AI Image */}
            <motion.div
              initial={{ x: 100, opacity: 0, scale: 0.8 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="relative"
            >
              <motion.div
                animate={{
                  rotate: 360
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'linear'
                }}
                className="relative"
              >
                <img
                  src={`${import.meta.env.BASE_URL}images/CIRCLE AI.png`}
                  alt="AI Visualization"
                  className="w-full h-auto drop-shadow-2xl"
                />
                {/* Subtle rings around image */}
                <div className="absolute inset-0 rounded-full border-2 border-brand-blue/20 animate-ping"></div>
                <div className="absolute inset-0 rounded-full border-2 border-purple-500/20 animate-pulse"></div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Background subtle grid */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(#4169E1 1px, transparent 1px), linear-gradient(90deg, #4169E1 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </section>

      {/* What is NEWS AI - Glassy Blur Light Blue Cards */}
      <section className="section-padding relative bg-gradient-to-br from-white via-blue-50 to-blue-20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-cinzel text-4xl md:text-5xl font-bold text-text-dark mb-6">
              What is{' '}
              <span className="text-gradient">NEWS AI</span>?
            </h2>
            <div className="h-1 w-32 bg-gradient-to-r from-brand-blue via-blue-200 to-blue-400 mx-auto rounded-full"></div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  variants={boxVariants}
                  whileHover={{ scale: 1.0, y: -10 }}
                  className="relative overflow-hidden group rounded-2xl"
                  style={{
                    background: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(65, 105, 225, 0.2)',
                    boxShadow: '0 8px 32px rgba(65, 105, 225, 0.1)'
                  }}
                >
                  <div className="p-8">
                    {/* Icon with gradient background */}
                    <motion.div
                      animate={{
                        rotate: [0, 360]
                      }}
                      transition={{
                        duration: 5,
                        repeat: 1,
                        ease: 'linear'
                      }}
                      className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-brand-blue to-blue-200 flex items-center justify-center shadow-lg"
                    >
                      <Icon className="w-10 h-10 text-white" />
                    </motion.div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-text-dark mb-4 text-center">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-text-secondary leading-relaxed text-center">
                      {feature.description}
                    </p>
                  </div>

                  {/* Hover gradient overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-brand-blue/5 to-blue-200/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                  />
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding bg-white relative overflow-hidden">
        <div className="container-custom max-w-4xl mx-auto text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="font-cinzel text-3xl md:text-4xl font-bold text-text-dark mb-8"
          >
            Our <span className="text-gradient">Mission</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <blockquote className="text-2xl md:text-4xl font-bold text-brand-blue mb-6 leading-relaxed italic border-l-4 border-brand-blue pl-6 bg-gradient-to-r from-blue-50 to-transparent py-6">
              "To make staying informed effortless, accurate, and personalized for everyone."
            </blockquote>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-lg text-text-secondary leading-relaxed"
          >
            We envision a world where people can trust their news sources, save time, and stay connected to what truly matters—all powered by cutting-edge AI technology.
          </motion.p>
        </div>

        {/* Background particles */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-brand-blue rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.6, 0.2]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>
      </section>

      {/* How It Works - With SLIME and Progress Bars */}
      <section className="section-padding bg-gradient-to-br from-blue-50 to-blue-20 relative">
        <div className="container-custom">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-cinzel text-3xl md:text-4xl font-bold text-text-dark text-center mb-16"
          >
            How <span className="text-gradient">NEWS AI</span> Works
          </motion.h2>

          {/* SLIME background image */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 opacity-5">
            <motion.img
                src={`${import.meta.env.BASE_URL}images/SLIME.png`}
                alt="Slime"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: 'linear'
                }}
                className="w-full h-full object-contain"
              />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="relative"
              >
                {/* Connecting line */}
                {index < steps.length - 1 && (
                  <motion.div
                    className="hidden md:block absolute top-1/2 -right-4 w-8 h-1 bg-gradient-to-r from-brand-blue to-blue-200 z-20"
                    animate={{
                      opacity: [0.3, 1, 0.3]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity
                    }}
                  />
                )}

                <div className="glassmorphism rounded-2xl p-8 hover-lift border border-brand-blue/10 relative overflow-hidden group">
                  {/* Step number */}
                  <div className="text-7xl font-bold text-brand-blue/20 mb-4 font-mono">
                    {step.number}
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-text-dark mb-4">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-text-secondary leading-relaxed mb-6">
                    {step.description}
                  </p>

                  {/* Progress bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-brand-blue font-semibold">Processing</span>
                      <span className="text-text-dark font-mono">{step.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${step.progress}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.2 + 0.5, duration: 1 }}
                        className="h-full bg-gradient-to-r from-brand-blue to-purple-500 shadow-lg"
                      />
                    </div>
                  </div>

                  {/* Hover effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-blue-50/50 to-transparent pointer-events-none rounded-2xl"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-cinzel text-3xl md:text-4xl font-bold text-text-dark mb-8">
              Powered by Advanced{' '}
              <span className="text-gradient">AI</span>
            </h2>
            <p className="text-lg text-text-secondary leading-relaxed">
              Our platform leverages state-of-the-art natural language processing, machine learning, and real-time data analysis to deliver unparalleled news intelligence.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {techStack.map((tech, index) => {
              const Icon = tech.icon
              return (
                <motion.div
                  key={index}
                  variants={scaleVariants}
                  whileHover={{
                    scale: 1.1,
                    transition: { duration: 0.3 }
                  }}
                  className="glassmorphism-light rounded-xl p-6 text-center border border-brand-blue/20 relative overflow-hidden group cursor-pointer"
                >
                  <Icon className="w-8 h-8 text-brand-blue mx-auto mb-3" />
                  <p className="font-bold text-text-dark text-sm">
                    {tech.name}
                  </p>

                  {/* Hover gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Contact Section - Modern & Interactive */}
      <section className="section-padding bg-gradient-to-br from-blue-50 via-blue-20 to-blue-50 relative overflow-hidden">
        <div className="container-custom max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-cinzel text-4xl md:text-5xl font-bold text-text-dark mb-4">
              Let's <span className="text-gradient">Connect</span>
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Have questions about NEWS AI? Want to partner with us? We'd love to hear from you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Side - Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glassmorphism rounded-3xl p-8 shadow-xl border border-brand-blue/20"
            >
              <h3 className="text-2xl font-bold text-text-dark mb-6">Send us a message</h3>

              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-text-dark mb-2">Your Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-brand-blue/20 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-brand-blue transition-all text-text-dark"
                    placeholder="Saura Thapa"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-dark mb-2">Email Address</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-xl border border-brand-blue/20 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-brand-blue transition-all text-text-dark"
                    placeholder="saurav@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-dark mb-2">Message</label>
                  <textarea
                    rows="4"
                    className="w-full px-4 py-3 rounded-xl border border-brand-blue/20 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-brand-blue transition-all resize-none text-text-dark"
                    placeholder="Tell us how we can help..."
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-brand-blue to-blue-400 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <FiSend className="w-5 h-5" />
                  Send Message
                </motion.button>
              </form>
            </motion.div>

            {/* Right Side - Contact Info & Social */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {/* Contact Methods */}
              <div className="space-y-4">
                {contactMethods.map((method, index) => {
                  const Icon = method.icon
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ x: 10 }}
                      className="glassmorphism rounded-2xl p-6 border border-brand-blue/20 hover-lift group"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-text-dark mb-1">{method.title}</h4>
                          <p className="text-brand-blue font-semibold">{method.primary}</p>
                          <p className="text-text-secondary text-sm">{method.secondary}</p>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {/* Social Links */}
              <div className="glassmorphism rounded-2xl p-6 border border-brand-blue/20">
                <h4 className="text-lg font-bold text-text-dark mb-4">Follow Us</h4>
                <div className="grid grid-cols-4 gap-3">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon
                    return (
                      <motion.a
                        key={index}
                        href={social.url}
                        whileHover={{ scale: 1.0 }}
                        whileTap={{ scale: 0.5 }}
                        className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-900 to-blue-500 flex items-center justify-center hover:shadow-lg transition-all cursor-pointer"
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </motion.a>
                    )
                  })}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="glassmorphism rounded-2xl p-6 border border-brand-blue/20">
                <h4 className="text-lg font-bold text-text-dark mb-4">Quick Stats</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gradient mb-1">24/7</div>
                    <div className="text-sm text-text-secondary">Support</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gradient mb-1">&lt;1h</div>
                    <div className="text-sm text-text-secondary">Response Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gradient mb-1">100K+</div>
                    <div className="text-sm text-text-secondary">Active Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gradient mb-1">4.9★</div>
                    <div className="text-sm text-text-secondary">User Rating</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Floating shapes */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'linear'
          }}
          className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-br from-brand-blue/10 to-blue-200/10 rounded-full blur-2xl"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [360, 180, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear'
          }}
          className="absolute bottom-10 left-10 w-40 h-40 bg-gradient-to-br from-purple-200/10 to-blue-400/10 rounded-full blur-2xl"
        />
      </section>

      {/* Footer accent */}
      <div className="h-1 bg-gradient-to-r from-brand-blue via-purple-200 to-blue-400"></div>
    </div>
  )
}

export default AboutPage
