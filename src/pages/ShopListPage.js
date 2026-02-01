// src/pages/ShopListPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Spinner from '../components/Spinner';
import './ShopListPage.css';

const ShopListPage = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const { data } = await api.get('/shops');
        setShops(data);
      } catch (error) {
        console.error("Failed to load shops", error);
      } finally {
        setLoading(false);
      }
    };
    fetchShops();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="container shop-list-page">
      <h1>Campus Outlets 🍔</h1>
      
      <div className="shop-grid">
        {shops.map((shop) => (
          <Link to={`/shops/${shop._id}`} key={shop._id} className="shop-card">
            
            {/* Shop Image */}
            <img 
              src={shop.shopDetails?.imageUrl || "https://via.placeholder.com/400x200?text=Shop"} 
              alt={shop.shopDetails?.shopName} 
              className="shop-image" 
            />
            
            <div className="shop-info">
              <div className="shop-header">
                <h3>{shop.shopDetails?.shopName || shop.fullName}</h3>
                <span className="shop-rating">4.5 ★</span>
              </div>
              
              <p style={{color: '#777', margin: '0.2rem 0'}}>{shop.shopDetails?.description}</p>
              
              <div className="shop-meta">
                <span>{shop.shopDetails?.deliveryTime || "20 mins"}</span>
                <span className={`status-badge ${shop.shopDetails?.isOpen ? 'open' : 'closed'}`}>
                  {shop.shopDetails?.isOpen ? 'Open Now' : 'Closed'}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {shops.length === 0 && <p style={{textAlign: 'center'}}>No outlets found.</p>}
    </div>
  );
};

export default ShopListPage;