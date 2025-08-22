// src/components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaYoutube } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-column">
          <h3>About</h3>
          <ul>
            <li><Link to="#">About Us</Link></li>
            <li><Link to="#">Contact Us</Link></li>
            <li><Link to="#">Careers</Link></li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Help</h3>
          <ul>
            <li><Link to="#">Payments</Link></li>
            <li><Link to="#">Shipping</Link></li>
            <li><Link to="#">FAQ</Link></li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Consumer Policy</h3>
          <ul>
            <li><Link to="#">Terms Of Use</Link></li>
            <li><Link to="#">Privacy Policy</Link></li>
            <li><Link to="#">Return Policy</Link></li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Social</h3>
          <div className="footer-social-icons">
            <a href="#" aria-label="Facebook"><FaFacebook /></a>
            <a href="#" aria-label="Twitter"><FaTwitter /></a>
            <a href="#" aria-label="YouTube"><FaYoutube /></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {currentYear} IIT Marketplace. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;