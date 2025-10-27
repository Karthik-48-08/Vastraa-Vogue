import React from "react";
import { Link } from "react-router-dom";
import "./Mens.css";

export default function Mens() {
  return (
    <div className="mens-page">
      <h1 className="mens-title">Men's Collection</h1>
      <p className="mens-subtitle">Choose a category to explore</p>

      <div className="mens-grid">
        <Link to="/mens/shirts" className="mens-card mens-card-shirt">
          <div className="mens-card-overlay">
            <h2>Shirts</h2>
            <p>Formal, Casual & More</p>
          </div>
        </Link>

        <Link to="/mens/trousers" className="mens-card mens-card-trousers">
          <div className="mens-card-overlay">
            <h2>Trousers</h2>
            <p>Comfort & Style</p>
          </div>
        </Link>

        <Link to="/mens/kurtas" className="mens-card mens-card-kurtas">
          <div className="mens-card-overlay">
            <h2>Kurtas</h2>
            <p>Ethnic Wear</p>
          </div>
        </Link>

        <Link to="/mens/suits" className="mens-card mens-card-suits">
          <div className="mens-card-overlay">
            <h2>Suits</h2>
            <p>Elegant & Classic</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
