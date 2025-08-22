// src/pages/VerifyEmailPage.js
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useAuthContext } from '../context/AuthContext';
import './AuthForm.css'; // We can reuse the same styles

const VerifyEmailPage = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  // IMPORTANT: We get the user's email passed from the RegisterPage
  const email = location.state?.email;

  // If the user lands on this page directly without an email, redirect them.
  if (!email) {
    navigate('/register');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Send the email and OTP to our new backend endpoint
      const response = await api.post('/auth/verify-email', { email, otp });
      
      // The backend will send back a token upon successful verification.
      // We use our global login function to set the auth state.
      login(response.data.token);
      
      toast.success(response.data.message);
      navigate('/'); // Redirect to the homepage on success
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed.');
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-wrapper">
        <h1 className="form-title">Verify Your Email</h1>
        <p className="auth-switch-text" style={{ marginBottom: '1.5rem' }}>
          An OTP has been sent to <strong>{email}</strong>. Please enter it below.
        </p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="otp">6-Digit OTP</label>
            <input
              type="text"
              id="otp"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength="6"
              required
            />
          </div>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify & Login'}
          </button>
        </form>
        {/* We can add a "Resend OTP" button here later */}
      </div>
    </div>
  );
};

export default VerifyEmailPage;