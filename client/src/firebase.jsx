import { initializeApp } from "firebase/app";
// ✅ Import the function to get the authentication service
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD5YADCy3xfTLUrZq8hcLNqEVMpIsw6eyI",
  authDomain: "vastraa-vogue.firebaseapp.com",
  projectId: "vastraa-vogue",
  storageBucket: "vastraa-vogue.appspot.com", // Corrected storage bucket domain
  messagingSenderId: "663264327281",
  appId: "1:663264327281:web:b6fa5a37024f28a8258dd0",
  measurementId: "G-QXNSR0PCL2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Initialize Firebase Authentication and export it for use in other files
export const auth = getAuth(app);