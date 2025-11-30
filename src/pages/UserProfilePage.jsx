import React, { useState, useEffect } from 'react'
import { FiUser, FiMail, FiBookmark, FiSettings, FiLogOut, FiEdit2 } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const UserProfilePage = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout, loading } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, loading, navigate])

  // Dummy saved articles (will be replaced with actual data from backend)
  const savedArticles = [
    {
      id: 1,
      title: 'AI Revolution: How Machine Learning is Transforming Industries',
      category: 'Technology',
      date: '2025-11-14',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop'
    },
    {
      id: 2,
      title: 'Global Markets Show Strong Recovery Signs',
      category: 'Finance',
      date: '2025-11-14',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop'
    },
    {
      id: 3,
      title: 'Cryptocurrency Adoption Reaches New Milestones',
      category: 'Crypto',
      date: '2025-11-13',
      image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=600&h=400&fit=crop'
    }
  ]

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-page-bg pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl text-brand-blue">Loading...</div>
        </div>
      </div>
    )
  }

  // Don't render if not authenticated (will redirect)
  if (!user || !isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-page-bg pt-20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand-blue/10 to-purple-100 py-16">
        <div className="container-custom">
          <div className="flex items-center gap-6">
            {/* Profile Avatar */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-blue to-purple-500 flex items-center justify-center text-white text-3xl font-bold shadow-xl">
              {user.name.charAt(0)}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h1 className="font-cinzel text-3xl md:text-4xl font-bold text-text-dark mb-2">
                {user.name}
              </h1>
              <p className="text-text-secondary flex items-center gap-2">
                <FiMail className="w-4 h-4" />
                {user.email}
              </p>
              <p className="text-sm text-text-secondary mt-1">
                Member since {user.joinedDate}
              </p>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-white/60 text-text-dark hover:bg-red-50 hover:text-red-600 transition-all border border-white/20"
            >
              <FiLogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="sticky top-20 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200 py-4">
        <div className="container-custom">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'profile'
                  ? 'bg-brand-blue text-white shadow-lg'
                  : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
              }`}
            >
              <FiUser className="w-4 h-4" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'saved'
                  ? 'bg-brand-blue text-white shadow-lg'
                  : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
              }`}
            >
              <FiBookmark className="w-4 h-4" />
              Saved Articles ({user.savedArticlesCount})
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'settings'
                  ? 'bg-brand-blue text-white shadow-lg'
                  : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
              }`}
            >
              <FiSettings className="w-4 h-4" />
              Settings
            </button>
          </div>
        </div>
      </section>

      <div className="container-custom section-padding">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="max-w-3xl">
            <div className="backdrop-blur-md bg-white/30 border border-white/20 rounded-2xl p-8 shadow-xl"
              style={{
                background: 'linear-gradient(125deg, rgba(255, 252, 252, 1) 0%, rgba(209, 233, 255, 1) 100%, rgba(242, 246, 255, 1) 53%)'
              }}
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-text-dark">Profile Information</h2>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-blue/10 text-brand-blue hover:bg-brand-blue/20 transition-all">
                  <FiEdit2 className="w-4 h-4" />
                  Edit
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-semibold text-text-secondary mb-2 block">Full Name</label>
                  <p className="text-lg text-text-dark">{user.name}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-text-secondary mb-2 block">Email Address</label>
                  <p className="text-lg text-text-dark">{user.email}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-text-secondary mb-2 block">Subscribed Categories</label>
                  <div className="flex flex-wrap gap-2">
                    {user.preferences.categories.map((category, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-brand-blue text-white rounded-full text-sm font-semibold"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-text-secondary mb-2 block">Favorite Topics</label>
                  <div className="flex flex-wrap gap-2">
                    {user.preferences.topics.map((topic, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-purple-100 text-purple-600 rounded-full text-sm font-semibold"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Saved Articles Tab */}
        {activeTab === 'saved' && (
          <div>
            <h2 className="text-2xl font-bold text-text-dark mb-8">Your Saved Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {savedArticles.map(article => (
                <article
                  key={article.id}
                  className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                  style={{
                    background: 'linear-gradient(125deg, rgba(255, 252, 252, 1) 0%, rgba(209, 233, 255, 1) 100%, rgba(242, 246, 255, 1) 53%)'
                  }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-brand-blue">
                      {article.category}
                    </span>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-text-dark mb-3 leading-tight line-clamp-2">
                      {article.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-text-secondary">
                      <span>{new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      <button className="text-red-500 hover:text-red-700 font-semibold">
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="max-w-3xl">
            <div className="backdrop-blur-md bg-white/30 border border-white/20 rounded-2xl p-8 shadow-xl"
              style={{
                background: 'linear-gradient(125deg, rgba(255, 252, 252, 1) 0%, rgba(209, 233, 255, 1) 100%, rgba(242, 246, 255, 1) 53%)'
              }}
            >
              <h2 className="text-2xl font-bold text-text-dark mb-8">Account Settings</h2>

              <div className="space-y-6">
                <div className="pb-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-text-dark mb-2">Change Password</h3>
                  <p className="text-sm text-text-secondary mb-4">Update your password to keep your account secure</p>
                  <button className="px-6 py-2 rounded-lg bg-brand-blue text-white font-semibold hover:bg-blue-700 transition-all">
                    Update Password
                  </button>
                </div>

                <div className="pb-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-text-dark mb-2">Email Notifications</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-brand-blue" />
                      <span className="text-text-secondary">Daily news digest</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-brand-blue" />
                      <span className="text-text-secondary">Trending articles</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded text-brand-blue" />
                      <span className="text-text-secondary">Newsletter</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-text-dark mb-2">Delete Account</h3>
                  <p className="text-sm text-text-secondary mb-4">Permanently delete your account and all associated data</p>
                  <button className="px-6 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-all">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserProfilePage
