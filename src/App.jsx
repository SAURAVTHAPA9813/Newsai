import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Import layouts
import PublicLayout from './layouts/PublicLayout'
import DashboardLayout from './layouts/DashboardLayout'

// Import public pages
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import LoginPage from './pages/LoginPage'

// Import dashboard pages
import ControlCenterPage from './pages/ControlCenterPage'
import VerifyHubPage from './pages/VerifyHubPage'
import TopicMatrixPage from './pages/TopicMatrixPage'
import IQLabPage from './pages/IQLabPage'
import NeuralAnalyticsPage from './pages/NeuralAnalyticsPage'
import TrendingPage from './pages/TrendingPage'
import UserProfilePage from './pages/UserProfilePage'

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes with Navbar + Footer */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Protected dashboard routes with Sidebar only */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<ControlCenterPage />} />
          <Route path="/verify-hub" element={<VerifyHubPage />} />
          <Route path="/topic-matrix" element={<TopicMatrixPage />} />
          <Route path="/iq-lab" element={<IQLabPage />} />
          <Route path="/neural-analytics" element={<NeuralAnalyticsPage />} />
          <Route path="/trending" element={<TrendingPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
