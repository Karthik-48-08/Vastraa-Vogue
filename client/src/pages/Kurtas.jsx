import React from "react";
import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ProductPage.css"; // Assuming you have a CSS file for styling
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom"; // ✅ 1. Import useNavigate

// Import images
import kurta1a from "../assets/mens/kurtas/Mens-Designer-Kurta.jpeg";
import kurta1b from "../assets/mens/kurtas/Mens-Plain-Kurta.jpeg";
import kurta1c from "../assets/mens/kurtas/Mens-salwar-sky-blue.jpg";

import kurta2a from "../assets/mens/kurtas/Mens-salwar-sky-blue.jpg";
import kurta2b from "../assets/mens/kurtas/Mens-salwar-white.jpg";
import kurta2c from "../assets/mens/kurtas/Mens-Designer-Kurta.jpeg";

const products = [
  {
    id: 301, // ✅ Unique ID
    name: "Classic Cotton Kurta",
    price: "₹999",
    images: [kurta1a, kurta1b, kurta1c],
  },
  {
    id: 302, // ✅ Unique ID
    name: "Printed Festive Kurta",
    price: "₹1299",
    images: [kurta2a, kurta2b, kurta2c],
  },
];

export default function Kurtas() {
  const { addToCart } = useCart();
  const navigate = useNavigate(); // ✅ 2. Initialize useNavigate

  const handleAddToCart = (product) => {
    addToCart(product);
    navigate("/cart"); // ✅ 3. Navigate to cart page
  };

  return (
    <div className="kurtas-page">
      <h2 className="kurtas-title">Men's Kurtas Collection</h2>
      <div className="kurtas-grid">
        {products.map((item) => (
          <div key={item.id} className="kurtas-card">
            <Carousel interval={null} indicators={false} controls={true}>
              {item.images.map((img, idx) => (
                <Carousel.Item key={idx}>
                  <img
                    src={img}
                    alt={`${item.name} ${idx + 1}`}
                    className="kurtas-img"
                  />
                </Carousel.Item>
              ))}
            </Carousel>
            <h3 className="kurtas-name">{item.name}</h3>
            <p className="kurtas-price">{item.price}</p>
            <button
              className="add-to-cart-btn"
              onClick={() => handleAddToCart(item)} // ✅ Use the new handler
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}