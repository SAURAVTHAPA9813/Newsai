import React, { useState } from 'react'
import { FiTrendingUp, FiEye, FiShare2 } from 'react-icons/fi'

const TrendingPage = () => {
  const [activeTimeFilter, setActiveTimeFilter] = useState('today')
  const [activeCategory, setActiveCategory] = useState('all')

  const timeFilters = ['today', 'this week', 'this month']
  const categories = ['all', 'tech', 'business', 'sports', 'health', 'politics']

  const trendingTopics = [
    '#AIRevolution', '#ClimateAction', '#SpaceExploration',
    '#CryptoMarket', '#HealthTech', '#GlobalPolitics'
  ]

  const trendingArticles = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=500&fit=crop',
      category: 'Technology',
      title: 'AI Breakthrough: New Model Achieves Human-Level Understanding',
      views: '125K',
      shares: '8.5K',
      trending: true,
      featured: true
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=500&fit=crop',
      category: 'Business',
      title: 'Global Markets Rally on Economic Recovery Signs',
      views: '98K',
      shares: '6.2K',
      trending: true
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=800&h=500&fit=crop',
      category: 'Sports',
      title: 'Historic Win: Underdog Team Claims Championship',
      views: '87K',
      shares: '5.8K',
      trending: true
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800&h=500&fit=crop',
      category: 'Health',
      title: 'New Study Reveals Breakthrough in Cancer Treatment',
      views: '76K',
      shares: '4.9K',
      trending: false
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&h=500&fit=crop',
      category: 'Technology',
      title: 'Tech Giants Announce Major Green Energy Initiative',
      views: '65K',
      shares: '4.1K',
      trending: false
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=500&fit=crop',
      category: 'Politics',
      title: 'Summit Concludes with Landmark International Agreement',
      views: '54K',
      shares: '3.7K',
      trending: false
    }
  ]

  const featuredArticle = trendingArticles.find(article => article.featured)
  const regularArticles = trendingArticles.filter(article => !article.featured)

  return (
    <div className="min-h-screen relative">
      {/* Subtle Grid Background Overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(#4169E1 1px, transparent 1px), linear-gradient(90deg, #0943f1ff 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Page Header */}
      <div className="container-custom section-padding p-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-300 rounded-2xl flex items-center justify-center">
              <FiTrendingUp className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="font-cinzel text-4xl font-bold text-text-dark">
                Trending Now
              </h1>
              <p className="text-text-secondary text-lg">
                Discover what's making headlines and capturing attention worldwide
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Time Filters */}
     <section className="sticky top-0 z-40 bg-transparent backdrop-blur-xl pt-4">
  <div className="container-custom">
    <div
      className="
        flex items-center justify-center gap-4 flex-wrap
        rounded-2xl
        px-4 py-3
        bg-white/15
        border border-white/40
        shadow-[0_12px_40px_rgba(15,23,42,0.16)]
        backdrop-blur-xl
      "
    >
      {timeFilters.map((filter) => (
        <button
          key={filter}
          onClick={() => setActiveTimeFilter(filter)}
          className={`px-6 py-2 rounded-lg font-semibold capitalize transition-all ${
            activeTimeFilter === filter
              ? 'bg-brand-blue text-white shadow-lg'
              : 'bg-white/60 text-text-secondary hover:bg-white/90'
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  </div>
</section>


      <div className="container-custom px-8 py-12">
        {/* Trending Topics */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-text-dark mb-6">Trending Topics</h2>
          <div className="flex flex-wrap gap-3">
            {trendingTopics.map((topic, index) => (
              <button
                key={index}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-brand-blue/10 to-blue-100 text-brand-blue font-semibold hover:from-brand-blue/20 hover:to-blue-200 transition-all"
              >
                {topic}
              </button>
            ))}
          </div>
        </section>

        {/* Category Filters */}
        <section className="mb-12">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="font-semibold text-text-dark">Filter by:</span>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2 rounded-lg capitalize transition-all ${
                  activeCategory === category
                    ? 'bg-brand-blue text-white'
                    : 'bg-white border border-gray-200 text-text-secondary hover:border-brand-blue'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Featured Article */}
        {featuredArticle && (
          <section className="mb-16">
            <div
              className="relative glassmorphism rounded-3xl overflow-hidden shadow-xl hover-lift"
              style={{
                background: 'linear-gradient(125deg, rgba(255, 252, 252, 1) 0%, rgba(209, 233, 255, 1) 100%, rgba(242, 246, 255, 1) 53%)'
              }}
            >
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative h-64 md:h-auto">
                  <img
                    src={featuredArticle.image}
                    alt={featuredArticle.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-1 rounded-full font-bold flex items-center gap-2">
                    <FiTrendingUp className="w-4 h-4" />
                    HOT
                  </div>
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <span className="inline-block px-4 py-1 bg-brand-blue/10 text-brand-blue rounded-full font-semibold text-sm mb-4 w-fit">
                    {featuredArticle.category}
                  </span>
                  <h3 className="text-3xl md:text-4xl font-bold text-text-dark mb-6 leading-tight">
                    {featuredArticle.title}
                  </h3>
                  <div className="flex items-center gap-6 text-text-secondary mb-6">
                    <div className="flex items-center gap-2">
                      <FiEye className="w-5 h-5" />
                      <span>{featuredArticle.views} views</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiShare2 className="w-5 h-5" />
                      <span>{featuredArticle.shares} shares</span>
                    </div>
                  </div>
                  <button className="bg-brand-blue text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors w-fit">
                    Read Article
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Trending Articles Grid */}
        <section>
          <h2 className="text-2xl font-bold text-text-dark mb-8">Trending Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularArticles.map(article => (
              <div
                key={article.id}
                className="glassmorphism rounded-2xl overflow-hidden shadow-lg hover-lift"
                style={{
                  background: 'linear-gradient(125deg, rgba(255, 252, 252, 1) 0%, rgba(209, 233, 255, 1) 100%, rgba(242, 246, 255, 1) 53%)'
                }}
              >
                <div className="relative">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                  {article.trending && (
                    <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                      <FiTrendingUp className="w-4 h-4" />
                      Trending
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <span className="inline-block px-3 py-1 bg-brand-blue/10 text-brand-blue rounded-full text-xs font-semibold mb-3">
                    {article.category}
                  </span>
                  <h3 className="text-xl font-bold text-text-dark mb-4 leading-tight">
                    {article.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-text-secondary mb-4">
                    <div className="flex items-center gap-1">
                      <FiEye className="w-4 h-4" />
                      <span>{article.views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiShare2 className="w-4 h-4" />
                      <span>{article.shares}</span>
                    </div>
                  </div>
                  <button className="text-brand-blue font-semibold hover:underline">
                    Read More →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default TrendingPage
