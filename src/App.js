// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Import all layout, page, and route components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import CompanyRoute from './components/CompanyRoute';

// Import all pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
// We no longer need ResetPasswordPage, so we remove the import.
import SearchResultsPage from './pages/SearchResultsPage';
import UserProfilePage from './pages/UserProfilePage';
import ProductDetailPage from './pages/ProductDetailPage';
import MyProfilePage from './pages/MyProfilePage';
import MyListingsPage from './pages/MyListingsPage';
import SellPage from './pages/SellPage';
import EditProductPage from './pages/EditProductPage';
import ChatPage from './pages/ChatPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import CompanyDashboardPage from './pages/CompanyDashboardPage';
import CompanyListingsPage from './pages/CompanyListingsPage';

import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
        <Navbar />
        <main>
          <Routes>
            {/* --- Public Routes --- */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/profile/:userId" element={<UserProfilePage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />

            {/* --- THIS IS THE CRITICAL FIX --- */}
            {/* --- Protected Routes (user must be logged in) --- */}
            <Route element={<ProtectedRoute />}>
              <Route path="/my-profile" element={<MyProfilePage />} />
              <Route path="/my-listings" element={<MyListingsPage />} />
              <Route path="/sell" element={<SellPage />} />
              <Route path="/edit-product/:id" element={<EditProductPage />} />
              <Route path="/chat" element={<ChatPage />} />
            </Route>

            {/* --- Company-Only Routes --- */}
            <Route element={<CompanyRoute />}>
              <Route path="/company/dashboard" element={<CompanyDashboardPage />} />
              <Route path="/company/listings" element={<CompanyListingsPage />} />
            </Route>

            {/* --- Admin-Only Routes --- */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;