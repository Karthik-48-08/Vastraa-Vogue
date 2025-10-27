import React from "react";
import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ProductPage.css";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const products = [
  {
    id: 101, // ✅ FIX: Changed from 1 to 101
    name: "Formal White Shirt",
    price: "₹999",
    images: [
      require("../assets/mens/shirts/white_1_label.png"),
      require("../assets/mens/shirts/white_2.webp"),
      require("../assets/mens/shirts/Formal-Shirt-Plain-White.avif"),
    ],
  },
  {
    id: 102, // ✅ FIX: Changed from 2 to 102
    name: "Casual Black Shirt",
    price: "₹799",
    images: [
      require("../assets/mens/shirts/Black_1_with_label.png"),
      require("../assets/mens/shirts/black_1.jpg"),
      require("../assets/mens/shirts/Formal-Shirt-Plain-Black.avif"),
    ],
  },
  {
    id: 103, // ✅ FIX: Changed from 3 to 103
    name: "Checked Shirt",
    price: "₹899",
    images: [
      require("../assets/mens/shirts/Checked_1_label.png"),
      require("../assets/mens/shirts/checked_2.png"),
      require("../assets/mens/shirts/checked_3.png"),
    ],
  },
  {
    id: 104, // ✅ FIX: Changed from 4 to 104
    name: "Printed Pattern Shirt",
    price: "₹1099",
    images: [
      require("../assets/mens/shirts/printed_1.png"),
      require("../assets/mens/shirts/printed_2.png"),
      require("../assets/mens/shirts/printed_3.png"),
    ],
  },
];

const Shirts = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (item) => {
    addToCart(item);
    navigate("/cart");
  };

  return (
    <div className="shirts-page">
      <h2 className="shirts-title">Men's Shirts Collection</h2>
      <div className="shirts-grid">
        {products.map((item) => (
          <div className="shirt-card" key={item.id}>
            <Carousel interval={null} indicators={false} controls={true}>
              {item.images.map((img, idx) => (
                <Carousel.Item key={idx}>
                  <img
                    src={img}
                    alt={`${item.name} ${idx}`}
                    className="shirt-image"
                  />
                </Carousel.Item>
              ))}
            </Carousel>

            <h3 className="shirt-name">{item.name}</h3>
            <p className="shirt-price">{item.price}</p>
            <button
              className="add-to-cart-btn"
              onClick={() => handleAddToCart(item)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shirts;