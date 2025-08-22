// src/components/Navbar.js
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import DropdownMenu from './DropdownMenu';
import { FaSearch, FaUserCircle } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  // State for the search bar inside the header
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');

  const handleLogout = () => {
    logout();
    setDropdownVisible(false);
    navigate('/login');
  };
  
  // When the search form is submitted, navigate to the search results page
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?query=${searchTerm}&category=${category}`);
  };

  return (
    <nav className="navbar">
      {/* LEFT: Brand */}
      <Link to="/" className="navbar-brand">IIT Marketplace</Link>
      
      {/* CENTER: Search Bar */}
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

      {/* RIGHT: User Actions */}
      <div className="navbar-actions">
        <Link to="/sell" className="sell-button">Sell an Item</Link>
        <div 
          className="navbar-profile-container" 
          onMouseEnter={() => setDropdownVisible(true)} 
          onMouseLeave={() => setDropdownVisible(false)}
        >
          {user ? (
            <button className="profile-button">
              <FaUserCircle /> Welcome!
            </button>
          ) : (
            <Link to="/login" className="login-button-header">Login</Link>
          )}
          {isDropdownVisible && <DropdownMenu user={user} onLogout={handleLogout} />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;