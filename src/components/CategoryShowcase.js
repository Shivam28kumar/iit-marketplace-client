// src/components/CategoryShowcase.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { FaBicycle, FaBook, FaLaptop, FaChair, FaMobileAlt, FaTshirt } from 'react-icons/fa';
import './CategoryShowcase.css';

// We add a color property to create unique gradients for each category
const categories = [
  { name: 'Mobiles', icon: <FaMobileAlt />, link: '/search?category=Electronics', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { name: 'Bicycles', icon: <FaBicycle />, link: '/search?category=Bicycles', color: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)' },
  { name: 'Books', icon: <FaBook />, link: '/search?category=Books', color: 'linear-gradient(135deg, #2af598 0%, #009efd 100%)' },
  { name: 'Electronics', icon: <FaLaptop />, link: '/search?category=Electronics', color: 'linear-gradient(135deg, #ef473a 0%, #cb2d3e 100%)' },
  { name: 'Furniture', icon: <FaChair />, link: '/search?category=Furniture', color: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)' },
  { name: 'Fashion', icon: <FaTshirt />, link: '/search?category=Other', color: 'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)' },
];

const CategoryShowcase = () => {
  // Determine how many items to show per slide based on screen width
  const isMobile = window.innerWidth <= 768;
  
  return (
    <section className="category-showcase">
      <h2>Shop by Category</h2>
      <div className="category-carousel">
        <Carousel
          showThumbs={false}
          showStatus={false}
          showIndicators={false}
          centerMode={true}
          centerSlidePercentage={isMobile ? 33.3 : 16.6} // Shows 3 items on mobile, 6 on desktop
          infiniteLoop={true}
        >
          {categories.map(category => (
            <Link to={category.link} key={category.name} className="category-item">
              <div className="category-icon-wrapper" style={{ background: category.color }}>
                <div className="icon">{category.icon}</div>
              </div>
              <h3>{category.name}</h3>
            </Link>
          ))}
        </Carousel>
      </div>
    </section>
  );
};

export default CategoryShowcase;