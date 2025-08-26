// src/pages/CategoriesPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaBicycle, FaBook, FaLaptop, FaChair, FaMobileAlt, FaTshirt } from 'react-icons/fa';
import './CategoriesPage.css'; // This will be our single, updated CSS file

// DATA AND LOGIC ARE IDENTICAL TO YOUR ORIGINAL
const categories = [
  { name: 'Mobiles', icon: <FaMobileAlt />, link: '/search?category=Electronics' },
  { name: 'Bicycles', icon: <FaBicycle />, link: '/search?category=Bicycles' },
  { name: 'Books', icon: <FaBook />, link: '/search?category=Books' },
  { name: 'Electronics', icon: <FaLaptop />, link: '/search?category=Electronics' },
  { name: 'Furniture', icon: <FaChair />, link: '/search?category=Furniture' },
  { name: 'Fashion', icon: <FaTshirt />, link: '/search?category=Other' },
];

const CategoriesPage = () => {
  return (
    // Use <main> for the primary content of the page
    <main className="categories-page">
      <div className="categories-header">
        <h1>All Categories</h1>
        <p>Find what you're looking for from our wide selection of products.</p>
      </div>

      <div className="category-grid">
        {categories.map(category => (
          // The Link and key structure remains unchanged
          <Link to={category.link} key={category.name} className="category-card">
            <div className="category-card__icon">{category.icon}</div>
            <h3 className="category-card__name">{category.name}</h3>
          </Link>
        ))}
      </div>
    </main>
  );
};

export default CategoriesPage;