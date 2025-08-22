// src/dummyData.js

// STEP 1: Import the images from your assets folder
import bikeImage from './assets/bike.jpg';
import bookImage from './assets/book.jpg';
import tableImage from './assets/table.jpg';

// STEP 2: Use these imported images in your data
export const dummyProducts = [
  {
    id: '1',
    seller: { name: 'Rohan Sharma' },
    title: 'Slightly Used Hero Sprint Cycle',
    description: 'Good condition, selling because I am graduating. Both tires are new.',
    price: 2800,
    category: 'Bicycles',
    status: 'available',
    imageUrl: bikeImage // Use the imported image variable
  },
  {
    id: '2',
    seller: { name: 'Priya Mehta' },
    title: 'K.C. Sinha Mathematics Textbook',
    description: 'For MA101 course. No markings inside, almost new.',
    price: 350,
    category: 'Books',
    status: 'available',
    imageUrl: bookImage // Use the imported image variable
  },
  {
    id: '3',
    seller: { name: 'Ankit Desai' },
    title: '2 Month Old Bajaj Cooler',
    description: 'Excellent working condition, very powerful. Includes stand.',
    price: 4500,
    category: 'Electronics',
    status: 'sold',
    imageUrl: 'https://via.placeholder.com/400x300.png?text=Cooler' // This one doesn't matter as it's sold
  },
  {
    id: '4',
    seller: { name: 'Sneha Verma' },
    title: 'Study Table and Chair',
    description: 'Wooden study table, very sturdy. Chair is also in good condition.',
    price: 1500,
    category: 'Furniture',
    status: 'available',
    imageUrl: tableImage // Use the imported image variable
  }
];