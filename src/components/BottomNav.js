// src/components/BottomNav.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaSearch, FaPlusCircle, FaUser, FaThLarge } from 'react-icons/fa';
import { useAuthContext } from '../context/AuthContext';
import './BottomNav.css';

const BottomNav = () => {
  const { user } = useAuthContext();

  return (
    <nav className="bottom-nav">
      <ul className="bottom-nav-list">
        <li><NavLink to="/" className="bottom-nav-link"><FaHome /><br/>Home</NavLink></li>
        <li><NavLink to="/search" className="bottom-nav-link"><FaSearch /><br/>Search</NavLink></li>
        <li><NavLink to="/sell" className="bottom-nav-link"><FaPlusCircle /><br/>Sell</NavLink></li>
        <li><NavLink to="/categories" className="bottom-nav-link"><FaThLarge /><br/>Categories</NavLink></li>
        <li>
          {/* This link goes to the correct dashboard based on the user's role */}
          <NavLink to={user ? (user.role === 'admin' ? '/admin' : user.role === 'company' ? '/company/dashboard' : '/my-profile') : '/login'} className="bottom-nav-link">
            <FaUser /><br/>Account
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default BottomNav;