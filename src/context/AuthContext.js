// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../api/axios';

// Create the context
const AuthContext = createContext();

// Create the custom hook that all our components will use to access auth state
export const useAuthContext = () => {
	return useContext(AuthContext);
};

// Create the Provider component that will wrap our entire application
export const AuthProvider = ({ children }) => {
  // We only need one state for the user object. The token can be read from localStorage when needed.
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  // This useEffect runs only once when the app starts.
  // Its job is to check for an existing token and initialize the user state.
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decodedUser.exp > currentTime) {
          // If token is valid, set the user state and fetch their unread messages.
          setUser(decodedUser.user);
          fetchUnreadCount(token); // Pass token to ensure headers are set
        }
      } catch (error) {
        // If token is invalid, clear it
        localStorage.removeItem('token');
      }
    }
    setLoading(false); // We are done loading
  }, []); // Empty array means this runs only on initial mount.

  const fetchUnreadCount = async (token) => {
    try {
      // Temporarily set header for this call if it's part of the initial load
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await api.get('/chat/unread-count', { headers });
      setUnreadCount(res.data.unreadCount || 0);
    } catch (error) {
      console.error("Could not fetch unread count", error);
    }
  };

  // The login function now just needs to update localStorage and the user state.
  const login = (token) => {
    localStorage.setItem('token', token);
    const decodedUser = jwtDecode(token);
    setUser(decodedUser.user);
    fetchUnreadCount(token);
  };

  // The logout function clears localStorage and the user state.
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setUnreadCount(0);
  };

  // The value provided to all children components.
  const contextValue = { user, loading, unreadCount, login, logout, fetchUnreadCount };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};