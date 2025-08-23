// src/pages/SearchResultsPage.js
import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios'; // Correctly imports our central api instance
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';
import { useAuthContext } from '../context/AuthContext';
import './HomePage.css'; // Reusing the homepage styles

const SearchResultsPage = () => {
  // --- STATE AND CONTEXT ---
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const { user } = useAuthContext(); // Get the logged-in user for the college filter

  // --- DATA FETCHING ---
  // Get the search terms from the URL query parameters
  const query = searchParams.get('query') || '';
  const category = searchParams.get('category') || 'All';

  // This useEffect hook fetches products based on the search/filter criteria.
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      
      // Prepare the parameters for the API call
      const params = {
        search: query,
        category: category,
      };

      // If a regular user is logged in, add their college to the search parameters.
      // This ensures all searches are automatically localized for them.
      if (user && user.role === 'user' && user.college) {
        params.college = user.college.id;
      }
      
      try {
        // --- THIS IS THE CRITICAL FIX ---
        // We now correctly use our 'api' instance to make the request.
        // The base URL is handled automatically.
        const { data } = await api.get('/products', { params });
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch search results:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    // This hook re-runs whenever the search query, category, or logged-in user changes.
  }, [query, category, user]);

  // --- RENDER LOGIC ---
  return (
    <div className="homepage">
      <h1 className="homepage-title">
        {query ? `Results for "${query}"` : `Browsing ${category}`}
      </h1>
      
      {loading ? (
        <Spinner />
      ) : (
        <div className="product-grid">
          {products.length > 0 ? (
            products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <p className="no-products-message">No products found matching your criteria.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;