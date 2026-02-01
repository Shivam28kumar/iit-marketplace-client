// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuthContext } from '../context/AuthContext';

// Import UI Components
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';
import CategoryShowcase from '../components/CategoryShowcase';
import PromoCard from '../components/PromoCard';
import OptimizedImage from '../components/OptimizedImage'; // Ensure this is imported

// Import Carousel
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

import './HomePage.css';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const params = {};
      if (user && user.college) {
        params.college = user.college.id;
      }
      try {
        const [productsRes, bannersRes] = await Promise.all([
            api.get('/products', { params }),
            api.get('/banners')
        ]);
        setProducts(productsRes.data);
        setBanners(bannersRes.data);
      } catch (err) {
        console.error("HomePage fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  return (
    <div className="homepage">
      
      {/* --- Section 1: Responsive Banner Carousel --- */}
      {banners.length > 0 && (
        <div className="carousel-wrapper"> {/* New wrapper to center on desktop */}
          <div className="carousel-container">
            <Carousel 
              autoPlay 
              infiniteLoop 
              showThumbs={false} 
              showStatus={false} 
              interval={5000}
              showArrows={true}
            >
              {banners.map(banner => (
                <Link to={banner.linkUrl} key={banner._id} className="banner-link">
                  {/* We use OptimizedImage for speed, but CSS controls the shape */}
                  <OptimizedImage 
                    src={banner.imageUrl} 
                    alt="Promotional Banner" 
                    className="banner-image" 
                  />
                </Link>
              ))}
            </Carousel>
          </div>
        </div>
      )}
      
      {/* --- Section 2: Main Content Container --- */}
      <div className="container">
        <CategoryShowcase />
        <PromoCard />

        <section className="product-grid-section">
          <h2 className="section-title">
            {user && user.college ? `Recommended for ${user.college.name}` : "Recently Added Items"}
          </h2>
          {loading ? <Spinner /> : (
            <div className="product-grid">
              {products.length > 0 ? (
                products.map(product => <ProductCard key={product._id} product={product} />)
              ) : ( <p className="no-products-message">No products found.</p> )}
            </div>
          )}
        </section>
      </div>

    </div>
  );
};

export default HomePage;