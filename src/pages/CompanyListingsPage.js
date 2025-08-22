// src/pages/CompanyListingsPage.js
import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuthContext } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';
import { Link } from 'react-router-dom';
import './MyListingsPage.css';

const CompanyListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();

  useEffect(() => {
    if (user) {
      const fetchMyListings = async () => {
        try {
          const { data } = await api.get(`/products/user/${user.id}`);
          setListings(data);
        } catch (err) {
          console.error('Failed to fetch listings:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchMyListings();
    }
  }, [user]);

  const handleDelete = (deletedProductId) => {
    setListings(prev => prev.filter(p => p._id !== deletedProductId));
  };

  const groupedProducts = listings.reduce((acc, product) => {
    const category = product.category;
    if (!acc[category]) acc[category] = [];
    acc[category].push(product);
    return acc;
  }, {});

  if (loading) return <Spinner />;

  return (
    <div className="my-listings-page">
      <h1>My Assured Products</h1>
      {listings.length === 0 ? (
        <div className="no-listings">
          <p>You haven't listed any items yet.</p>
          <Link to="/sell" className="sell-button">List Your First Item</Link>
        </div>
      ) : (
        Object.keys(groupedProducts).map(category => (
          <section key={category} className="category-section">
            <h2>{category}</h2>
            <div className="product-grid">
              {groupedProducts[category].map(product => (
                <ProductCard
                  key={product._id}
                  product={product}
                  showControls={true}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
};

export default CompanyListingsPage; // <-- THIS LINE IS CRUCIAL