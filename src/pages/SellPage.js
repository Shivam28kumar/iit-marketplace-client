// src/pages/SellPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useAuthContext } from '../context/AuthContext';
import './SellPage.css';

const SellPage = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', description: '', price: '', category: '' });
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [colleges, setColleges] = useState([]);
  const [selectedColleges, setSelectedColleges] = useState([]);

  useEffect(() => {
    // Fetch the list of all colleges, but ONLY if the logged-in user is a 'company'.
    if (user?.role === 'company') {
      const fetchColleges = async () => {
        try {
          const { data } = await api.get('/colleges');
          setColleges(data);
        } catch (error) {
          toast.error("Could not load college list.");
        }
      };
      fetchColleges();
    }
  }, [user]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleImageChange = (e) => setImage(e.target.files[0]);

  const handleCollegeSelection = (e) => {
    const collegeId = e.target.value;
    if (e.target.checked) {
      setSelectedColleges([...selectedColleges, collegeId]);
    } else {
      setSelectedColleges(selectedColleges.filter(id => id !== collegeId));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return toast.error('Please select an image.');
    if (user?.role === 'company' && selectedColleges.length === 0) {
      return toast.error('Please select at least one college for visibility.');
    }

    setIsSubmitting(true);
    const submissionData = new FormData();
    submissionData.append('title', formData.title);
    submissionData.append('description', formData.description);
    submissionData.append('price', formData.price);
    submissionData.append('category', formData.category);
    submissionData.append('image', image);

    if (user?.role === 'company') {
      // We must stringify the array to send it via FormData
      submissionData.append('visibleIn', JSON.stringify(selectedColleges));
    }

    try {
      const response = await api.post('/products', submissionData);
      toast.success('Product listed successfully!');
      navigate(`/product/${response.data._id}`);
    } catch (err) {
      toast.error('Failed to list product.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="sell-page-container">
      <div className="sell-form-wrapper">
        <h1 className="form-title">
          {user?.role === 'company' ? 'List a New Assured Product' : 'List Your Item for Sale'}
        </h1>
        <form className="sell-form" onSubmit={handleSubmit}>
          {/* ... standard form inputs ... */}
          <div className="form-group"> <label htmlFor="title">Item Title</label> <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required /> </div>
          <div className="form-group"> <label htmlFor="description">Description</label> <textarea id="description" name="description" rows="4" value={formData.description} onChange={handleChange} required></textarea> </div>
          <div className="form-group"> <label htmlFor="price">Price (in ₹)</label> <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} required /> </div>
          <div className="form-group"> <label htmlFor="category">Category</label> <select id="category" name="category" value={formData.category} onChange={handleChange} required> <option value="">-- Select --</option> <option value="Bicycles">Bicycles</option> <option value="Books">Books</option> <option value="Electronics">Electronics</option> <option value="Furniture">Furniture</option> <option value="Other">Other</option> </select> </div>
          <div className="form-group"> <label htmlFor="image">Upload Photo</label> <input type="file" id="image" name="image" accept="image/*" onChange={handleImageChange} required /> </div>

          {/* --- Conditional Rendering for Company Users --- */}
          {user?.role === 'company' && (
            <div className="form-group">
              <label>Make this product visible to:</label>
              <div className="college-checkbox-group">
                {colleges.map(college => (
                  <div key={college._id} className="checkbox-item">
                    <input type="checkbox" id={college._id} value={college._id} onChange={handleCollegeSelection} />
                    <label htmlFor={college._id}>{college.name}</label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? 'Listing...' : 'List My Item'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SellPage;