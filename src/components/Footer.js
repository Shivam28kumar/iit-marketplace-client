// src/components/Footer/Footer.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
  FaCcAmex,
} from "react-icons/fa";
import { RiArrowRightLine } from "react-icons/ri"; // for the newsletter button
import "./Footer.css";

// Data-driven approach for scalability and easier maintenance
const footerSections = [
  {
    title: "Get to Know Us",
    links: [
      { text: "About Us", to: "/about" },
      { text: "Careers", to: "/careers" },
      { text: "Press Releases", to: "/press" },
      { text: "Our Blog", to: "/blog" },
    ],
  },
  {
    title: "Customer Service",
    links: [
      { text: "Contact Us", to: "/contact" },
      { text: "FAQ", to: "/faq" },
      { text: "Shipping & Delivery", to: "/shipping" },
      { text: "Returns & Exchanges", to: "/returns" },
    ],
  },
  {
    title: "Policies",
    links: [
      { text: "Privacy Policy", to: "/privacy" },
      { text: "Terms of Use", to: "/terms" },
      { text: "Accessibility", to: "/accessibility" },
      { text: "Cookie Policy", to: "/cookies" },
    ],
  },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();
  // State for mobile accordion
  const [activeAccordion, setActiveAccordion] = useState(null);

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  return (
    <footer className="site-footer">
      <div className="footer-container">
        {/* Top Section: Newsletter and Social */}
        <div className="footer-top">
          <div className="footer-column-newsletter">
            <h3>Stay in the loop</h3>
            <p>Get exclusive deals, product news, and more.</p>
            <form className="newsletter-form">
              <input type="email" placeholder="Your email address" aria-label="Email address for newsletter"/>
              <button type="submit" aria-label="Subscribe to newsletter">
                <RiArrowRightLine />
              </button>
            </form>
          </div>
          <div className="footer-column-social">
            <h3>Follow Us</h3>
            <div className="footer-social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebookF /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><FaTwitter /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><FaYoutube /></a>
            </div>
          </div>
        </div>

        {/* Middle Section: Main Links */}
        <div className="footer-main">
          {footerSections.map((section, index) => (
            <div className="footer-column" key={index}>
              <h3 className="footer-column-title" onClick={() => toggleAccordion(index)}>
                {section.title}
                <span className="accordion-icon"></span>
              </h3>
              <ul className={activeAccordion === index ? "active" : ""}>
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link to={link.to}>{link.text}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section: Copyright, App, Payments */}
        <div className="footer-bottom">
          <div className="footer-bottom-left">
            <p>© {currentYear} IIT Marketplace. All Rights Reserved.</p>
             {/* You can use actual images for these */}
            <div className="app-store-links">
                <a href="#" aria-label="Download on the App Store"><img src="/app-store-badge.svg" alt="App Store"/></a>
                <a href="#" aria-label="Get it on Google Play"><img src="/google-play-badge.svg" alt="Google Play"/></a>
            </div>
          </div>
          <div className="footer-bottom-right">
            <div className="payment-icons">
              <FaCcVisa title="Visa"/>
              <FaCcMastercard title="Mastercard"/>
              <FaCcAmex title="American Express"/>
              <FaCcPaypal title="PayPal"/>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;