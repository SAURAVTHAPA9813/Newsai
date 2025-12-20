import axios from 'axios';

// Base API URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 30000, // 30 seconds
  withCredentials: true, // Send cookies with requests (for httpOnly cookie auth)
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate', // Prevent browser caching
    'Pragma': 'no-cache', // HTTP 1.0 compatibility
    'Expires': '0', // Proxies
  },
});

// Request interceptor - Add auth token to all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log requests in development mode
    if (import.meta.env.VITE_APP_ENV === 'development') {
      console.log(`🚀 API Request: ${config.method.toUpperCase()} ${config.url}`, config.data || config.params);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    // Log responses in development mode
    if (import.meta.env.VITE_APP_ENV === 'development') {
      console.log(`✅ API Response: ${response.config.url}`, response.data);
    }

    // Return the data property directly for successful responses
    return response.data;
  },
  (error) => {
    // Log errors in development mode
    if (import.meta.env.VITE_APP_ENV === 'development') {
      console.error(`❌ API Error: ${error.config?.url}`, error.response?.data);
    }

    // Handle authentication errors
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/#/login';
    }

    // Handle rate limiting
    if (error.response?.status === 429) {
      console.error('Rate limit exceeded. Please try again later.');
    }

    // Extract error message
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';

    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);

export default apiClient;
export { API_BASE_URL };
