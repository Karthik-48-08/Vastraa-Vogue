import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('vastraa-user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [postLoginAction, setPostLoginAction] = useState(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem('vastraa-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('vastraa-user');
    }
  }, [user]);

  // Register Google user with backend
  const registerGoogleWithBackend = async (firebaseUser) => {
    try {
      console.log('🔐 Registering Google user with backend...');
      
      const response = await fetch('http://localhost:5000/api/auth/google-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          firstName: firebaseUser.displayName?.split(' ')[0] || 'User',
          lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Backend Google auth failed:', errorData);
        throw new Error(errorData.message || 'Failed to authenticate with backend');
      }

      const data = await response.json();
      console.log('✅ Backend Google auth successful:', data);
      return data;
    } catch (error) {
      console.error('Backend Google auth error:', error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      
      // Register with backend and get JWT token
      const backendResponse = await registerGoogleWithBackend(firebaseUser);

      const appUser = {
        id: backendResponse.user.id,
        firstName: backendResponse.user.firstName,
        lastName: backendResponse.user.lastName,
        email: backendResponse.user.email,
        token: backendResponse.token, // JWT token from your backend
      };

      setUser(appUser);
      setShowAuthModal(false);

      if (postLoginAction) {
        postLoginAction();
        setPostLoginAction(null);
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      alert("Failed to sign in. Please try again.");
    }
  };

  const login = async (userData) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          loginIdentifier: userData.loginIdentifier,
          password: userData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      
      const loggedInUser = {
        id: data.user.id,
        email: data.user.email,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        token: data.token,
      };

      setUser(loggedInUser); 
      setShowAuthModal(false);
      
      if (postLoginAction) {
        postLoginAction();
        setPostLoginAction(null);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert(error.message || 'Login failed. Please check your credentials.');
    }
  };

  const signup = async (userData) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          mobile: userData.mobile,
          password: userData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      
      const newUser = {
        id: data.user.id,
        email: data.user.email,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        token: data.token,
      };

      setUser(newUser);
      setShowAuthModal(false);

      if (postLoginAction) {
        postLoginAction();
        setPostLoginAction(null);
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert(error.message || 'Registration failed. Please try again.');
    }
  };

  const logout = () => {
    signOut(auth);
    setUser(null);
  };
  
  const promptLogin = (action) => {
    setPostLoginAction(() => action);
    setShowAuthModal(true);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, signInWithGoogle, showAuthModal, setShowAuthModal, promptLogin }}>
      {children}
    </AuthContext.Provider>
  );
};