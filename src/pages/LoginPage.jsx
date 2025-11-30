import React, { useState, useEffect, useRef } from 'react'
import { FiMail, FiLock, FiUser, FiCheck } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const LoginPage = () => {
  const [isSignUp, setIsSignUp] = useState(false)
  const canvasRef = useRef(null)
  const navigate = useNavigate()
  const { login, signup, isAuthenticated } = useAuth()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  // Form states
  const [signInData, setSignInData] = useState({ email: '', password: '', remember: false })
  const [signUpData, setSignUpData] = useState({ name: '', email: '', password: '', confirmPassword: '' })

  // Neural Network Background Animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Particle class for neural network nodes
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.vx = (Math.random() - 0.5) * 1
        this.vy = (Math.random() - 0.5) * 1
        this.radius = Math.random() * 4 + 2
      }

      update() {
        this.x += this.vx
        this.y += this.vy

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1
      }

      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 3)
        gradient.addColorStop(0, 'rgba(0, 153, 255, 0.8)')
        gradient.addColorStop(1, 'rgba(0, 212, 255, 0.2)')
        ctx.fillStyle = gradient
        ctx.fill()
      }
    }

    // Create particles
    const particles = []
    for (let i = 0; i < 100; i++) {
      particles.push(new Particle())
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particles.forEach(particle => {
        particle.update()
        particle.draw()
      })

      // Draw connections
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            const opacity = (1 - distance / 150) * 0.3
            ctx.strokeStyle = `rgba(0, 153, 255, ${opacity})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        })
      })

      requestAnimationFrame(animate)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const handleSignIn = (e) => {
    e.preventDefault()

    // For now, simulate login (will integrate with backend API later)
    const userData = {
      name: signInData.email.split('@')[0],
      email: signInData.email,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      savedArticlesCount: 0,
      preferences: {
        categories: [],
        topics: []
      }
    }

    const fakeToken = 'fake-jwt-token-' + Date.now()
    login(userData, fakeToken)
    navigate('/dashboard')
  }

  const handleSignUp = (e) => {
    e.preventDefault()
    if (signUpData.password !== signUpData.confirmPassword) {
      alert('Passwords do not match!')
      return
    }

    // For now, simulate signup (will integrate with backend API later)
    const userData = {
      name: signUpData.name,
      email: signUpData.email,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      savedArticlesCount: 0,
      preferences: {
        categories: [],
        topics: []
      }
    }

    const fakeToken = 'fake-jwt-token-' + Date.now()
    signup(userData, fakeToken)
    navigate('/dashboard')
  }

  return (
 <div className="min-h-screen relative overflow-hidden pt-20"
      style={{
        backgroundColor: '#ffffff', // Fallback color
        background: 'linear-gradient(4deg, rgba(255, 255, 255, 1) 0%, rgba(241, 234, 249, 1) 40%, rgba(205, 216, 245, 1) 79%)'
      }}
    >
      {/* Neural Network Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 0 }}
      />

      {/* Main Container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen py-12 px-4">
        <div className="w-full max-w-6xl">
          {/* Glassmorphism Card */}
          <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl"
            style={{
              minHeight: '600px',
              height: 'auto',
              background: 'rgba(255, 255, 255, 0.4)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              boxShadow: '0 8px 32px 0 rgba(0, 153, 255, 0.25)'
            }}
          >
            {/* Forms Container */}
            <div className="absolute inset-0">
              {/* Sign In Form */}
              <div className={`absolute top-0 left-0 w-full md:w-1/2 h-full p-6 md:p-12 flex items-center justify-center transition-all duration-700 ${
                isSignUp ? 'md:translate-x-full opacity-0 pointer-events-none' : 'translate-x-0 opacity-100'
              }`}>
                <div className="w-full max-w-sm">
                  <h2 className="font-cinzel text-3xl font-bold text-text-dark mb-2">
                    Welcome Back
                  </h2>
                  <p className="text-text-secondary mb-8">
                    Sign in to your account
                  </p>

                  <form onSubmit={handleSignIn} className="space-y-5">
                    {/* Email Input */}
                    <div className="relative">
                      <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                      <input
                        type="email"
                        placeholder="Email"
                        value={signInData.email}
                        onChange={(e) => setSignInData({...signInData, email: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/40 border border-white/50 text-text-dark placeholder-text-secondary/60 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all"
                        required
                      />
                    </div>

                    {/* Password Input */}
                    <div className="relative">
                      <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                      <input
                        type="password"
                        placeholder="Password"
                        value={signInData.password}
                        onChange={(e) => setSignInData({...signInData, password: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/40 border border-white/50 text-text-dark placeholder-text-secondary/60 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all"
                        required
                      />
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between text-sm">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={signInData.remember}
                          onChange={(e) => setSignInData({...signInData, remember: e.target.checked})}
                          className="w-4 h-4 rounded border-white/50 text-brand-blue focus:ring-brand-blue"
                        />
                        <span className="text-text-secondary">Remember me</span>
                      </label>
                      <a href="#" className="text-brand-blue hover:underline">
                        Forgot password?
                      </a>
                    </div>

                    {/* Sign In Button */}
                    <button
                      type="submit"
                      className="w-full py-3 rounded-lg bg-brand-blue text-white font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
                    >
                      Sign In
                    </button>
                  </form>
                </div>
              </div>

              {/* Sign Up Form */}
              <div className={`absolute top-0 w-full md:w-1/2 h-full p-6 md:p-12 flex items-center justify-center transition-all duration-700 ${
                isSignUp ? 'md:right-0 opacity-100' : 'md:right-[-100%] opacity-0 pointer-events-none'
              }`}
                style={{ right: isSignUp ? '0' : '-100%' }}
              >
                <div className="w-full max-w-sm">
                  <h2 className="font-cinzel text-3xl font-bold text-text-dark mb-2">
                    Create Account
                  </h2>
                  <p className="text-text-secondary mb-8">
                    Join our community
                  </p>

                  <form onSubmit={handleSignUp} className="space-y-4">
                    {/* Name Input */}
                    <div className="relative">
                      <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={signUpData.name}
                        onChange={(e) => setSignUpData({...signUpData, name: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/40 border border-white/50 text-text-dark placeholder-text-secondary/60 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all"
                        required
                      />
                    </div>

                    {/* Email Input */}
                    <div className="relative">
                      <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                      <input
                        type="email"
                        placeholder="Email"
                        value={signUpData.email}
                        onChange={(e) => setSignUpData({...signUpData, email: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/40 border border-white/50 text-text-dark placeholder-text-secondary/60 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all"
                        required
                      />
                    </div>

                    {/* Password Input */}
                    <div className="relative">
                      <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                      <input
                        type="password"
                        placeholder="Password"
                        value={signUpData.password}
                        onChange={(e) => setSignUpData({...signUpData, password: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/40 border border-white/50 text-text-dark placeholder-text-secondary/60 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all"
                        required
                      />
                    </div>

                    {/* Confirm Password Input */}
                    <div className="relative">
                      <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                      <input
                        type="password"
                        placeholder="Confirm Password"
                        value={signUpData.confirmPassword}
                        onChange={(e) => setSignUpData({...signUpData, confirmPassword: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/40 border border-white/50 text-text-dark placeholder-text-secondary/60 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all"
                        required
                      />
                    </div>

                    {/* Sign Up Button */}
                    <button
                      type="submit"
                      className="w-full py-3 rounded-lg bg-brand-blue text-white font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl mt-6"
                    >
                      Sign Up
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Overlay Panel */}
            <div className={`absolute top-0 w-full md:w-1/2 h-full flex items-center justify-center transition-all duration-700 ease-in-out ${
              isSignUp ? 'left-0' : 'md:left-1/2 left-0'
            }`}
              style={{
                
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                backgroundImage: `
                  linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px',
                zIndex: 10
              }}
            >
              <div className="text-center text-white p-12">
                {/* AI Orb Animation */}
                <div className="relative w-48 h-48 mx-auto mb-8">
                  {/* Pulsing Circles with Radial Gradient */}
                  <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-pulse"
                    style={{
                      animationDelay: '0ms',
                      animationDuration: '1.5s',
                      background: 'radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, rgba(99, 172, 212, 0.2) 20%, rgba(122, 195, 255, 0.1) 50%)'
                    }}></div>
                  <div className="absolute inset-4 rounded-full border-4 border-white/50 animate-pulse"
                    style={{
                      animationDelay: '100ms',
                      animationDuration: '1.5s',
                      background: 'radial-gradient(circle, rgba(255, 255, 255, 0.5) 0%, rgba(99, 172, 212, 0.3) 20%, rgba(122, 195, 255, 0.2) 50%)'
                    }}></div>
                  <div className="absolute inset-8 rounded-full border-4 border-white/70 animate-pulse"
                    style={{
                      animationDelay: '200ms',
                      animationDuration: '1.5s',
                      background: 'radial-gradient(circle, rgba(255, 255, 255, 0.7) 0%, rgba(99, 172, 212, 0.5) 20%, rgba(122, 195, 255, 0.3) 50%)'
                    }}></div>
                  <div className="absolute inset-12 rounded-full animate-pulse"
                    style={{
                      animationDelay: '300ms',
                      animationDuration: '1.5s',
                      background: 'radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(99, 172, 212, 1) 20%, rgba(122, 195, 255, 1) 50%)',
                      boxShadow: '0 0 60px rgba(122, 195, 255, 0.8)'
                    }}></div>
                </div>

                {!isSignUp ? (
                  <>
                    <h2 className="font-cinzel text-3xl font-bold mb-4">
                      New Here?
                    </h2>
                    <p className="mb-8 text-black/90 leading-relaxed">
                      Create an account and start your journey with AI-powered news
                    </p>
                    <button
                      onClick={() => setIsSignUp(true)}
                      className="px-8 py-3 rounded-lg border-2 border-white text-black font-semibold hover:bg-white hover:text-brand-blue transition-all"
                    >
                      Create Account
                    </button>
                  </>
                ) : (
                  <>
                    <h2 className="font-cinzel text-3xl font-bold mb-4">
                      Welcome Back!
                    </h2>
                    <p className="mb-8 text-black/90 leading-relaxed">
                      Sign in to access your personalized news feed
                    </p>
                    <button
                      onClick={() => setIsSignUp(false)}
                      className="px-8 py-3 rounded-lg border-2 border-white text-black font-semibold hover:bg-white hover:text-brand-blue transition-all"
                    >
                      Sign In
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Pulse Animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.15);
            opacity: 0.6;
          }
        }
      `}</style>
    </div>
  )
}

export default LoginPage
