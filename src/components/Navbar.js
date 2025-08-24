// src/components/Navbar.js
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

// Import all the components this Navbar uses
import DropdownMenu from './DropdownMenu';
import SearchBar from './SearchBar';

// Import icons and styles
import { FaUserCircle } from 'react-icons/fa';
import './Navbar.css';

// --- MAIN NAVBAR COMPONENT ---
// This component's main job is to structure the header.
const Navbar = () => {
  // We get the user from the global context to decide which user actions to show.
  const { user } = useAuthContext();

  return (
    <nav className="navbar">
      {/* Left section: The clickable brand logo */}
      <Link to="/" className="navbar-brand">IIT Marketplace</Link>
      
      {/* Center section: The self-contained SearchBar component */}
      <SearchBar />

      {/* Right section: All user-related actions */}
      <div className="navbar-actions">
        {/*
          THE FIX: We apply the global 'btn' and 'btn-primary' classes for consistent styling.
          We also add 'sell-button-header' so we can specifically hide it on mobile.
        */}
        <Link to="/sell" className="btn btn-primary sell-button-header">Sell an Item</Link>
        
        {/* We conditionally render either the Login button for guests or the DropdownTrigger for logged-in users */}
        {user ? <DropdownTrigger /> : <Link to="/login" className="login-button-header">Login</Link>}
      </div>
    </nav>
  );
};


// --- DROPDOWN TRIGGER HELPER COMPONENT ---
// This sub-component manages all the state and logic for the user dropdown menu.
// This logic is already perfect and requires no changes.
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