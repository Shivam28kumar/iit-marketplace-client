// src/pages/MyProfilePage.js
import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { useAuthContext } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import ProductCard from '../components/ProductCard';
import './MyProfilePage.css';
import toast from 'react-hot-toast';

const MyProfilePage = () => {
  const { user } = useAuthContext();
  const [profile, setProfile] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // ... (useEffect and handleSubmit are unchanged)
  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const [profileRes, listingsRes] = await Promise.all([
            api.get('/users/me'),
            api.get(`/products/user/${user.id}`)
          ]);
          setProfile(profileRes.data);
          setListings(listingsRes.data);
        } catch (error) { console.error("Failed to fetch profile data:", error);
        } finally { setLoading(false); }
      }
    };
    fetchData();
  }, [user]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/users/me', { fullName: profile.fullName });
      setProfile(res.data);
      toast.success('Profile updated successfully!');
    } catch (err) { toast.error('Failed to update profile.'); }
  };

  if (loading) return <Spinner />;
  if (!profile) return <div className="error-message">Could not load profile.</div>;

  return (
    <div className="profile-page">
      <div className="profile-details-card">
        <h2>My Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="fullName" value={profile.fullName} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" value={profile.email} disabled />
          </div>
          
          {/* --- FIX #1: DISPLAY COLLEGE NAME --- */}
          <div className="form-group">
            <label>College</label>
            {/* The value is accessed via profile.college.name because of the .populate() */}
            <input type="text" value={profile.college ? profile.college.name : 'N/A'} disabled />
          </div>

          {/* --- FIX #2: DISPLAY PHONE NUMBER --- */}
          <div className="form-group">
            <label>Phone Number</label>
            <input type="text" value={profile.phoneNumber || 'Not provided'} disabled />
            <small>Phone number can be added during registration.</small>
          </div>
          
          <button type="submit" className="submit-button">Save Changes</button>
        </form>
      </div>
      <div className="profile-listings">
        {/* ... (listings part is unchanged) ... */}
      </div>
    </div>
  );
};

export default MyProfilePage;