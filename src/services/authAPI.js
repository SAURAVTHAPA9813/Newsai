import apiClient from './apiClient';

// Backend auth endpoints match server/routes/auth.js
const authAPI = {
  // POST /api/auth/signup
  signup: async (name, email, password) => {
    const response = await apiClient.post('/auth/signup', {
      name,
      email,
      password,
    });
    return response; // { success: true, data: { _id, name, email, token }, message }
  },

  // POST /api/auth/login
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    });
    return response; // { success: true, data: { _id, name, email, token }, message }
  },

  // GET /api/auth/me
  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response; // { success: true, data: { user object } }
  },

  // Logout (client-side only)
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export default authAPI;
