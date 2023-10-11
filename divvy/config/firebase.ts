import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, initializeAuth ,getReactNativePersistence} from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';




const firebaseConfig = {
  apiKey: "AIzaSyAr2tmM4vG7QAAtpnwC45E29H5FWk4cF3k",
  authDomain: "divvy-e1582.firebaseapp.com",
  projectId: "divvy-e1582",
  storageBucket: "divvy-e1582.appspot.com",
  messagingSenderId: "456431211738",
  appId: "1:456431211738:web:24fd9e053ecffdfd6e41e3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize adn export Firestore
export const db = getFirestore(app);

// Initialize and export Auth
ReactNativeAsyncStorage
export const auth = initializeAuth(app,{persistence: getReactNativePersistence(ReactNativeAsyncStorage)});