import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: "divvy-e1582.firebaseapp.com",
  projectId: "divvy-e1582",
  storageBucket: "divvy-e1582.appspot.com",
  messagingSenderId: "456431211738",
  appId: "1:456431211738:web:24fd9e053ecffdfd6e41e3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize adn export Firestore
export const db = getFirestore();

// Initialize and export Auth
export const auth = getAuth(app);