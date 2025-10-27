import React from "react";
import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ProductPage.css"; // Ensure you have appropriate styles
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom"; // ✅ 1. Import useNavigate

// Import suit images
import suit1a from "../assets/mens/suits/suit-1a.png";
import suit1b from "../assets/mens/suits/suit-1b.png"; // Assuming you have different images
import suit1c from "../assets/mens/suits/suit-1c.png";

import suit2a from "../assets/mens/suits/suit-2a.png";
import suit2b from "../assets/mens/suits/suit-2b.png";
import suit2c from "../assets/mens/suits/suit-2c.png";

const products = [
  {
    id: 401, // ✅ Unique ID
    name: "Classic Black Suit",
    price: "₹3999",
    images: [suit1a, suit1b, suit1c],
  },
  {
    id: 402, // ✅ Unique ID
    name: "Blue Formal Suit",
    price: "₹4299",
    images: [suit2a, suit2b, suit2c],
  },
];

export default function Suits() {
  const { addToCart } = useCart();
  const navigate = useNavigate(); // ✅ 2. Initialize useNavigate

  const handleAddToCart = (product) => {
    addToCart(product);
    navigate("/cart"); // ✅ 3. Navigate to cart page
  };

  return (
    <div className="suits-page">
      <h2 className="suits-title">Men's Suits Collection</h2>
      <div className="suits-grid">
        {products.map((item) => (
          <div key={item.id} className="suits-card">
            <Carousel interval={null} indicators={false} controls={true}>
              {item.images.map((img, idx) => (
                <Carousel.Item key={idx}>
                  <img
                    src={img}
                    alt={`${item.name} ${idx + 1}`}
                    className="suits-img"
                  />
                </Carousel.Item>
              ))}
            </Carousel>
            <h3 className="suits-name">{item.name}</h3>
            <p className="suits-price">{item.price}</p>
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