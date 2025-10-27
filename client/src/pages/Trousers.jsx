import React from "react";
import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ProductPage.css"; // Use the common CSS
import BackArrow from "../components/BackArrow";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext"; // Import useAuth
import { useNavigate } from "react-router-dom";

const products = [
  {
    id: 201,
    name: "Chinos",
    price: "₹1299",
    images: [
      require("../assets/mens/trousers/black_1.png"),
      require("../assets/mens/trousers/black_2.png"),
      require("../assets/mens/trousers/Formal-Trousers-Black.jpg"),
    ],
  },
  {
    id: 202,
    name: "Formal Pants",
    price: "₹1499",
    images: [
      require("../assets/mens/trousers/grey_1.png"),
      require("../assets/mens/trousers/grey_2.png"),
      require("../assets/mens/trousers/Formal-Trousers-Grey.jpg"),
    ],
  },
];

export default function Trousers() {
  const { addToCart } = useCart();
  const { user, promptLogin } = useAuth(); // Get user and promptLogin
  const navigate = useNavigate();

  const handleAddToCart = (item) => {
    if (user) {
      addToCart(item);
      navigate("/cart");
    } else {
      promptLogin(() => {
        addToCart(item);
        navigate("/cart");
      });
    }
  };

  return (
    <div className="trousers-page">
      <BackArrow />
      <h2 className="trousers-title">Men's Trousers Collection</h2>
      <div className="trousers-grid">
        {products.map((item) => (
          <div key={item.id} className="trouser-card">
            <Carousel interval={null} indicators={false} controls={true}>
              {item.images.map((img, index) => (
                <Carousel.Item key={index}>
                  <img src={img} alt={`${item.name}-${index}`} className="trousers-img" />
                </Carousel.Item>
              ))}
            </Carousel>
            <h3 className="trousers-name">{item.name}</h3>
            <p className="trousers-price">{item.price}</p>
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
}