// src/components/ProductCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useAuthContext } from '../context/AuthContext'; // We'll need this for the badge logic
import './ProductCard.css';

// The component props remain the same
const ProductCard = ({ product, showControls = false, onDelete }) => {
  const { user } = useAuthContext();

  const handleDelete = async () => {
    // ... (This function is unchanged)
    if (window.confirm(`Are you sure you want to delete "${product.title}"?`)) {
      try {
        await api.delete(`/products/${product._id}`);
        toast.success('Product deleted successfully.');
        // Call the onDelete function passed from the parent to update the UI
        if (onDelete) onDelete(product._id);
      } catch (err) {
        toast.error('Failed to delete product.');
      }
    }
  };

  return (
    // We add a new class to the main div if the product is 'assured'
    <div className={`product-card ${product.productType === 'assured' ? 'assured' : ''}`}>
      
      {/* --- THIS IS THE NEW BADGE --- */}
      {/* We conditionally render the "Assured" badge if the productType matches. */}
      {product.productType === 'assured' && (
        <div className="assured-badge">
          <span>ASSURED</span>
        </div>
      )}

      <Link to={`/product/${product._id}`} className="product-card-link">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="product-image"
        />
        <div className="product-info">
          <h3 className="product-title">{product.title}</h3>
          <p className="product-price">₹{product.price}</p>
        </div>
      </Link>

      {/* The Edit/Delete controls logic remains the same */}
      {showControls && (
        <div className="product-card-controls">
          <Link to={`/edit-product/${product._id}`} className="edit-button-link">
            <button className="edit-button">Edit</button>
          </Link>
          <button onClick={handleDelete} className="delete-button">Delete</button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;