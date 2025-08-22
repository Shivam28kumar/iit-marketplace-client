// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuthContext } from '../context/AuthContext';

// Import UI Components
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';
import CategoryShowcase from '../components/CategoryShowcase'; // <-- Import the new component

// Import Carousel Components
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import the carousel's default styles

import './HomePage.css';

const HomePage = () => {
  // --- STATE MANAGEMENT ---
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();

  // --- DATA FETCHING ---
  // This useEffect hook fetches all the data needed for the homepage when it loads or when the user logs in/out.
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const params = {};
      if (user && user.college) {
        params.college = user.college.id; // Apply college filter for logged-in users
      }
      
      try {
        // Fetch products and banners at the same time for faster page loads.
        const [productsRes, bannersRes] = await Promise.all([
            api.get('/products', { params }),
            api.get('/banners') // This fetches only active banners
        ]);
        
        setProducts(productsRes.data);
        setBanners(bannersRes.data);

      } catch (err) {
        setError('Failed to load page data. Please try again later.');
        console.error("HomePage fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]); // The dependency on 'user' ensures the product list updates on login/logout.

  // --- RENDER LOGIC ---
  return (
    <div className="homepage">
      
      {/* --- Section 1: Promotional Banner Carousel --- */}
      {/* We only render the carousel if there are banners to display. */}
      {banners.length > 0 && (
        <div className="carousel-container">
          <Carousel
            autoPlay={true}
            infiniteLoop={true}
            showThumbs={false}
            showStatus={false}
            interval={5000} // Changes slide every 5 seconds
          >
            {banners.map(banner => (
              <Link to={banner.linkUrl} key={banner._id}>
                <div>
                  <img src={banner.imageUrl} alt="Promotional Banner" />
                </div>
              </Link>
            ))}
          </Carousel>
        </div>
      )}

      {/* --- Section 2: Category Showcase --- */}
      {/* THIS IS THE NEWLY ADDED COMPONENT */}
      <CategoryShowcase />

      {/* --- Section 3: Main Product Grid --- */}
      <h1 className="homepage-title">
        {user && user.college ? `Recommended for ${user.college.name}` : "Latest Items Across All Campuses"}
      </h1>

      {/* Render based on loading, error, or success state */}
      {loading ? (
        <Spinner />
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="product-grid">
          {products.length > 0 ? (
            products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <p className="no-products-message">
              {user ? "No products found for your college yet. Be the first to list an item!" : "No products found."}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;