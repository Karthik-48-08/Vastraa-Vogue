import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <h3>Contact Info</h3>
          <p>Email: support@vastraavogue.com</p>
          <p>Phone: +91 9876543210</p>
        </div>
        <div>
          <h3>Collections</h3>
          <p>Men's Collection</p>
          <p>Women's Collection</p>
        </div>
        <div>
          <h3>Support</h3>
          <p>FAQ</p>
          <p>Returns</p>
        </div>
        <div>
          <h3>Services</h3>
          <p>Custom Fitting</p>
          <p>Secure Payment</p>
        </div>
      </div>
      <p className="footer-bottom">© 2025 Vastraa Vogue</p>
    </footer>
  );
}
