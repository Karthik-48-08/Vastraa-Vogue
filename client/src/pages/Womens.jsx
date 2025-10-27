import React from "react";
import { Link } from "react-router-dom";
import "./Womens.css";
import BackArrow from "../components/BackArrow";

export default function Womens() {
  return (
    <div className="womens-page">
      <BackArrow />
      <h1 className="womens-title">Women's Collection</h1>
      <p className="womens-subtitle">Choose a category to explore</p>

      <div className="womens-grid">
        <Link to="/womens/kurtis" className="womens-card womens-card-img1">
          <div className="womens-card-overlay">
            <h2>Kurtis & Kurtas</h2>
            <p>Stylish & Versatile</p>
          </div>
        </Link>

        <Link to="/womens/salwarsuits" className="womens-card womens-card-img2">
          <div className="womens-card-overlay">
            <h2>Salwar Suits</h2>
            <p>Traditional Grace</p>
          </div>
        </Link>

        <Link to="/womens/lehengas" className="womens-card womens-card-img3">
          <div className="womens-card-overlay">
            <h2>Lehengas</h2>
            <p>Festive & Bridal Wear</p>
          </div>
        </Link>
      </div>
    </div>
  );
}