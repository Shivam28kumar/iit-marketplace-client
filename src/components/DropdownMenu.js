// src/components/DropdownMenu.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import './DropdownMenu.css';

// Import all the icons we need, including the ones for future features.
import {
  FaUserCircle,
  FaEnvelope,
  FaBoxOpen,
  FaSignOutAlt,
  FaTachometerAlt,
  FaPlusSquare,
  FaHeart,
  FaGift
} from 'react-icons/fa';

const DropdownMenu = ({ onLogout }) => {
  const { user, unreadCount } = useAuthContext();

  // --- GUEST VIEW ---
  if (!user) {
    return (
      <div className="dropdown-menu">
        <div className="dropdown-header">
          <div className="dropdown-header-guest">
            <p>New customer?</p>
            <Link to="/register" className="signup-link">Sign Up</Link>
          </div>
        </div>
      </div>
    );
  }

  // --- LOGGED-IN USER VIEW ---

  // Determine the correct link and text for the main dashboard item based on the user's role.
  let dashboardLink = "/my-profile";
  let dashboardText = "My Profile";
  let DashboardIcon = FaUserCircle;

  if (user.role === 'admin') {
    dashboardLink = "/admin";
    dashboardText = "Admin Dashboard";
    DashboardIcon = FaTachometerAlt;
  } else if (user.role === 'company') {
    dashboardLink = "/company/dashboard";
    dashboardText = "Company Dashboard";
    DashboardIcon = FaTachometerAlt;
  }

  return (
    <div className="dropdown-menu">
      {/* This link now dynamically points to the correct dashboard for each user role. */}
      <Link to={dashboardLink} className="dropdown-item">
        <DashboardIcon /> {dashboardText}
      </Link>
      
      {/* This link takes any logged-in user to their chat page. */}
      <Link to="/chat" className="dropdown-item">
        <div className="messages-link">
            <span><FaEnvelope /> Messages</span>
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
        </div>
      </Link>
      
      {/* 
        We will show the main user-centric links (My Listings, Orders, etc.)
        ONLY to regular users. Admins and Companies have their own dashboards for these tasks.
      */}
      {user.role === 'user' && (
        <>
          <Link to="/my-listings" className="dropdown-item">
            <FaBoxOpen /> My Listed Items
          </Link>
          <Link to="#" className="dropdown-item">
            <FaHeart /> Orders
          </Link>
          <Link to="#" className="dropdown-item">
            <FaPlusSquare /> Plus Zone
          </Link>
          <Link to="#" className="dropdown-item">
            <FaGift /> Gift Cards
          </Link>
        </>
      )}
      
      {/* The logout button is visible to all logged-in users. */}
      <div onClick={onLogout} className="dropdown-item" style={{ cursor: 'pointer' }}>
        <FaSignOutAlt /> Logout
      </div>
    </div>
  );
};

export default DropdownMenu;