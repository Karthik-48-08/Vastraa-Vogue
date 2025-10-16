import React from "react";
import { Link } from "react-router-dom";
import "./Womens.css";

export default function Womens() {
  return (
    <div className="womens-page">
      <h1 className="womens-title">Women's Collection</h1>
      <p className="womens-subtitle">Choose a category to explore</p>

      <div className="womens-grid">
        <Link to="/womens/kurtis" className="womens-card">
          <h2>Kurtis & Kurtas</h2>
          <p>Stylish & Versatile</p>
        </Link>

        <Link to="/womens/salwarsuits" className="womens-card">
          <h2>Salwar Suits</h2>
          <p>Traditional Grace</p>
        </Link>

        <Link to="/womens/lehengas" className="womens-card">
          <h2>Lehengas</h2>
          <p>Festive & Bridal Wear</p>
        </Link>
      </div>
    </div>
  );
}