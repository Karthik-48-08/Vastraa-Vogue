import React from "react";
import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ProductPage.css"; // Individual CSS
import BackArrow from "../components/BackArrow";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

// --- Make sure these image paths are correct ---
import bridal1 from "../assets/womens/lehengas/Bridal-1a.png";
import bridal2 from "../assets/womens/lehengas/Bridal-1b.png";
import bridal3 from "../assets/womens/lehengas/Bridal-1c.png";
import party1 from "../assets/womens/lehengas/Partywear-1a.png";
import party2 from "../assets/womens/lehengas/Partywear-1b.png";
import party3 from "../assets/womens/lehengas/Partywear-1c.png";
// -----------------------------------------------

const products = [
  {
    id: 701,
    name: "Red Bridal Lehenga",
    price: "₹8999",
    images: [bridal1, bridal2, bridal3],
  },
  {
    id: 702,
    name: "Sequin Party Wear Lehenga",
    price: "₹5999",
    images: [party1, party2, party3],
  },
];

export default function Lehengas() {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    addToCart(product);
    navigate("/cart");
  };

  return (
    <div className="lehengas-page">
      <BackArrow />
      <h2 className="lehengas-title">Lehengas</h2>
      <div className="lehengas-grid">
        {products.map((item) => (
          <div className="lehengas-card" key={item.id}>
            <Carousel interval={null} indicators={false} controls={true}>
              {item.images.map((img, idx) => (
                <Carousel.Item key={idx}>
                  <img src={img} alt={`${item.name} ${idx}`} className="lehengas-image" />
                </Carousel.Item>
              ))}
            </Carousel>
            <h3 className="lehengas-name">{item.name}</h3>
            <p className="lehengas-price">{item.price}</p>
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