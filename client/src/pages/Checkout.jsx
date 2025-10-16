import { useState } from "react"; // 'React' import is not needed
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrdersContext";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

// Helper function to get the correct measurement fields for a product
const getMeasurementFields = (productId) => {
  const id = Number(productId);
  if (id >= 100 && id < 200) { return ["Chest", "Waist", "Sleeve Length", "Shoulder", "Shirt Length"]; }
  if (id >= 200 && id < 300) { return ["Waist", "Hip", "Thigh", "Knee", "Trouser Length"]; }
  if (id >= 500 && id < 600) { return ["Bust", "Waist", "Hip", "Sleeve Length", "Shoulder", "Kurti Length"]; }
  if (id >= 600 && id < 700) { return ["Bust", "Waist", "Hip", "Sleeve Length", "Shoulder", "Kameez Length", "Salwar Length"]; }
  if (id >= 700 && id < 800) { return ["Bust", "Under Bust", "Waist", "Hip", "Blouse Length", "Lehenga Length"]; }
  return [];
};

// --- Mock Payment UI Components ---
const UpiPayment = () => ( <div className="payment-details upi-details"><p>Scan the QR code with your UPI app</p><div className="qr-code"></div><p>or pay to</p><p className="upi-id">vastraavogue@exampleupi</p></div> );
const CardPayment = () => ( <div className="payment-details card-form"><div className="form-group"><label>Card Number</label><input type="text" placeholder="XXXX XXXX XXXX XXXX" /></div><div className="card-details-grid"><div className="form-group"><label>Expiry (MM/YY)</label><input type="text" placeholder="MM/YY" /></div><div className="form-group"><label>CVV</label><input type="text" placeholder="XXX" /></div></div></div> );
const CodInfo = () => ( <div className="payment-details cod-info"><p>You can pay in cash to our delivery agent upon receiving your order.</p></div> );

// --- Main Checkout Component ---
const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const { addOrder } = useOrders();
  const navigate = useNavigate();
  
  const [measurementsData, setMeasurementsData] = useState({});
  const [addressData, setAddressData] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleMeasurementChange = (productId, field, value) => {
    setMeasurementsData(prev => ({ ...prev, [productId]: { ...prev[productId], [field]: value } }));
  };
  
  const handleFileChange = (productId, file) => {
    setMeasurementsData(prev => ({ ...prev, [productId]: { ...prev[productId], designFile: file } }));
  };

  const handleAddressChange = (field, value) => {
      setAddressData(prev => ({ ...prev, [field]: value }));
  };

  const handlePayNow = () => {
    if (!addressData.address1 || !addressData.pincode || !addressData.contact) {
        alert("Please fill in all required address fields.");
        return;
    }
    
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      
      const newOrder = {
          items: cartItems,
          shippingAddress: addressData,
          measurements: measurementsData,
          paymentMethod,
          status: "Processing",
          total: cartItems.reduce((sum, item) => sum + parseInt(item.price.replace("₹", "")) * item.quantity, 0),
      };

      addOrder(newOrder);
      
      clearCart();
      alert("Thank you! Your custom order has been placed successfully.");
      navigate("/account");
    }, 2000);
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page empty-cart">
        <h2>Your cart is empty.</h2>
        <button onClick={() => navigate("/")} className="shop-now-btn">Shop Now</button>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1>Checkout & Measurements</h1>
      
      <div className="measurement-section">
        {cartItems.map(item => (
          <div className="measurement-card" key={item.id}>
            <div className="product-summary">
              <img src={item.images[0]} alt={item.name} className="product-image" />
              <div className="product-info">
                <h3>{item.name}</h3>
                <p>Quantity: {item.quantity}</p>
              </div>
            </div>
            <h4>Measurements (in inches)</h4>
            <div className="measurements-grid">
              {getMeasurementFields(item.id).map(field => (
                <div className="form-group" key={field}>
                  <label>{field}</label>
                  <input type="number" placeholder="e.g., 36.5" onChange={(e) => handleMeasurementChange(item.id, field, e.target.value)} required />
                </div>
              ))}
            </div>
            <h4>Customization (Optional)</h4>
            <div className="form-group">
              <label>Upload Design File</label>
              <input type="file" className="file-input" onChange={(e) => handleFileChange(item.id, e.target.files[0])} />
            </div>
            <div className="form-group">
              <label>Special Instructions</label>
              <textarea rows="3" placeholder="e.g., 'Add a hidden pocket...'" onChange={(e) => handleMeasurementChange(item.id, 'instructions', e.target.value)}></textarea>
            </div>
          </div>
        ))}
      </div>

      <div className="address-section">
        <h2>Shipping Address</h2>
        <div className="address-grid">
          <div className="form-group full-width">
            <label>Address Line 1</label>
            <input type="text" onChange={e => handleAddressChange('address1', e.target.value)} required />
          </div>
          <div className="form-group full-width">
            <label>Address Line 2 (Optional)</label>
            <input type="text" onChange={e => handleAddressChange('address2', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Landmark</label>
            <input type="text" onChange={e => handleAddressChange('landmark', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Pincode</label>
            <input type="text" pattern="\d{6}" title="Enter a 6-digit Indian pincode" onChange={e => handleAddressChange('pincode', e.target.value)} required />
          </div>
          <div className="form-group">
            <label>State</label>
            <input type="text" onChange={e => handleAddressChange('state', e.target.value)} required />
          </div>
          <div className="form-group full-width">
            <label>Contact No.</label>
            <input type="tel" pattern="[0-9]{10}" title="Enter a 10-digit mobile number" onChange={e => handleAddressChange('contact', e.target.value)} required />
          </div>
        </div>
      </div>

      <div className="payment-section">
        <h2>Payment Method</h2>
        <div className="payment-options">
          <div className={`payment-option ${paymentMethod === 'UPI' ? 'selected' : ''}`} onClick={() => setPaymentMethod('UPI')}>UPI / QR Code</div>
          <div className={`payment-option ${paymentMethod === 'CreditCard' ? 'selected' : ''}`} onClick={() => setPaymentMethod('CreditCard')}>Credit / Debit Card</div>
          <div className={`payment-option ${paymentMethod === 'COD' ? 'selected' : ''}`} onClick={() => setPaymentMethod('COD')}>Cash on Delivery</div>
        </div>
        
        {paymentMethod === 'UPI' && <UpiPayment />}
        {paymentMethod === 'CreditCard' && <CardPayment />}
        {paymentMethod === 'COD' && <CodInfo />}
        
        <button className="pay-now-btn" onClick={handlePayNow} disabled={isProcessing}>
          {isProcessing ? <div className="spinner"></div> : 'Place Order & Pay'}
        </button>
      </div>
    </div>
  );
};

export default Checkout;