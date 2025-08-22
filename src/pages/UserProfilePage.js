// src/pages/UserProfilePage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';
import './HomePage.css'; // Reuse styles

const UserProfilePage = () => {
  const { userId } = useParams(); // Get the userId from the URL
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch user profile info and user's products in parallel
        const [userRes, productsRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/users/${userId}`),
          axios.get(`http://localhost:5000/api/products/user/${userId}`)
        ]);
        
        setUser(userRes.data);
        setProducts(productsRes.data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  if (loading) return <Spinner />;
  if (!user) return <div className="error-message">User not found.</div>;

  return (
    <div className="homepage">
      <h1 className="homepage-title">{user.fullName}'s Listings</h1>
      <div className="product-grid">
        {products.length > 0 ? (
          products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <p className="no-products-message">This user has no active listings.</p>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;