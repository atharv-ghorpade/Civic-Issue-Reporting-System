import axios from 'axios';

const api = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a logic to log the active token for debugging
console.log("ACTIVE SESSION TOKEN:", localStorage.getItem('token'));

// Interceptor to handle 401 errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // ONLY logout on 401 Unauthorized errors
    if (error.response?.status === 401) {
      console.warn("Unauthorized! Clearing session and redirecting to login.");
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;
