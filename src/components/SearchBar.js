// src/components/SearchBar.js
import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass the search term and category up to the parent component (HomePage)
    onSearch(searchTerm, category);
  };

  return (
    <form className="search-bar-container" onSubmit={handleSubmit}>
      <select 
        className="search-category-select" 
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="All">All</option>
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