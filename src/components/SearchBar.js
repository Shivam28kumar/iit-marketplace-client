// src/components/SearchBar.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { FaSearch } from 'react-icons/fa';
import './SearchBar.css'; // We will create this CSS file

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [college, setCollege] = useState('All');
  const [collegeList, setCollegeList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const { data } = await api.get('/colleges');
        setCollegeList(data);
      } catch (error) {
        console.error("Failed to fetch colleges for search bar", error);
      }
    };
    fetchColleges();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?query=${searchTerm}&category=${category}&college=${college}`);
  };

  return (
    <form className="header-search-form" onSubmit={handleSubmit}>
      {/* This college dropdown is now hidden by default via CSS */}
      <select 
        className="search-college-select" 
        value={college}
        onChange={(e) => setCollege(e.target.value)}
      >
        <option value="All">All Colleges</option>
        {collegeList.map(c => (
          <option key={c._id} value={c._id}>{c.name}</option>
        ))}
      </select>
      
      <select 
        className="search-category-select" 
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="All">All Categories</option>
        <option value="Bicycles">Bicycles</option>
        <option value="Books">Books</option>
        <option value="Electronics">Electronics</option>
        <option value="Furniture">Furniture</option>
        <option value="Other">Other</option>
      </select>
      
      <input
        type="text"
        className="search-input"
        placeholder="Search for products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button type="submit" className="search-button">
        <FaSearch />
      </button>
    </form>
  );
};
export default SearchBar;