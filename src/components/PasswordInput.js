// src/components/PasswordInput.js
import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import both eye icons
import './PasswordInput.css';

// This component will accept all the standard input props (value, onChange, name, etc.)
const PasswordInput = ({ value, onChange, name = "password", id = "password", required = true, minLength = 6, placeholder = "" }) => {
  // State to manage whether the password should be visible
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="password-input-wrapper">
      <input
        type={showPassword ? 'text' : 'password'} // Dynamically change the input type
        value={value}
        onChange={onChange}
        name={name}
        id={id}
        required={required}
        minLength={minLength}
        placeholder={placeholder}
        className="password-input" // This is for styling
      />
      {/* The icon that toggles the state */}
      <span
        onClick={() => setShowPassword(!showPassword)}
        className="password-toggle-icon"
      >
        {/* Show a different icon based on the state */}
        {showPassword ? <FaEyeSlash /> : <FaEye />}
      </span>
    </div>
  );
};

export default PasswordInput;