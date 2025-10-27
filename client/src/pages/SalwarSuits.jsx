import React from "react";
import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ProductPage.css"; // Use the common CSS
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext"; // Import useAuth
import { useNavigate } from "react-router-dom";

import anarkali1 from "../assets/womens/salwarsuits/salwar-1a.png";
import anarkali2 from "../assets/womens/salwarsuits/salwar-1b.png";
import anarkali3 from "../assets/womens/salwarsuits/salwar-1c.png";
import straight1 from "../assets/womens/salwarsuits/salwar-2a.png";
import straight2 from "../assets/womens/salwarsuits/salwar-2b.png";
import straight3 from "../assets/womens/salwarsuits/salwar-2c.png";

const products = [
  {
    id: 601,
    name: "Embroidered Anarkali Suit",
    price: "₹2499",
    images: [anarkali1, anarkali2, anarkali3],
  },
  {
    id: 602,
    name: "Straight Cut Palazzo Suit",
    price: "₹1899",
    images: [straight1, straight2, straight3],
  },
];

export default function SalwarSuits() {
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
    <div className="salwarsuits-page">
      <h2 className="salwarsuits-title">Salwar Suits</h2>
      <div className="salwarsuits-grid">
        {products.map((item) => (
          <div className="salwarsuits-card" key={item.id}>
            <Carousel interval={null} indicators={false} controls={true}>
              {item.images.map((img, idx) => (
                <Carousel.Item key={idx}>
                  <img src={img} alt={`${item.name} ${idx}`} className="salwarsuits-image" />
                </Carousel.Item>
              ))}
            </Carousel>
            <h3 className="salwarsuits-name">{item.name}</h3>
            <p className="salwarsuits-price">{item.price}</p>
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