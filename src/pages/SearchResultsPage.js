// src/pages/SearchResultsPage.js
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios'; // <-- CRITICAL: Use our central api instance
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';
import './HomePage.css';

const SearchResultsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  // Read all three possible parameters from the URL.
  const query = searchParams.get('query') || '';
  const category = searchParams.get('category') || 'All';
  const college = searchParams.get('college') || 'All';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      
      const params = {
        search: query,
        category: category,
      };

      // Only add the 'college' filter to our API call if the user has explicitly selected one.
      if (college && college !== 'All') {
        params.college = college;
      }
      
      try {
        // --- THIS IS THE CRITICAL FIX ---
        // We now correctly use our 'api' instance to make the request.
        // This will automatically use the correct live URL in production.
        const { data } = await api.get('/products', { params });
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch search results:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query, category, college]);

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