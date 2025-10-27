import React from "react";
import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ProductPage.css"; // Individual CSS
import BackArrow from "../components/BackArrow";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

// --- Replace with your actual kurti images ---
import dailyKurti1 from "../assets/womens/kurtis/kurti-1a.png";
import dailyKurti2 from "../assets/womens/kurtis/kurti-1b.png";
import dailyKurti3 from "../assets/womens/kurtis/kurti-1c.png";
import printedKurti1 from "../assets/womens/kurtis/kurti-2a.png";
import printedKurti2 from "../assets/womens/kurtis/kurti-2b.png";
import printedKurti3 from "../assets/womens/kurtis/kurti-2c.png";
// ---------------------------------------------

const products = [
  {
    id: 501,
    name: "Daily Wear Cotton Kurti",
    price: "₹799",
    images: [dailyKurti1, dailyKurti2, dailyKurti3],
  },
  {
    id: 502,
    name: "Floral Printed Kurti",
    price: "₹999",
    images: [printedKurti1, printedKurti2, printedKurti3],
  },
];

export default function Kurtis() {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    addToCart(product);
    navigate("/cart");
  };

  return (
    <div className="kurtis-page">
      <BackArrow />
      <h2 className="kurtis-title">Kurtis & Kurtas</h2>
      <div className="kurtis-grid">
        {products.map((item) => (
          <div className="kurtis-card" key={item.id}>
            <Carousel interval={null} indicators={false} controls={true}>
              {item.images.map((img, idx) => (
                <Carousel.Item key={idx}>
                  <img src={img} alt={`${item.name} ${idx}`} className="kurtis-image" />
                </Carousel.Item>
              ))}
            </Carousel>
            <h3 className="kurtis-name">{item.name}</h3>
            <p className="kurtis-price">{item.price}</p>
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
