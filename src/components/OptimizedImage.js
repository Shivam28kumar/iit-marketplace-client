// src/components/OptimizedImage.js
import React from 'react';

const OptimizedImage = ({ src, alt, className }) => {
  // 1. Safety Check: If there is no src, return nothing to prevent errors
  if (!src) return null;

  // 2. Non-Cloudinary Images: If it's a local asset or external link not from Cloudinary,
  // just render a standard image tag.
  if (!src.includes('res.cloudinary.com')) {
    return <img src={src} alt={alt} className={className} loading="lazy" />;
  }

  // 3. Cloudinary Optimization Logic:
  // We split the URL to inject transformation parameters.
  // Example URL: https://res.cloudinary.com/demo/image/upload/v1234/sample.jpg
  // We want to insert transformations after "/upload/"
  const parts = src.split('/upload/');
  const baseUrl = parts[0] + '/upload/';
  const imagePath = parts[1];

  // Define responsive widths
  const mobileParams = 'w_480,q_auto,f_auto'; // 480px wide, auto quality, auto format
  const tabletParams = 'w_768,q_auto,f_auto';
  const desktopParams = 'w_1280,q_auto,f_auto'; // High res for desktop

  return (
    <picture className={className}>
      {/* Mobile Source */}
      <source 
        media="(max-width: 480px)" 
        srcSet={`${baseUrl}${mobileParams}/${imagePath}`} 
      />
      {/* Tablet Source */}
      <source 
        media="(max-width: 768px)" 
        srcSet={`${baseUrl}${tabletParams}/${imagePath}`} 
      />
      {/* Desktop/Default Source */}
      <img
        src={`${baseUrl}${desktopParams}/${imagePath}`}
        alt={alt}
        className={className}
        loading="lazy"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </picture>
  );
};

export default OptimizedImage;