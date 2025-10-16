import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // ✅ When the app starts, try to get the user from localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('vastraa-user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [postLoginAction, setPostLoginAction] = useState(null);

  // ✅ This effect runs whenever the 'user' state changes
  useEffect(() => {
    if (user) {
      // If a user is logged in, save their data to localStorage
      localStorage.setItem('vastraa-user', JSON.stringify(user));
    } else {
      // If the user logs out, remove their data from localStorage
      localStorage.removeItem('vastraa-user');
    }
  }, [user]);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const googleUser = result.user;
      
      const appUser = {
        firstName: googleUser.displayName.split(' ')[0],
        lastName: googleUser.displayName.split(' ').slice(1).join(' '),
        email: googleUser.email,
      };

      setUser(appUser); // This will trigger the useEffect to save the user
      setShowAuthModal(false);

      if (postLoginAction) {
        postLoginAction();
        setPostLoginAction(null);
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  const login = (userData) => {
    const loggedInUser = {
      email: userData.loginIdentifier.includes('@') ? userData.loginIdentifier : null,
      ...userData
    };
    setUser(loggedInUser); 
    setShowAuthModal(false);
    
    if (postLoginAction) {
      postLoginAction();
      setPostLoginAction(null);
    }
  };

  const signup = (userData) => {
    setUser(userData);
    setShowAuthModal(false);

    if (postLoginAction) {
        postLoginAction();
        setPostLoginAction(null);
    }
  };

  const logout = () => {
    signOut(auth);
    setUser(null); // This will trigger the useEffect to clear the user from localStorage
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