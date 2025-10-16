import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Cart.css";

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  // ✅ THE FIX IS HERE: Get 'user' from the context, not 'isAuthenticated'
  const { user, setShowAuthModal } = useAuth(); 
  const navigate = useNavigate();

  const getTotal = () =>
    cartItems.reduce(
      (sum, item) =>
        sum + parseInt(item.price.replace("₹", "")) * item.quantity,
      0
    );

  const handleProceedToBuy = () => {
    // ✅ AND HERE: Check if the 'user' object exists
    if (!user) {
      // This is correct for a logged-out user
      setShowAuthModal(true); 
    } else {
      // This will now work correctly for a logged-in user
      navigate("/checkout"); 
    }
  };

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="cart-list">
            {cartItems.map((item) => (
              <li key={item.id} className="cart-item">
                <img src={item.images[0]} alt={item.name} className="cart-img" />
                <div className="cart-details">
                  <h4>{item.name}</h4>
                  <p>Price: {item.price}</p>
                  <div className="cart-actions">
                    <label>Qty:</label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.id, parseInt(e.target.value))
                      }
                      className="qty-input"
                    />
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="remove-btn"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="cart-summary">
            <h3>Total: ₹{getTotal()}</h3>
            <button className="buy-btn" onClick={handleProceedToBuy}>
              Proceed to Buy
            </button>
          </div>
        </>
      )}
    </div>
  );
}
