// src/components/CategoryShowcase.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaBicycle, FaBook, FaLaptop, FaChair } from 'react-icons/fa'; // Import icons
import './CategoryShowcase.css';

const categories = [
  { name: 'Bicycles', icon: <FaBicycle />, link: '/search?category=Bicycles' },
  { name: 'Books', icon: <FaBook />, link: '/search?category=Books' },
  { name: 'Electronics', icon: <FaLaptop />, link: '/search?category=Electronics' },
  { name: 'Furniture', icon: <FaChair />, link: '/search?category=Furniture' },
];

const CategoryShowcase = () => {
  return (
    <section className="category-showcase">
      <h2>Shop by Category</h2>
      <div className="category-grid">
        {categories.map(category => (
          <Link to={category.link} key={category.name} className="category-card">
            <div className="icon">{category.icon}</div>
            <h3>{category.name}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryShowcase;