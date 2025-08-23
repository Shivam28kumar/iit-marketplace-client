// src/components/Navbar.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import DropdownMenu from './DropdownMenu';
import { FaSearch, FaUserCircle } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
        navigate(`/search?query=${searchTerm}&category=${category}`);
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">IIT Marketplace</Link>
      
      <form className="header-search-form" onSubmit={handleSearchSubmit}>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="All">All</option>
          <option value="Bicycles">Bicycles</option>
          <option value="Books">Books</option>
          <option value="Electronics">Electronics</option>
          <option value="Furniture">Furniture</option>
          <option value="Other">Other</option>
        </select>
        <input
          type="text"
          placeholder="Search for products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit"><FaSearch /></button>
      </form>

      <div className="navbar-actions">
        {/*
          THE FIX IS HERE:
          We have removed all the extra conditional logic and buttons.
          This section now correctly shows either the "Login" button for guests
          OR the user dropdown trigger for logged-in users.
        */}
        {user ? (
            <DropdownTrigger />
        ) : (
            <Link to="/login" className="login-button-header">Login</Link>
        )}
        <Link to="/sell" className="sell-button">Sell an Item</Link>
      </div>
    </nav>
  );
};

// A helper component to handle the dropdown logic
const DropdownTrigger = () => {
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const { logout } = useAuthContext();
    const navigate = useNavigate();
    
    const handleLogout = () => {
        logout();
        setDropdownVisible(false);
        navigate('/login');
    };

    return (
        <div 
            className="navbar-profile-container" 
            onMouseEnter={() => setDropdownVisible(true)} 
            onMouseLeave={() => setDropdownVisible(false)}
        >
            <button className="profile-button">
                <FaUserCircle /> Welcome!
            </button>
            {isDropdownVisible && <DropdownMenu onLogout={handleLogout} />}
        </div>
    );
};

export default Navbar;