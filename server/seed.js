const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const products = [
  // --- MEN'S COLLECTION ---

  // Shirts (4 products)
  { id: 101, name: "Formal White Shirt", price: "₹999", images: ["/images/mens/shirts/white_1_label.png", "/images/mens/shirts/white_2.webp", "/images/mens/shirts/Formal-Shirt-Plain-White.avif"], category: "men", subCategory: "shirts" },
  { id: 102, name: "Casual Black Shirt", price: "₹799", images: ["/images/mens/shirts/Black_1_with_label.png", "/images/mens/shirts/black_1.jpg", "/images/mens/shirts/Formal-Shirt-Plain-Black.avif"], category: "men", subCategory: "shirts" },
  { id: 103, name: "Checked Shirt", price: "₹899", images: ["/images/mens/shirts/Checked_1_label.png", "/images/mens/shirts/checked_2.png", "/images/mens/shirts/checked_3.png"], category: "men", subCategory: "shirts" },
  { id: 104, name: "Printed Pattern Shirt", price: "₹1099", images: ["/images/mens/shirts/printed_1.png", "/images/mens/shirts/printed_2.png", "/images/mens/shirts/printed_3.png"], category: "men", subCategory: "shirts" },

  // Trousers (2 products)
  { id: 201, name: "Chinos", price: "₹1299", images: ["/images/mens/trousers/black_1.png", "/images/mens/trousers/black_2.png", "/images/mens/trousers/Formal-Trousers-Black.jpg"], category: "men", subCategory: "trousers" },
  { id: 202, name: "Formal Pants", price: "₹1499", images: ["/images/mens/trousers/grey_1.png", "/images/mens/trousers/grey_2.png", "/images/mens/trousers/Formal-Trousers-Grey.jpg"], category: "men", subCategory: "trousers" },

  // Kurtas (2 products)
  { id: 301, name: "Classic Cotton Kurta", price: "₹999", images: ["/images/mens/kurtas/Mens-Designer-Kurta.jpeg", "/images/mens/kurtas/Mens-Plain-Kurta.jpeg", "/images/mens/kurtas/Mens-salwar-sky-blue.jpg"], category: "men", subCategory: "kurtas" },
  { id: 302, name: "Printed Festive Kurta", price: "₹1299", images: ["/images/mens/kurtas/Mens-salwar-sky-blue.jpg", "/images/mens/kurtas/Mens-salwar-white.jpg", "/images/mens/kurtas/Mens-Designer-Kurta.jpeg"], category: "men", subCategory: "kurtas" },

  // Suits (2 products)
  { id: 401, name: "Classic Black Suit", price: "₹3999", images: ["/images/mens/suits/Formal-Suit-Black-1.avif", "/images/mens/suits/Formal-Suit-Black-2.avif", "/images/mens/suits/Formal-Suit-Black-1.avif"], category: "men", subCategory: "suits" },
  { id: 402, name: "Blue Formal Suit", price: "₹4299", images: ["/images/mens/suits/Formal-Suit-Black-2.avif", "/images/mens/suits/Formal-Suit-Black-1.avif", "/images/mens/suits/Formal-Suit-Black-2.avif"], category: "men", subCategory: "suits" },

  // --- WOMEN'S COLLECTION ---

  // Kurtis (2 products)
  { id: 501, name: "Daily Wear Cotton Kurti", price: "₹799", images: ["/images/womens/kurtis/kurti-1a.png", "/images/womens/kurtis/kurti-1b.png", "/images/womens/kurtis/kurti-1c.png"], category: "women", subCategory: "kurtis" },
  { id: 502, name: "Floral Printed Kurti", price: "₹999", images: ["/images/womens/kurtis/kurti-2a.png", "/images/womens/kurtis/kurti-2b.png", "/images/womens/kurtis/kurti-2c.png"], category: "women", subCategory: "kurtis" },

  // Salwar Suits (2 products)
  { id: 601, name: "Embroidered Anarkali Suit", price: "₹2499", images: ["/images/womens/salwarsuits/salwar-1a.png", "/images/womens/salwarsuits/salwar-1b.png", "/images/womens/salwarsuits/salwar-1c.png"], category: "women", subCategory: "salwarsuits" },
  { id: 602, name: "Straight Cut Palazzo Suit", price: "₹1899", images: ["/images/womens/salwarsuits/salwar-2a.png", "/images/womens/salwarsuits/salwar-2b.png", "/images/womens/salwarsuits/salwar-2c.png"], category: "women", subCategory: "salwarsuits" },

  // Lehengas (2 products)
  { id: 701, name: "Red Bridal Lehenga", price: "₹8999", images: ["/images/womens/lehengas/Bridal-1a.png", "/images/womens/lehengas/Bridal-1b.png", "/images/womens/lehengas/Bridal-1c.png"], category: "women", subCategory: "lehengas" },
  { id: 702, name: "Sequin Party Wear Lehenga", price: "₹5999", images: ["/images/womens/lehengas/Partywear-1a.png", "/images/womens/lehengas/Partywear-1b.png", "/images/womens/lehengas/Partywear-1c.png"], category: "women", subCategory: "lehengas" },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding...');
    
    // Clear existing products to ensure a fresh start
    await Product.deleteMany({});
    console.log('Existing products cleared.');
    
    // Insert the new, complete list of products
    await Product.insertMany(products);
    console.log('All sample products have been successfully added!');
    
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    // Disconnect from the database
    mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
};

seedDB();