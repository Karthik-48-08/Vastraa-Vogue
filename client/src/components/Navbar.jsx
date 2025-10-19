import React, { useState, useEffect, useRef } from "react";
import "./Navbar.css";
import logo from "../assets/Logo.jpg";
import { Link, useNavigate } from "react-router-dom"; // ✅ Added useNavigate
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout, setShowAuthModal } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate(); // ✅ Initialize navigation

  const closeAllMenus = () => {
    setIsMenuOpen(false);
    setShowDropdown(false);
  };

  const handleLoginClick = () => {
    setShowAuthModal(true);
    closeAllMenus();
  };

  const handleLogoutClick = async () => {
    await logout(); // Wait for logout to complete
    closeAllMenus();
    navigate("/"); // ✅ Redirect to homepage
  };

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" onClick={closeAllMenus}>
          <img src={logo} alt="Logo" className="navbar-logo" />
        </Link>
        <h2 className="navbar-title">Vastraa Vogue</h2>
      </div>

      <ul className={isMenuOpen ? "navbar-links active" : "navbar-links"}>
        <li><Link to="/" onClick={closeAllMenus}>Home</Link></li>
        <li><Link to="/mens" onClick={closeAllMenus}>Men</Link></li>
        <li><Link to="/womens" onClick={closeAllMenus}>Women</Link></li>
        <li><Link to="/about" onClick={closeAllMenus}>About</Link></li>
        <li><Link to="/contact" onClick={closeAllMenus}>Contact</Link></li>
      </ul>

      <div className="navbar-right">
        <Link to="/cart" className="cart-link" onClick={closeAllMenus}>
          <img src="/cart icon.png" alt="Cart" className="cart-icon" />
        </Link>

        {user ? (
          <div className="user-menu" ref={dropdownRef}>
            <button
              className="user-menu-trigger"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              My Account
            </button>
            <ul className={showDropdown ? "dropdown-menu active" : "dropdown-menu"}>
              <li>
                <Link to="/account" onClick={closeAllMenus}>View Account & Orders</Link>
              </li>
              <li>
                <button onClick={handleLogoutClick}>Logout</button>
              </li>
            </ul>
          </div>
        ) : (
          <button className="login-btn" onClick={handleLoginClick}>Login</button>
        )}

        <div
          className={isMenuOpen ? "hamburger active" : "hamburger"}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <div className="line line1"></div>
          <div className="line line2"></div>
          <div className="line line3"></div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
