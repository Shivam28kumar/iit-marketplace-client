// src/pages/EditProductPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios.js'; // Use our central api instance
import { useAuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner'; // It's good practice to import Spinner
import './SellPage.css'; // We can safely reuse the styles from the Sell Page

const EditProductPage = () => {
  // --- HOOKS ---
  const { id } = useParams(); // Gets the product ID from the URL.
  const navigate = useNavigate();
  const { user } = useAuthContext(); // Gets the currently logged-in user.

  // --- STATE MANAGEMENT ---
  const [formData, setFormData] = useState({ title: '', description: '', price: '', category: '' });
  const [newImage, setNewImage] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState('');
  const [loading, setLoading] = useState(true);

  // --- DATA FETCHING & SECURITY ---
  // This useEffect hook fetches the product data and performs the security check.
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Use our central 'api' instance, which handles the base URL.
        const { data: product } = await api.get(`/products/${id}`);
        
        // --- THIS IS THE AUTHORIZATION FIX ---
        // After fetching the product, we immediately check if the logged-in user is the owner.
        // The optional chaining `?` prevents crashes if the 'user' object from context is still loading.
        if (user?.id !== product.user._id) {
          toast.error("You are not authorized to edit this product.");
          navigate('/my-listings'); // Redirect the unauthorized user away.
          return; // Stop the function here.
        }

        // If the user is authorized, populate the form with the product's data.
        setFormData({
          title: product.title,
          description: product.description,
          price: product.price,
          category: product.category,
        });
        setExistingImageUrl(product.imageUrl);

      } catch (err) {
        toast.error('Could not load product data.');
        navigate('/my-listings'); // If the product doesn't exist, redirect.
      } finally {
        setLoading(false);
      }
    };
    
    // We wait until the 'user' object is available from the context before trying to fetch.
    // This prevents race conditions.
    if (user) {
        fetchProduct();
    }
  }, [id, user, navigate]); // The effect depends on these values.

  // --- EVENT HANDLERS ---

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submissionData = new FormData();
    submissionData.append('title', formData.title);
    submissionData.append('description', formData.description);
    submissionData.append('price', formData.price);
    submissionData.append('category', formData.category);
    if (newImage) {
      submissionData.append('image', newImage);
    }
    try {
      // Use our central 'api' instance for the update request.
      const response = await api.put(`/products/${id}`, submissionData);
      toast.success('Product updated successfully!');
      navigate(`/product/${response.data._id}`);
    } catch (err) {
      toast.error('Failed to update product. Please try again.');
    }
  };
  
  // --- RENDER LOGIC ---

  if (loading) {
    return <Spinner />; // Use the Spinner component for a better loading experience.
  }

  return (
    <div className="sell-page-container">
      <div className="sell-form-wrapper">
        <h1 className="form-title">Edit Your Listing</h1>
        <form className="sell-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Item Title</label>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" rows="4" value={formData.description} onChange={handleChange} required></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="price">Price (in ₹)</label>
            <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select id="category" name="category" value={formData.category} onChange={handleChange} required>
                <option value="">-- Select a Category --</option>
                <option value="Bicycles">Bicycles</option>
                <option value="Books">Books</option>
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Current Image</label>
            <img src={existingImageUrl} alt="Current product" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
          </div>
          <div className="form-group">
            <label htmlFor="image">Upload New Image (Optional)</label>
            <input 
              type="file" 
              id="image" 
              name="image" 
              accept="image/*"
              onChange={handleImageChange}
            />
            <small>Leave this blank to keep the current image.</small>
          </div>
          <button type="submit" className="submit-button">Update My Item</button>
        </form>
      </div>
    </div>
  );
};

export default EditProductPage;