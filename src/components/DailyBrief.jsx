import React from 'react'
import { FiZap, FiTrendingUp, FiClock } from 'react-icons/fi'

const DailyBrief = () => {
  const keyInsights = [
    'Technology stocks surge as AI breakthrough announced by major research labs',
    'Global climate summit reaches historic agreement on carbon emissions',
    'Healthcare innovation leads to breakthrough in gene therapy treatment'
  ]

  const trendingTopics = [
    'AI Innovation',
    'Climate Change',
    'Space Exploration',
    'Healthcare',
    'Crypto'
  ]

  return (
    <section className="relative section-padding overflow-hidden" style={{
      background: '#f0f4ff'
    }}>
      {/* Decorative Wireframe Ring Pattern */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full border-2 border-brand-blue/30"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[650px] md:h-[650px] rounded-full border-2 border-brand-blue/20"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] md:w-[800px] md:h-[800px] rounded-full border-2 border-brand-blue/10"></div>
        </div>
      </div>

      <div className="container-custom relative z-10">
        {/* Header - Icon + Title */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {/* Icon */}
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center shadow-lg"
               style={{
                 background: 'linear-gradient(135deg, #4169E1 0%, #8AAAF7 100%)'
               }}>
            <FiZap className="w-8 h-8 md:w-10 md:h-10 text-white" />
          </div>

          {/* Title */}
          <h2 className="font-cinzel text-3xl md:text-4xl lg:text-5xl font-bold text-brand-blue">
            AI Daily Brief
          </h2>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 max-w-6xl mx-auto">
          {/* Left Column - Today's Key Insights */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-brand-blue mb-6">
              Today's Key Insights
            </h3>

            <ul className="space-y-4">
              {keyInsights.map((insight, index) => (
                <li key={index} className="flex gap-3 items-start">
                  {/* Blue Upward Arrow Icon */}
                  <div className="flex-shrink-0 mt-1">
                    <FiTrendingUp className="w-5 h-5 text-brand-blue" />
                  </div>

                  {/* Insight Text */}
                  <p className="text-base text-text-secondary leading-relaxed">
                    {insight}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column - Trending Topics */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-brand-blue mb-6">
              Trending Topics
            </h3>

            {/* Topic Pills */}
            <div className="flex flex-wrap gap-3 mb-6">
              {trendingTopics.map((topic, index) => (
                <span
                  key={index}
                  className="inline-block px-4 py-2 rounded-full bg-brand-blue/10 text-brand-blue font-medium text-sm hover:bg-brand-blue/20 transition-colors cursor-pointer"
                >
                  {topic}
                </span>
              ))}
            </div>

            {/* Timestamp */}
            <div className="flex items-center gap-2 text-sm text-text-secondary mt-8">
              <FiClock className="w-4 h-4" />
              <span>Last updated: 5 minutes ago</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DailyBrief
