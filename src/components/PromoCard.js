// src/components/PromoCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import './PromoCard.css';
// For this special card, we use a static image from our assets
import promoImageUrl from '../assets/ganesh-promo.jpg'; 

const PromoCard = () => {
  return (
    <section className="promo-card">
      <img src={promoImageUrl} alt="Ganesh Puja Special Offers" className="promo-image" />
      <div className="promo-overlay"></div>
      <div className="promo-content">
        <h2>Ganesh Puja Offers</h2>
        <p>Cool & Oversized T-Shirts starting at ₹249.</p>
        <Link to="/search?category=Other&query=shirt" className="btn btn-primary">Shop Now</Link>
      </div>
    </section>
  );
};
export default PromoCard;