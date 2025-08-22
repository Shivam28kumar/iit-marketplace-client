// src/api/axios.js
import axios from 'axios';

// --- THIS IS THE CRITICAL LOGIC ---
// 'process.env.NODE_ENV' is a special variable that is automatically set to 'production' by Vercel when we deploy.
// 'process.env.REACT_APP_API_URL' is the environment variable we set in the Vercel project settings.
const API_URL = process.env.NODE_ENV === 'production'
  ? `${process.env.REACT_APP_API_URL}/api` // In production, use the live Render URL.
  : 'http://localhost:5000/api'; // In development (on your laptop), use the local server.

// We log the API_URL to the console so we can easily debug which address is being used.
console.log("API calls are being sent to:", API_URL);

// Create the central axios instance with the correct base URL.
const api = axios.create({
  baseURL: API_URL,
});

// The interceptor correctly adds the auth token to every request.
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