// src/components/TrustBar.js
import React from 'react';
import { FaShieldAlt, FaUndo, FaHeadset } from 'react-icons/fa';
import './TrustBar.css';

const TrustBar = () => {
  return (
    <section className="trust-bar">
      <div className="trust-item">
        <FaShieldAlt />
        <span>Verified Sellers</span>
      </div>
      <div className="trust-item">
        <FaUndo />
        <span>Easy Returns</span>
      </div>
      <div className="trust-item">
        <FaHeadset />
        <span>24/7 Support</span>
      </div>
    </section>
  );
};
export default TrustBar;