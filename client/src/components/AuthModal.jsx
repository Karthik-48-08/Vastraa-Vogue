import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import ForgotPassword from "./ForgotPassword";
import "./AuthModal.css";

const AuthModal = () => {
  const { showAuthModal, setShowAuthModal, login, signup, signInWithGoogle } = useAuth();
  const [isLogin, setIsLogin] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [formData, setFormData] = useState({});

  if (!showAuthModal) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      login(formData);
    } else {
      const fullMobile = `+91${formData.mobileOnly || ''}`;
      signup({ ...formData, mobile: fullMobile });
    }
  };

  if (isForgotPassword) {
    return (
      <div className="auth-backdrop" onClick={() => setShowAuthModal(false)}>
        <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
          <button className="close-btn" onClick={() => setShowAuthModal(false)}>✖</button>
          <button className="back-btn" onClick={() => setIsForgotPassword(false)}>← Back to Login</button>
          <ForgotPassword onClose={() => setShowAuthModal(false)} />
        </div>
      </div>
    );
  };

  return (
    <div className="auth-backdrop" onClick={() => setShowAuthModal(false)}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={() => setShowAuthModal(false)}>✖</button>
        
        <button className="google-signin-btn" onClick={signInWithGoogle}>
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google icon" />
          Continue with Google
        </button>

        <div className="divider">
          <span>OR</span>
        </div>

        <div className="auth-tabs">
          <button className={isLogin ? "active" : ""} onClick={() => setIsLogin(true)}>Login</button>
          <button className={!isLogin ? "active" : ""} onClick={() => setIsLogin(false)}>Sign Up</button>
        </div>

        <form onSubmit={handleSubmit}>
          {isLogin ? (
            <>
              <input type="text" placeholder="Email or Phone Number" onChange={(e) => setFormData({ ...formData, loginIdentifier: e.target.value })} required />
              <input type="password" placeholder="Password" onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
              <button
                type="button"
                className="forgot-password-link"
                onClick={(e) => {
                  e.preventDefault();
                  setIsForgotPassword(true);
                }}
              >
                Forgot Password?
              </button>
            </>
          ) : (
            <>
              <input type="text" placeholder="First Name" onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} required />
              <input type="text" placeholder="Last Name" onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} required />
              <div className="input-group">
                <span className="country-code">+91</span>
                <input type="tel" placeholder="Mobile Number" pattern="[0-9]{10}" title="Please enter a 10-digit mobile number" onChange={(e) => setFormData({ ...formData, mobileOnly: e.target.value })} required />
              </div>
              <input type="email" placeholder="Email" onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
              <input type="password" placeholder="Password" onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
            </>
          )}
          <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;