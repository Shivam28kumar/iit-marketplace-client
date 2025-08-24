// src/components/Hero.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

// We can use a high-quality static image for the hero
import heroImageUrl from '../assets/hero-banner.jpg'; // You will need to add this image

const Hero = () => {
  return (
    <section className="hero-section">
      <img src={heroImageUrl} alt="Special offers on second-hand items" className="hero-image" />
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1>Ganesh Puja Offers</h1>
        <p>Find cool and oversized T-shirts starting at just ₹249.</p>
        {/* This is the clear Call To Action (CTA) */}
        <Link to="/search?category=Other&query=shirt" className="btn btn-primary">Shop Now</Link>
      </div>
    </section>
  );
};
export default Hero;