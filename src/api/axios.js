// src/api/axios.js
import axios from 'axios';

// --- THIS IS THE CRITICAL CHANGE ---
// We check if the app is in "production" mode (when it's deployed on Vercel).
// If it is, we use the live URL from our environment variable.
// Otherwise (when we are on localhost), we use the local backend URL.
const API_URL = process.env.NODE_ENV === 'production'
  ? `${process.env.REACT_APP_API_URL}/api`
  : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;