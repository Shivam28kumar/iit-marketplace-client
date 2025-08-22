// src/pages/MyListingsPage.js
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios'; // Use our central api instance
import { useAuthContext } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner'; // Import the Spinner for a better UX
import './MyListingsPage.css';

const MyListingsPage = () => {
  // --- STATE MANAGEMENT ---
  const [listings, setListings] = useState([]); // Holds the array of products fetched from the API
  const [loading, setLoading] = useState(true); // Manages the loading spinner's visibility
  const { user } = useAuthContext(); // Gets the logged-in user's info from the global context

  // --- DATA FETCHING ---
  // This useEffect hook is responsible for fetching the user's personal product listings.
  useEffect(() => {
    // We only attempt to fetch data if we know who the user is.
    if (user) {
      const fetchMyListings = async () => {
        setLoading(true); // Show the spinner before starting the API call
        try {
          // Make a GET request to our backend endpoint for user-specific products.
          const { data } = await api.get(`/products/user/${user.id}`);
          setListings(data); // Store the fetched products in our state.
        } catch (err) {
          console.error('Failed to fetch listings:', err);
          // We could add a toast notification here for the user.
        } finally {
          // No matter what, stop showing the spinner once the API call is complete.
          setLoading(false);
        }
      };
      fetchMyListings();
    } else {
      // If there's no user, we can stop the loading state immediately.
      setLoading(false);
    }
  // --- THIS IS THE FIX for the "stale data" bug ---
  // By using an empty dependency array [], this effect will run
  // every single time the user navigates to this page, guaranteeing the data is always fresh.
  }, []); 
  
  // --- EVENT HANDLER ---
  // This function is passed down as a prop to each ProductCard.
  // When a product is successfully deleted in the child component, this function is called.
  const handleDelete = (deletedProductId) => {
    // This is an "optimistic update". We remove the product from the local state
    // immediately, so the user sees the change instantly without a page reload.
    setListings(prevListings => prevListings.filter(p => p._id !== deletedProductId));
  };

  // --- RENDER LOGIC ---

  // Show the spinner while data is being fetched.
  if (loading) {
    return <Spinner />;
  }

  // If loading is finished but there's no logged-in user, prompt them to log in.
  // This is a fallback, as the ProtectedRoute should prevent this page from being accessed.
  if (!user) {
    return <div className="error-message">Please <Link to="/login">log in</Link> to see your listings.</div>;
  }

  return (
    <div className="my-listings-page">
      <h1>My Listings</h1>
      {/* 
        Conditionally render the content based on whether the 'listings' array is empty.
      */}
      {listings.length === 0 ? (
        // If the user has no listings, show a helpful prompt.
        <div className="no-listings">
          <p>You haven't listed any items yet.</p>
          <Link to="/sell" className="sell-button">List Your First Item</Link>
        </div>
      ) : (
        // If the user has listings, map over the array and render a ProductCard for each one.
        <div className="product-grid">
          {listings.map(product => (
            <ProductCard
              key={product._id}
              product={product}
              showControls={true} // Prop to tell the card to show Edit/Delete buttons
              onDelete={handleDelete} // Prop to pass the delete handler function down
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListingsPage;