import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrdersContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Checkout.css";

const getMeasurementFields = (productId) => {
  const id = Number(productId);
  if (id >= 100 && id < 200) return ["Chest", "Waist", "Sleeve Length", "Shoulder", "Shirt Length"];
  if (id >= 200 && id < 300) return ["Waist", "Hip", "Thigh", "Knee", "Trouser Length"];
  if (id >= 500 && id < 600) return ["Bust", "Waist", "Hip", "Sleeve Length", "Shoulder", "Kurti Length"];
  if (id >= 600 && id < 700) return ["Bust", "Waist", "Hip", "Sleeve Length", "Shoulder", "Kameez Length", "Salwar Length"];
  if (id >= 700 && id < 800) return ["Bust", "Under Bust", "Waist", "Hip", "Blouse Length", "Lehenga Length"];
  return [];
};

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

const UpiPayment = () => (
  <div className="payment-details upi-details">
    <p>Scan the QR code with your UPI app</p>
    <div className="qr-code"></div>
    <p>or pay to</p>
    <p className="upi-id">vastraavogue@exampleupi</p>
  </div>
);

const CardPayment = () => (
  <div className="payment-details card-form">
    <div className="form-group">
      <label>Card Number</label>
      <input type="text" placeholder="XXXX XXXX XXXX XXXX" />
    </div>
    <div className="card-details-grid">
      <div className="form-group">
        <label>Expiry (MM/YY)</label>
        <input type="text" placeholder="MM/YY" />
      </div>
      <div className="form-group">
        <label>CVV</label>
        <input type="text" placeholder="XXX" />
      </div>
    </div>
  </div>
);

const CodInfo = () => (
  <div className="payment-details cod-info">
    <p>You can pay in cash to our delivery agent upon receiving your order.</p>
  </div>
);

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const { addOrder, refreshOrders } = useOrders();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [measurementsData, setMeasurementsData] = useState({});
  const [addressData, setAddressData] = useState({});
  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [isProcessing, setIsProcessing] = useState(false);
  const [backendError, setBackendError] = useState("");
  // Proof of payment upload (for UPI / Card)
  const [proofFile, setProofFile] = useState(null);
  const [proofDataUrl, setProofDataUrl] = useState(null);

  useEffect(() => {
    if (!user) {
      alert("Please log in to proceed to checkout.");
      navigate("/");
    }
  }, [user, navigate]);

  const validateField = (field, value) => {
    let error = "";
    switch (field) {
      case "address1":
        if (!/^[A-Za-z0-9\s,./#-]{10,100}$/.test(value))
          error = "Enter a valid address (10–100 characters).";
        break;
      case "address2":
        if (value && !/^[A-Za-z0-9\s,./#-]{0,100}$/.test(value))
          error = "Invalid address line 2.";
        break;
      case "landmark":
        if (value && !/^[A-Za-z0-9\s,./#-]{10,100}$/.test(value))
          error = "Enter a valid landmark (min 10 characters).";
        break;
      case "pincode":
        if (!/^[1-9][0-9]{5}$/.test(value))
          error = "Enter a valid 6-digit Indian Pincode.";
        break;
      case "state":
        if (!value) error = "Please select your state.";
        break;
      case "contact":
        if (!/^(?:(?:\+91[-\s]?)|0)?[6-9]\d{9}$/.test(value))
          error = "Enter a valid 10-digit Indian mobile number.";
        break;
      default:
        break;
    }
    return error;
  };

  const handleAddressChange = (field, value) => {
    const error = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: error }));
    setAddressData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMeasurementChange = (productId, field, value) => {
    setMeasurementsData((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], [field]: value },
    }));
  };

  const handleFileChange = (productId, file) => {
    setMeasurementsData((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], designFile: file },
    }));
  };

  // Helper to convert a File to a data URL (base64)
  const readFileAsDataURL = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });

  // Handle upload of proof of payment (screenshot/image)
  const handleProofUpload = async (file) => {
    if (!file) {
      setProofFile(null);
      setProofDataUrl(null);
      return;
    }
    setProofFile(file);
    try {
      const dataUrl = await readFileAsDataURL(file);
      setProofDataUrl(dataUrl);
    } catch (err) {
      console.error("Failed to read proof file", err);
      setBackendError("Failed to read proof file. Please try another image.");
    }
  };

  const handlePayNow = async () => {
    const requiredFields = ["address1", "pincode", "state", "contact"];
    for (const field of requiredFields) {
      const error = validateField(field, addressData[field] || "");
      if (error) {
        setErrors((prev) => ({ ...prev, [field]: error }));
        alert("Please correct address details before proceeding.");
        return;
      }
    }

    setIsProcessing(true);
    setBackendError("");

    try {
      // Serialize measurements: convert any designFile (File) to dataURL
      const serializedMeasurements = {};
      for (const pid of Object.keys(measurementsData || {})) {
        const entry = { ...(measurementsData[pid] || {}) };
        if (entry.designFile && entry.designFile instanceof File) {
          try {
            const dataUrl = await readFileAsDataURL(entry.designFile);
            entry.designFile = { filename: entry.designFile.name, dataUrl };
          } catch (err) {
            console.error('Failed to read measurement design file for', pid, err);
            // leave designFile as null so server won't receive invalid data
            delete entry.designFile;
          }
        }
        serializedMeasurements[pid] = entry;
      }

      const orderData = {
        products: cartItems.map((item) => ({
          productId: item.id,
          name: item.name,
          price: parseInt(item.price.replace("₹", "")),
          quantity: item.quantity,
          images: item.images,
        })),
        shippingAddress: addressData,
        measurements: serializedMeasurements,
        totalAmount: cartItems.reduce(
          (sum, item) =>
            sum + parseInt(item.price.replace("₹", "")) * item.quantity,
          0
        ),
        paymentMethod,
      };

      // attach proof of payment if provided (base64 data URL)
      if (proofDataUrl) {
        orderData.proof = {
          filename: proofFile?.name || null,
          dataUrl: proofDataUrl,
        };
      }

      const token = user.token;

      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to place order");
      }

      const result = await response.json();

      const newOrder = {
        id: result.order._id || Date.now(),
        items: cartItems,
        shippingAddress: addressData,
        measurements: measurementsData,
        paymentMethod,
        status: "Processing",
        total: orderData.totalAmount,
        orderDate: new Date().toISOString(),
      };

      addOrder(newOrder);
      refreshOrders();
      clearCart();
      alert("Thank you! Your custom order has been placed successfully.");
      navigate("/account");
    } catch (error) {
      console.error("Order placement error:", error);
      setBackendError(error.message);
      alert(`Failed to place order: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page empty-cart">
        <h2>Your cart is empty.</h2>
        <button onClick={() => navigate("/")} className="shop-now-btn">
          Shop Now
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1>Checkout & Measurements</h1>

      {backendError && (
        <div className="backend-error">
          <p>⚠️ {backendError}</p>
        </div>
      )}

      <div className="measurement-section">
        {cartItems.map((item) => (
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
              {getMeasurementFields(item.id).map((field) => (
                <div className="form-group" key={field}>
                  <label>{field}</label>
                  <input
                    type="number"
                    placeholder="e.g., 36.5"
                    onChange={(e) =>
                      handleMeasurementChange(item.id, field, e.target.value)
                    }
                    required
                  />
                </div>
              ))}
            </div>
            <h4>Customization (Optional)</h4>
            <div className="form-group">
              <label>Upload Design File</label>
              <input
                type="file"
                className="file-input"
                onChange={(e) => handleFileChange(item.id, e.target.files[0])}
              />
            </div>
            <div className="form-group">
              <label>Special Instructions</label>
              <textarea
                rows="3"
                placeholder="e.g., 'Add a hidden pocket...'"
                onChange={(e) =>
                  handleMeasurementChange(item.id, "instructions", e.target.value)
                }
              ></textarea>
            </div>
          </div>
        ))}
      </div>

      <div className="address-section">
        <h2>Shipping Address</h2>
        <div className="address-grid">
          <div className="form-group full-width">
            <label>Address Line 1</label>
            <input
              type="text"
              onChange={(e) => handleAddressChange("address1", e.target.value)}
              required
            />
            {errors.address1 && <p className="error">{errors.address1}</p>}
          </div>
          <div className="form-group full-width">
            <label>Address Line 2 (Optional)</label>
            <input
              type="text"
              onChange={(e) => handleAddressChange("address2", e.target.value)}
            />
            {errors.address2 && <p className="error">{errors.address2}</p>}
          </div>
          <div className="form-group">
            <label>Landmark</label>
            <input
              type="text"
              onChange={(e) => handleAddressChange("landmark", e.target.value)}
            />
            {errors.landmark && <p className="error">{errors.landmark}</p>}
          </div>
          <div className="form-group">
            <label>Pincode</label>
            <input
              type="text"
              onChange={(e) => handleAddressChange("pincode", e.target.value)}
              required
            />
            {errors.pincode && <p className="error">{errors.pincode}</p>}
          </div>
          <div className="form-group">
            <label>State</label>
            <select
              onChange={(e) => handleAddressChange("state", e.target.value)}
              required
            >
              <option value="">Select State</option>
              {indianStates.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            {errors.state && <p className="error">{errors.state}</p>}
          </div>
          <div className="form-group full-width">
            <label>Contact No.</label>
            <input
              type="tel"
              onChange={(e) => handleAddressChange("contact", e.target.value)}
              required
            />
            {errors.contact && <p className="error">{errors.contact}</p>}
          </div>
        </div>
      </div>

      <div className="payment-section">
        <h2>Payment Method</h2>
        <div className="payment-options">
          <div
            className={`payment-option ${
              paymentMethod === "UPI" ? "selected" : ""
            }`}
            onClick={() => setPaymentMethod("UPI")}
          >
            UPI / QR Code
          </div>
          <div
            className={`payment-option ${
              paymentMethod === "CreditCard" ? "selected" : ""
            }`}
            onClick={() => setPaymentMethod("CreditCard")}
          >
            Credit / Debit Card
          </div>
          <div
            className={`payment-option ${
              paymentMethod === "COD" ? "selected" : ""
            }`}
            onClick={() => setPaymentMethod("COD")}
          >
            Cash on Delivery
          </div>
        </div>

        {paymentMethod === "UPI" && <UpiPayment />}
        {paymentMethod === "CreditCard" && <CardPayment />}
        {paymentMethod === "COD" && <CodInfo />}

        {(paymentMethod === "UPI" || paymentMethod === "CreditCard") && (
          <div className="proof-upload">
            <label>Upload proof of payment (screenshot)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleProofUpload(e.target.files[0])}
            />
            {proofFile && <p className="proof-filename">{proofFile.name}</p>}
            {proofDataUrl && (
              <img
                src={proofDataUrl}
                alt="proof preview"
                style={{ maxWidth: "200px", marginTop: "10px", borderRadius: 6 }}
              />
            )}
          </div>
        )}

        <button
          className="pay-now-btn"
          onClick={handlePayNow}
          disabled={isProcessing}
        >
          {isProcessing ? <div className="spinner"></div> : "Place Order & Pay"}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
