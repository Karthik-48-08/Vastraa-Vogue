import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrdersContext"; // Import useOrders
import { useNavigate } from "react-router-dom";
import "./Account.css";

const Account = () => {
  const { user } = useAuth();
  const { orders } = useOrders(); // Get live orders from context
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user) {
    return null; // Don't render anything if not logged in
  }

  return (
    <div className="account-page">
      <h1>My Account</h1>

      <div className="account-details-card">
        <h3>Account Information</h3>
        <div className="details-grid">
          <div className="detail-item">
            <strong>First Name:</strong> {user.firstName || "Vastraa"}
          </div>
          <div className="detail-item">
            <strong>Last Name:</strong> {user.lastName || "Customer"}
          </div>
          <div className="detail-item">
            <strong>Email:</strong> {user.email}
          </div>
          <div className="detail-item">
            <strong>Mobile:</strong> {user.mobile || "Not Provided"}
          </div>
        </div>
      </div>

      <div className="orders-section">
        <h2>My Orders</h2>
        {/* Now uses the live 'orders' array from context */}
        {orders.length === 0 ? (
          <p>You have no past orders.</p>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div className="order-card" key={order.orderId}>
                <div className="order-header">
                  <div>
                    <h4>Order ID: {order.orderId}</h4>
                    <p>Date: {order.date}</p>
                  </div>
                  <div>
                    <span className={`status ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
                <div className="order-body">
                  <strong>Items:</strong>
                  <ul>
                    {order.items.map((item, index) => (
                      <li key={index}>{item.name} (Qty: {item.quantity})</li>
                    ))}
                  </ul>
                </div>
                <div className="order-footer">
                  <strong>Total: ₹{order.total}</strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;