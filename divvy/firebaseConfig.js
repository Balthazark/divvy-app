// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAr2tmM4vG7QAAtpnwC45E29H5FWk4cF3k",
  authDomain: "divvy-e1582.firebaseapp.com",
  projectId: "divvy-e1582",
  storageBucket: "divvy-e1582.appspot.com",
  messagingSenderId: "456431211738",
  appId: "1:456431211738:web:24fd9e053ecffdfd6e41e3",
};


//TODO, add auth:

// Initialize Firestore
export const db = getFirestore();

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

