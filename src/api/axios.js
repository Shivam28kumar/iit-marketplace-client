// src/api/axios.js
import axios from 'axios';

// Create a new instance of axios which we will use for all our API calls.
const api = axios.create({
  // THE FIX IS LIKELY HERE:
  // Ensure the baseURL is correct. It must point to your backend server's address.
  // It must include 'http://' and the port number (5000).
  // It should NOT have a trailing slash.
  baseURL: 'http://localhost:5000/api',
});

// We use an interceptor to dynamically add the Authorization header to requests.
// This is a powerful feature that keeps our component code clean.
api.interceptors.request.use(
  (config) => {
    // This function runs BEFORE each request is sent.
    const token = localStorage.getItem('token');
    if (token) {
      // If a token exists in localStorage, add it to the request headers.
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config; // Return the modified request config.
  },
  (error) => {
    // This runs if there's an error setting up the request.
    return Promise.reject(error);
  }
);

export default api;