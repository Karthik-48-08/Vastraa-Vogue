import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrdersContext";
import { useNavigate } from "react-router-dom";
import "./Account.css";

const Account = () => {
  const { user } = useAuth();
  const { orders, loading, refreshOrders } = useOrders();
  const navigate = useNavigate();
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else {
      // Refresh orders when component mounts only once
      if (initialLoad) {
        refreshOrders();
        setInitialLoad(false);
      }
    }
  }, [user, navigate, refreshOrders, initialLoad]);

  if (!user) {
    return null;
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
        
        {loading ? (
          <div className="loading-message">
            <div className="loading-spinner"></div>
            Loading your orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="no-orders-message">
            <p>You have no past orders.</p>
            <p>Start shopping to see your orders here!</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div className="order-card" key={order.orderId || order.id}>
                <div className="order-header">
                  <div>
                    <h4>Order ID: {order.orderId}</h4>
                    <p>Date: {order.date}</p>
                    <p>Payment: {order.paymentMethod}</p>
                  </div>
                  <div>
                    <span className={`status ${order.status ? order.status.toLowerCase() : 'processing'}`}>
                      {order.status || 'Processing'}
                    </span>
                  </div>
                </div>
                <div className="order-body">
                  <strong>Items:</strong>
                  <ul>
                    {/* Handle both items (frontend) and products (backend) formats */}
                    {order.items && order.items.map((item, index) => (
                      <li key={index}>
                        {item.name} (Qty: {item.quantity}) - ₹{item.price}
                      </li>
                    ))}
                    {order.products && order.products.map((product, index) => (
                      <li key={index}>
                        {product.name} (Qty: {product.quantity}) - ₹{product.price}
                      </li>
                    ))}
                    {/* Fallback if no items or products */}
                    {(!order.items || order.items.length === 0) && (!order.products || order.products.length === 0) && (
                      <li>No items found</li>
                    )}
                  </ul>
                  {order.shippingAddress && (
                    <div className="shipping-info">
                      <strong>Shipping to:</strong> 
                      {order.shippingAddress.address1}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                    </div>
                  )}
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