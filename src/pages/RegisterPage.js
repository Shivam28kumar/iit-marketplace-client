// src/pages/RegisterPage.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import PasswordInput from '../components/PasswordInput';
import './AuthForm.css';

const RegisterPage = () => {
  // State to hold all the data from the form fields.
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    collegeId: '',
    phoneNumber: '',
  });

  // State to hold the list of colleges fetched from the API for the dropdown.
  const [colleges, setColleges] = useState([]);
  const [loadingColleges, setLoadingColleges] = useState(true);

  // --- THIS IS THE FIX (Part 1) ---
  // We add a new state variable to track when the form is being submitted to the backend.
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  // This useEffect hook runs once when the component first loads.
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const { data } = await api.get('/colleges');
        if (Array.isArray(data)) {
          setColleges(data);
        }
      } catch (error) {
        toast.error("Could not load the list of colleges.");
        console.error("Failed to fetch colleges:", error);
      } finally {
        setLoadingColleges(false);
      }
    };
    fetchColleges();
  }, []); // The empty array ensures this runs only once.

  // A single handler to update the formData state for all text inputs.
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // The function that runs when the "Register" button is clicked.
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.collegeId) return toast.error("Please select your college.");
    
    setIsSubmitting(true);
    
    try {
      const response = await api.post('/auth/register', formData);
      toast.success(response.data.message);
      navigate('/verify-email', { state: { email: formData.email } });
    } catch (err) {
      // --- THIS IS THE FIX ---
      // We create a variable to hold the error message.
      let errorMessage = 'Registration failed. Please try again.'; // A default message

      // We check if the error object from the server has the detailed message.
      // The `?.` is optional chaining, which safely checks if `err.response` and `err.response.data` exist.
      if (err.response?.data?.message) {
        // If it exists, we use the specific message from the backend.
        errorMessage = err.response.data.message;
      }
      
      // We then display that specific message in our toast notification.
      toast.error(errorMessage);
      
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-wrapper">
        <h1 className="form-title">Create a New Account</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number (Optional)</label>
            <input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="email">Official College Email Address</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="collegeId">Select Your College</label>
            <select id="collegeId" name="collegeId" value={formData.collegeId} onChange={handleChange} required>
              <option value="" disabled>
                {loadingColleges ? 'Loading colleges...' : '-- Please select --'}
              </option>
              {colleges.map(college => (
                <option key={college._id} value={college._id}>{college.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <PasswordInput
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* --- THIS IS THE FIX (Part 4) --- */}
          {/* The button's `disabled` property is now tied to our `isSubmitting` state. */}
          {/* The text inside the button also changes to provide user feedback. */}
          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? 'Sending OTP...' : 'Register'}
          </button>
        </form>
        <p className="auth-switch-text">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;