// src/components/CompanyRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import Spinner from './Spinner';

const CompanyRoute = () => {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <Spinner />;
  }

  // This logic correctly checks if the user is a 'company'
  if (user && user.role === 'company') {
    // If they are, render the nested route (e.g., the CompanyDashboardPage)
    return <Outlet />;
  }

  // Otherwise, redirect them away.
  return <Navigate to="/" replace />;
};

// --- THIS IS THE CRITICAL LINE ---
// Make sure this export statement exists.
export default CompanyRoute;