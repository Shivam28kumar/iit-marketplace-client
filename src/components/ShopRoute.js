// src/components/ShopRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import Spinner from './Spinner';

const ShopRoute = () => {
  const { user, loading } = useAuthContext();

  if (loading) return <Spinner />;

  if (user && user.role === 'shop') {
    return <Outlet />;
  }

  return <Navigate to="/" replace />;
};

export default ShopRoute;