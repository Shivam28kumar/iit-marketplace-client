// src/pages/ForgotPasswordPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import './AuthForm.css';
import PasswordInput from '../components/PasswordInput';


const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // --- NEW: State to control which form step to show ---
  const [step, setStep] = useState(1); // Step 1: Enter email, Step 2: Enter OTP & new password
  
  const navigate = useNavigate();

  // Handles the initial email submission
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      toast.success('An OTP has been sent to your email.');
      setStep(2); // <-- Move to the next step on success
    } catch (err) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handles the final password reset submission
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/reset-password', { email, otp, password });
      toast.success(response.data.message);
      navigate('/login'); // Redirect to login page on final success
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-wrapper">
        {/* --- We now use the 'step' state to conditionally render the correct form --- */}

        {step === 1 ? (
          // --- STEP 1: Email Form ---
          <div>
            <h1 className="form-title">Forgot Password</h1>
            <p className="auth-switch-text" style={{ marginBottom: '1.5rem' }}>
              Enter your email and we'll send you an OTP to reset your password.
            </p>
            <form className="auth-form" onSubmit={handleRequestOtp}>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset OTP'}
              </button>
            </form>
          </div>
        ) : (
          // --- STEP 2: OTP and New Password Form ---
          <div>
            <h1 className="form-title">Reset Your Password</h1>
            <p className="auth-switch-text" style={{ marginBottom: '1.5rem' }}>
              An OTP has been sent to <strong>{email}</strong>. Please enter it below along with your new password.
            </p>
            <form className="auth-form" onSubmit={handleResetPassword}>
              <div className="form-group">
                <label htmlFor="otp">OTP from Email</label>
                <input type="text" id="otp" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength="6" required />
              </div>
              <div className="form-group">
                <label htmlFor="password">New Password</label>
                <PasswordInput name="Password" id="new-Password-input" value={password} onChange={(e) => setNewPassword(e.target.value)}/>
                
              </div>
              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          </div>
        )}
        
        <p className="auth-switch-text" style={{ marginTop: '1rem' }}>
          Remember your password? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;