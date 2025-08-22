// src/components/AdminRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import Spinner from './Spinner';

const AdminRoute = () => {
  const { user, loading } = useAuthContext();

  // First, wait for the authentication check to complete
  if (loading) {
    return <Spinner />;
  }

  // After loading, check if there is a user AND if their role is 'admin'
  if (user && user.role === 'admin') {
    // If they are an admin, render the requested child component (e.g., AdminDashboard)
    return <Outlet />;
  }

  // If they are not an admin (or not logged in), redirect them to the homepage
  return <Navigate to="/" replace />;
};

export default AdminRoute;