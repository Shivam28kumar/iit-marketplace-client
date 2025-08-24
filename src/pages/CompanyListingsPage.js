// src/pages/CompanyListingsPage.js
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuthContext } from '../context/AuthContext';

// Import reusable components
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';

// Import the CSS. We can safely reuse the styles from MyListingsPage.
import './MyListingsPage.css';

const CompanyListingsPage = () => {
  // --- STATE MANAGEMENT ---
  const [listings, setListings] = useState([]); // Holds the raw array of products from the API
  const [loading, setLoading] = useState(true); // Manages the loading spinner visibility

  // --- CONTEXT ---
  // Get the currently logged-in user to fetch their specific listings.
  const { user } = useAuthContext();

  // --- DATA FETCHING ---
  // This useEffect hook runs when the component loads to fetch the company's products.
  useEffect(() => {
    // We only proceed if the user object is available.
    if (user) {
      const fetchMyListings = async () => {
        setLoading(true);
        try {
          // Make an API call to the endpoint that gets all products for a specific user ID.
          const { data } = await api.get(`/products/user/${user.id}`);
          setListings(data);
        } catch (err) {
          console.error('Failed to fetch company listings:', err);
          // A toast notification could be added here for the user.
        } finally {
          setLoading(false);
        }
      };
      fetchMyListings();
    }
  }, [user]); // The dependency array ensures this runs if the user object changes.

  // --- EVENT HANDLER for DELETION ---
  // This function is passed down to each ProductCard.
  const handleDelete = (deletedProductId) => {
    // When a product is deleted, we update the state locally for an instant UI update.
    setListings(prevListings => prevListings.filter(p => p._id !== deletedProductId));
  };

  // --- DATA PROCESSING for CATEGORY GROUPING ---
  // This is the core logic for your category-wise display.
  // We use the .reduce() method to transform the flat 'listings' array
  // into an object where keys are category names and values are arrays of products.
  const groupedProducts = listings.reduce((accumulator, product) => {
    const category = product.category;
    // If we haven't seen this category before, create an empty array for it.
    if (!accumulator[category]) {
      accumulator[category] = [];
    }
    // Push the current product into its corresponding category array.
    accumulator[category].push(product);
    return accumulator;
  }, {}); // Start with an empty object as the initial value for the accumulator.

  // --- RENDER LOGIC ---
  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="my-listings-page">
      <h1>My Assured Products</h1>
      
      {listings.length === 0 ? (
        // If the company has no listings, show a helpful prompt.
        <div className="no-listings">
          <p>You haven't listed any Assured Products yet.</p>
          <Link to="/sell" className="sell-button">List Your First Product</Link>
        </div>
      ) : (
        // If there are listings, we map over the KEYS of our 'groupedProducts' object.
        Object.keys(groupedProducts).map(category => (
          <section key={category} className="category-section">
            {/* Display the category name as a prominent heading */}
            <h2>{category}</h2>
            <div className="product-grid">
              {/* Then, map over the array of products within that specific category */}
              {groupedProducts[category].map(product => (
                <ProductCard
                  key={product._id}
                  product={product}
                  showControls={true} // Show Edit/Delete buttons
                  onDelete={handleDelete} // Pass down the delete handler
                />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
};

export default CompanyListingsPage;