// src/pages/SearchResultsPage.js
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom'; // This hook reads URL query params
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';
import './HomePage.css'; // We can reuse the homepage styles

const SearchResultsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  // Get the 'query' and 'category' from the URL, e.g., /search?query=bike&category=All
  const query = searchParams.get('query') || '';
  const category = searchParams.get('category') || 'All';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get('http://localhost:5000/api/products', {
          params: { search: query, category: category },
        });
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch search results:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query, category]); // Re-run this effect whenever the query or category in the URL changes

  return (
    <div className="homepage">
      <h1 className="homepage-title">
        {query ? `Results for "${query}"` : 'All Products'}
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
            <p className="no-products-message">No products found matching your search.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;