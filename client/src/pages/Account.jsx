import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrdersContext";
import { useNavigate } from "react-router-dom";
import "./Account.css";

const TrackingStatus = ({ product }) => {
  const steps = ['Stitching', 'Stitched', 'Out for Delivery', 'Delivered'];
  const currentStepIndex = steps.indexOf(product.trackingStatus);

  return (
    <div className="tracking-status">
      <div className="tracking-steps">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isActive = index === currentStepIndex;
          
          return (
            <div key={step} className="tracking-step">
              <div className={`step-dot ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`} />
              <div className={`step-label ${isActive ? 'active' : ''}`}>{step}</div>
              {index < steps.length - 1 && (
                <div className={`step-connector ${isCompleted ? 'completed' : ''}`} />
              )}
              {isActive && (
                <div className="tracking-timestamp">
                  {new Date(product.statusUpdatedAt).toLocaleString()}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

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
                  <div className="order-items">
                    {/* Handle both items (frontend) and products (backend) formats */}
                    {(order.items || order.products || []).map((item, index) => (
                      <div key={index} className="order-item">
                        <div className="item-details">
                          <div className="item-image">
                            <img 
                              src={item.images ? item.images[0] : item.image} 
                              alt={item.name}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'placeholder-image.jpg';
                              }}
                            />
                          </div>
                          <div className="item-info">
                            <h4>{item.name}</h4>
                            <p>Quantity: {item.quantity}</p>
                            <p>Price: ₹{item.price}</p>
                          </div>
                        </div>
                        {item.trackingStatus && <TrackingStatus product={item} />}
                      </div>
                    ))}
                    {(!order.items || order.items.length === 0) && (!order.products || order.products.length === 0) && (
                      <div className="no-items">No items found</div>
                    )}
                  </div>
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