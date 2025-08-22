// src/pages/CompanyDashboardPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import './CompanyDashboardPage.css';

const CompanyDashboardPage = () => {
  const { user } = useAuthContext();
  return (
    <div className="company-dashboard">
      <h1>Welcome, {user?.fullName}!</h1>
      <p>This is your Assured Products dashboard. From here you can add new products and manage your existing listings.</p>
      <div className="dashboard-actions">
        <Link to="/sell" className="dashboard-action-card">
          <h2>List a New Product</h2>
          <p>Create a new "Assured" product listing and select which colleges can see it.</p>
        </Link>
        <Link to="/company/listings" className="dashboard-action-card">
          <h2>Manage My Listings</h2>
          <p>View, edit, or delete your existing product listings, organized by category.</p>
        </Link>
      </div>
    </div>
  );
};

export default CompanyDashboardPage; // <-- THIS LINE IS CRUCIAL