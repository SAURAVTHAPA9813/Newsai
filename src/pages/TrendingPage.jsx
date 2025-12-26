import React, { useState, useEffect } from 'react'
import { FiTrendingUp, FiEye, FiShare2 } from 'react-icons/fi'
import trendingAPI from '../services/trendingAPI'
import FocusZenMode from '../components/dashboard/FocusZenMode'

const TrendingPage = () => {
  const [activeTimeFilter, setActiveTimeFilter] = useState('today')
  const [activeCategory, setActiveCategory] = useState('all')
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedArticle, setSelectedArticle] = useState(null)

  const timeFilters = ['today', 'this week', 'this month']
  const categories = ['all', 'tech', 'business', 'sports', 'health', 'politics']

  // Fetch trending articles from daily cache
  useEffect(() => {
    const fetchTrendingArticles = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await trendingAPI.getTrendingArticles(activeCategory)

        if (response.success && response.data.articles) {
          setArticles(response.data.articles)
          console.log('✅ Loaded', response.data.articles.length, 'cached trending articles (category:', activeCategory, ')')
        }
      } catch (err) {
        console.error('❌ Error fetching trending articles:', err)
        setError('Failed to load trending articles')
      } finally {
        setLoading(false)
      }
    }

    fetchTrendingArticles()
  }, [activeCategory])

  // Split articles into featured and regular
  const featuredArticle = articles.length > 0 ? articles[0] : null
  const regularArticles = articles.slice(1)

  // Handle article click - open in Focus Zen Mode
  const handleArticleClick = (article) => {
    setSelectedArticle(article)
  }

  // Close Focus Zen Mode
  const handleCloseFocusZen = () => {
    setSelectedArticle(null)
  }

  return (
    <>
      {/* Focus Zen Mode */}
      {selectedArticle && (
        <FocusZenMode
          article={selectedArticle}
          onClose={handleCloseFocusZen}
          relatedArticles={regularArticles.slice(0, 3)}
        />
      )}

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

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="text-2xl text-brand-blue font-semibold">Loading trending articles...</div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-16">
            <div className="text-2xl text-red-600 font-semibold mb-4">{error}</div>
            <button
              onClick={() => setActiveCategory('all')}
              className="px-6 py-3 bg-brand-blue text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && articles.length === 0 && (
          <div className="text-center py-16">
            <FiTrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-text-dark mb-2">No trending articles found</h3>
            <p className="text-text-secondary">Try selecting a different category</p>
          </div>
        )}

        {/* Featured Article */}
        {!loading && !error && featuredArticle && (
          <section className="mb-16">
            <div
              className="relative glassmorphism rounded-3xl overflow-hidden shadow-xl hover-lift cursor-pointer"
              style={{
                background: 'linear-gradient(125deg, rgba(255, 252, 252, 1) 0%, rgba(209, 233, 255, 1) 100%, rgba(242, 246, 255, 1) 53%)'
              }}
              onClick={() => handleArticleClick(featuredArticle)}
            >
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative h-64 md:h-auto">
                  {featuredArticle.imageUrl ? (
                    <img
                      src={featuredArticle.imageUrl}
                      alt={featuredArticle.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-brand-blue/20 to-sky-200 flex items-center justify-center">
                      <FiTrendingUp className="w-24 h-24 text-brand-blue/40" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-1 rounded-full font-bold flex items-center gap-2">
                    <FiTrendingUp className="w-4 h-4" />
                    FEATURED
                  </div>
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <span className="inline-block px-4 py-1 bg-brand-blue/10 text-brand-blue rounded-full font-semibold text-sm mb-4 w-fit">
                    {featuredArticle.category || 'General'}
                  </span>
                  <h3 className="text-3xl md:text-4xl font-bold text-text-dark mb-6 leading-tight">
                    {featuredArticle.title}
                  </h3>
                  {featuredArticle.description && (
                    <p className="text-text-secondary mb-6 line-clamp-3">
                      {featuredArticle.description}
                    </p>
                  )}
                  <button
                    className="bg-brand-blue text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors w-fit"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleArticleClick(featuredArticle)
                    }}
                  >
                    Read Article
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Trending Articles Grid */}
        {!loading && !error && regularArticles.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-text-dark mb-8">Trending Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularArticles.map((article, index) => (
                <div
                  key={article.id || index}
                  className="glassmorphism rounded-2xl overflow-hidden shadow-lg hover-lift cursor-pointer"
                  style={{
                    background: 'linear-gradient(125deg, rgba(255, 252, 252, 1) 0%, rgba(209, 233, 255, 1) 100%, rgba(242, 246, 255, 1) 53%)'
                  }}
                  onClick={() => handleArticleClick(article)}
                >
                  <div className="relative">
                    {article.imageUrl ? (
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none'
                        }}
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-brand-blue/20 to-sky-200 flex items-center justify-center">
                        <FiTrendingUp className="w-12 h-12 text-brand-blue/40" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                      <FiTrendingUp className="w-4 h-4" />
                      Trending
                    </div>
                  </div>
                  <div className="p-6">
                    <span className="inline-block px-3 py-1 bg-brand-blue/10 text-brand-blue rounded-full text-xs font-semibold mb-3">
                      {article.category || 'General'}
                    </span>
                    <h3 className="text-xl font-bold text-text-dark mb-4 leading-tight line-clamp-2">
                      {article.title}
                    </h3>
                    {article.description && (
                      <p className="text-sm text-text-secondary mb-4 line-clamp-2">
                        {article.description}
                      </p>
                    )}
                    <button
                      className="text-brand-blue font-semibold hover:underline"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleArticleClick(article)
                      }}
                    >
                      Read More →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
      </div>
    </>
  )
}

export default TrendingPage
