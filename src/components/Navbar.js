// src/components/Navbar.js
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

// Import components
import DropdownMenu from './DropdownMenu';
import SearchBar from './SearchBar';

// Import icons (Fixed Fabolt -> FaBolt)
import { FaUserCircle, FaBolt } from 'react-icons/fa';
import './Navbar.css';

// --- MAIN NAVBAR COMPONENT ---
const Navbar = () => {
  const { user } = useAuthContext();

  return (
    <nav className="navbar">
      {/* Left section: Brand */}
      <Link to="/" className="navbar-brand">IIT Marketplace</Link>
      
      {/* Center section: Search */}
      <SearchBar />

      {/* Right section: Actions */}
      <div className="navbar-actions">
        
        {/* --- NEW: 10 Min Delivery Button --- */}
        <Link 
          to="/outlets" 
          className="btn" 
          style={{
            backgroundColor: '#ff4757', // Distinct red color for urgency
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            marginRight: '0.5rem' // Little spacing from the next button
          }}
        >
          <FaBolt /> 10 Mins
        </Link>

        {/* Sell Button */}
        <Link to="/sell" className="btn btn-primary sell-button-header">Sell an Item</Link>
        
        {/* Login / User Dropdown */}
        {user ? (
            <DropdownTrigger />
        ) : (
            <Link to="/login" className="login-button-header">Login</Link>
        )}
      </div>
    </nav>
  );
};


// --- DROPDOWN TRIGGER HELPER COMPONENT ---
const DropdownTrigger = () => {
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const { logout } = useAuthContext();
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    
    const handleToggleDropdown = () => setDropdownVisible(!isDropdownVisible);
    const closeMenu = () => setDropdownVisible(false);

    const handleLogout = () => {
        logout();
        closeMenu();
        navigate('/login');
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                closeMenu();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    return (
        <div ref={dropdownRef} className="navbar-profile-container">
            <button onClick={handleToggleDropdown} className="profile-button">
                <FaUserCircle /> Welcome!
            </button>
            {isDropdownVisible && <DropdownMenu onLogout={handleLogout} closeMenu={closeMenu} />}
        </div>
    );
};

export default Navbar;