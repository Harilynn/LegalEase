// Firebase Configuration - Modern v9+ SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCciCYiT1BCdDfzwL5mfLlHkfS07PcPKHU",
  authDomain: "legal-ease-12fa8.firebaseapp.com",
  projectId: "legal-ease-12fa8",
  storageBucket: "legal-ease-12fa8.firebasestorage.app",
  messagingSenderId: "498087536058",
  appId: "1:498087536058:web:dd8597226f6f9732852983",
  measurementId: "G-3ZJRLHB8KG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

console.log("🔥 Firebase initialized successfully!");

// Export for use in other modules
export { auth, db, storage };