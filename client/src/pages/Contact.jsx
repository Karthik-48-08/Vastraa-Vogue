import React, { useState } from "react";
import "./Contact.css";

// Reusable modal component
const InfoModal = ({ title, children, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export default function Contact() {
  const [showFAQ, setShowFAQ] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);

  return (
    <div className="contact-page">
      <div className="contact-cards">
        <div className="contact-card">
          <h3>Email Us</h3>
          <p>
            For inquiries, support, and feedback. We’ll get back to you within
            24 hours.
          </p>
          <p className="highlight">support@vastraavogue.com</p>
        </div>

        <div className="contact-card">
          <h3>Call Us</h3>
          <p>Speak to our customer service team for immediate assistance.</p>
          <p className="highlight">+91 987 654 3210</p>
        </div>

        <div className="contact-card">
          <h3>FAQ</h3>
          <p>
            Find answers to common questions about orders, shipping, and
            services.
          </p>
          <button onClick={() => setShowFAQ(true)}>Visit FAQ Page</button>
        </div>

        <div className="contact-card">
          <h3>Returns & Support</h3>
          <p>
            Read our policy on returns and get help with any order-related
            issues.
          </p>
          <button onClick={() => setShowPolicy(true)}>View Policy</button>
        </div>
      </div>

      {/* --- Popup Modals --- */}
      {showFAQ && (
        <InfoModal title="Frequently Asked Questions" onClose={() => setShowFAQ(false)}>
          <p><strong>How do I provide my measurements?</strong></p>
          <p>
            Once you proceed to the checkout page, a detailed measurement form
            will be displayed for each custom item in your cart.
          </p>
          <p><strong>How long does shipping take?</strong></p>
          <p>
            Since each garment is custom-stitched, please allow 7–10 business
            days for craftsmanship, plus 3–5 days for shipping.
          </p>
        </InfoModal>
      )}

      {showPolicy && (
        <InfoModal title="Returns & Support Policy" onClose={() => setShowPolicy(false)}>
          <p>
            You can return items within 7 days of receiving them if they are
            unused and in original condition.
          </p>
          <p>
            For damaged items, please contact our support team immediately.
          </p>
        </InfoModal>
      )}

      {/* --- Contact Form Section --- */}
      <div className="contact-form">
        <h2>Send Us a Message</h2>
        <form>
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <textarea placeholder="Your Message" rows="5" required></textarea>
          <button type="submit">Send Message</button>
        </form>
      </div>
    </div>
  );
}
