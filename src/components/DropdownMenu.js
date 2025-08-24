// src/components/DropdownMenu.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import './DropdownMenu.css';

// Import all the icons we need
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

// --- THIS IS THE FIX (Part 1) ---
// We now accept a new function called 'closeMenu' as a prop from the Navbar.
const DropdownMenu = ({ onLogout, closeMenu }) => {
  const { user, unreadCount } = useAuthContext();

  // --- GUEST VIEW ---
  if (!user) {
    return (
      <div className="dropdown-menu">
        <div className="dropdown-header">
          <div className="dropdown-header-guest">
            <p>New customer?</p>
            {/* We also add the onClick handler here to close the menu on navigation */}
            <Link to="/register" className="signup-link" onClick={closeMenu}>Sign Up</Link>
          </div>
        </div>
      </div>
    );
  }

  // --- LOGGED-IN USER VIEW ---
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
      {/* --- THIS IS THE FIX (Part 2) --- */}
      {/* Every clickable <Link> now has an onClick handler that calls the closeMenu function. */}
      {/* This ensures the dropdown disappears as soon as you navigate to a new page. */}
      <Link to={dashboardLink} className="dropdown-item" onClick={closeMenu}>
        <DashboardIcon /> {dashboardText}
      </Link>
      
      <Link to="/chat" className="dropdown-item" onClick={closeMenu}>
        <div className="messages-link">
            <span><FaEnvelope /> Messages</span>
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
        </div>
      </Link>
      
      {user.role === 'user' && (
        <>
          <Link to="/my-listings" className="dropdown-item" onClick={closeMenu}>
            <FaBoxOpen /> My Listed Items
          </Link>
          <Link to="#" className="dropdown-item" onClick={closeMenu}>
            <FaHeart /> Orders
          </Link>
          <Link to="#" className="dropdown-item" onClick={closeMenu}>
            <FaPlusSquare /> Plus Zone
          </Link>
          <Link to="#" className="dropdown-item" onClick={closeMenu}>
            <FaGift /> Gift Cards
          </Link>
        </>
      )}
      
      {/* The onLogout function already handles closing the menu, so no change is needed here. */}
      <div onClick={onLogout} className="dropdown-item" style={{ cursor: 'pointer' }}>
        <FaSignOutAlt /> Logout
      </div>
    </div>
  );
};

export default DropdownMenu;