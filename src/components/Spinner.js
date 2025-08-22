// src/components/Spinner.js
import React from 'react';
import './Spinner.css'; // We'll create this CSS

const Spinner = () => {
  return (
    <div className="spinner-overlay">
      <div className="spinner"></div>
    </div>
  );
};

export default Spinner;