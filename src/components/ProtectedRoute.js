// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext'; // Use our custom hook
import Spinner from './Spinner';

const ProtectedRoute = () => {
  // Get both 'user' and 'loading' from our context
  const { user, loading } = useAuthContext();

  // --- THIS IS THE NEW LOGIC ---
  // If we are still in the process of checking for a token,
  // show a full-page spinner so the user doesn't get redirected prematurely.
  if (loading) {
    return <Spinner />;
  }

  // If loading is finished AND there is no user, then we can safely redirect to the login page.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If loading is finished and there IS a user, render the requested child component (e.g., SellPage).
  return <Outlet />;
};

export default ProtectedRoute;