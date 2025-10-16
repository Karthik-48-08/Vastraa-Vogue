import { Link } from "react-router-dom";
import "./Categories.css";
import mensImg from "../assets/mens-wardrobe-1.jpeg";   // adjust names as per your files
import womensImg from "../assets/women-wardrobe-2.jpeg";

export default function Categories() {
  return (
    <section id="categories" className="categories">
      <h2>Shop by Category</h2>
      <div className="category-grid">
        <Link
          to="/mens"
          className="category-card"
          style={{ backgroundImage: `url(${mensImg})` }}
        >
          <div className="overlay">
            <h3>Men's Collection</h3>
            <p>From sharp business suits to casual elegant wear.</p>
            <button>Explore Collection →</button>
          </div>
        </Link>

        <Link
          to="/womens"
          className="category-card"
          style={{ backgroundImage: `url(${womensImg})` }}
        >
          <div className="overlay">
            <h3>Women's Collection</h3>
            <p>Blend traditional craftsmanship with modern fashion.</p>
            <button>Explore Collection →</button>
          </div>
        </Link>
      </div>
    </section>
  );
}
