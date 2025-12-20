import React, { createContext, useState, useContext, useEffect } from 'react'
import authAPI from '../services/authAPI'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check if user is logged in on mount and validate token
  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem('user')
      const token = localStorage.getItem('token')

      if (storedUser && token) {
        try {
          // Validate token with backend
          const response = await authAPI.getCurrentUser()
          if (response.success) {
            setUser(response.data)
            setIsAuthenticated(true)
          } else {
            // Token invalid, clear storage
            localStorage.removeItem('user')
            localStorage.removeItem('token')
          }
        } catch (error) {
          console.error('Token validation failed:', error)
          localStorage.removeItem('user')
          localStorage.removeItem('token')
        }
      }
      setLoading(false)
    }

    initAuth()
  }, [])

  const login = async (email, password) => {
    try {
      setError(null)
      setLoading(true)

      const response = await authAPI.login(email, password)

      if (response.success) {
        const userData = {
          _id: response.data._id,
          name: response.data.name,
          email: response.data.email,
        }

        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('token', response.data.token)
        setUser(userData)
        setIsAuthenticated(true)

        return { success: true, user: userData }
      }
    } catch (error) {
      setError(error.message || 'Login failed')
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const signup = async (name, email, password) => {
    try {
      setError(null)
      setLoading(true)

      const response = await authAPI.signup(name, email, password)

      if (response.success) {
        const userData = {
          _id: response.data._id,
          name: response.data.name,
          email: response.data.email,
        }

        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('token', response.data.token)
        setUser(userData)
        setIsAuthenticated(true)

        return { success: true, user: userData }
      }
    } catch (error) {
      setError(error.message || 'Signup failed')
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    authAPI.logout()
    setUser(null)
    setIsAuthenticated(false)
    setError(null)
  }

  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    signup,
    logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
