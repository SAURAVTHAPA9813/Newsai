import React from 'react'

const LatestNews = () => {
  const newsArticles = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop',
      category: 'Technology',
      title: 'AI Revolution: How Machine Learning is Transforming Industries',
      summary: 'Artificial intelligence continues to reshape business landscapes across sectors, from healthcare to finance.',
      date: '2025-11-14',
      source: 'Tech Insider',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop',
      category: 'Finance',
      title: 'Global Markets Show Strong Recovery Signs',
      summary: 'Stock markets worldwide demonstrate resilience as economic indicators point to sustained growth.',
      date: '2025-11-14',
      source: 'Financial Times',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=600&h=400&fit=crop',
      category: 'Crypto',
      title: 'Cryptocurrency Adoption Reaches New Milestones',
      summary: 'Digital currencies gain mainstream acceptance as more institutions integrate blockchain technology.',
      date: '2025-11-13',
      source: 'Crypto Daily',
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&h=400&fit=crop',
      category: 'Business',
      title: 'Startups Reshape Traditional Business Models',
      summary: 'Innovation and agility drive new companies to challenge established industry giants.',
      date: '2025-11-13',
      source: 'Business Weekly',
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop',
      category: 'Technology',
      title: 'Quantum Computing Breakthrough Announced',
      summary: 'Scientists achieve major milestone in quantum computing, opening new possibilities for complex problem-solving.',
      date: '2025-11-12',
      source: 'Science Today',
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&h=400&fit=crop',
      category: 'World News',
      title: 'Global Climate Summit Yields New Agreements',
      summary: 'World leaders commit to ambitious targets as climate action takes center stage in international policy.',
      date: '2025-11-12',
      source: 'World Report',
    },
  ]

  return (
    <section className="section-padding bg-page-bg">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-cinzel text-3xl md:text-4xl lg:text-5xl font-semibold text-text-dark mb-4">
            Latest News
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Stay updated with the most recent stories curated by our AI engine
          </p>
        </div>

        {/* News Grid - 2 rows x 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsArticles.map((article) => (
            <article
              key={article.id}
              className="card-news"
              style={{
                background: 'linear-gradient(125deg, rgba(255, 252, 252, 1) 0%, rgba(209, 233, 255, 1) 100%, rgba(242, 246, 255, 1) 53%)'
              }}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
                {/* Category Badge on Image */}
                <span className="absolute top-4 left-4 badge bg-white/90 backdrop-blur-sm">
                  {article.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Title */}
                <h3 className="text-xl font-bold text-text-dark mb-3 leading-tight line-clamp-2">
                  {article.title}
                </h3>

                {/* Summary */}
                <p className="text-text-secondary text-sm leading-relaxed mb-4 line-clamp-3">
                  {article.summary}
                </p>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs text-text-secondary mb-4">
                  <span>{article.source}</span>
                  <span>{new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>

                {/* Read More Link */}
                <a
                  href="#"
                  className="text-brand-blue font-semibold text-sm hover:underline inline-flex items-center gap-1"
                >
                  Read More
                  <span>→</span>
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="btn-secondary">
            View All News
          </button>
        </div>
      </div>
    </section>
  )
}

export default LatestNews
