// src/pages/LoginPage.js
import React, { useState } from 'react'; // We don't need useContext here anymore
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useAuthContext } from '../context/AuthContext'; // <-- FIX #1: Import the custom hook
import './AuthForm.css';
import PasswordInput from '../components/PasswordInput';


const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  
  // <-- FIX #2: Use the custom hook to get the 'login' function. It's much cleaner.
  const { login } = useAuthContext();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', formData);
      login(response.data.token); // Call the login function from our context
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      const errorMessage = err.response ? err.response.data.message : 'Login failed.';
      toast.error(errorMessage);
    }
  };

  // The JSX part remains the same
  return (
    <div className="auth-container">
      <div className="auth-form-wrapper">
        <h1 className="form-title">Login to Your Account</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">IIT Email Address</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <PasswordInput value={formData.password} onChange={handleChange}/>
            
          </div>
          <div className="forgot-password-link">
              <Link to="/forgot-password">Forgot Password?</Link>
          </div>
          <button type="submit" className="submit-button">Login</button>
        </form>
        <p className="auth-switch-text">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;