// firebaseConfig.ts

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCUEWrTHVehB7HnfOwKOQFRkea6ojE5i9s",
  authDomain: "expo-competition-dac9f.firebaseapp.com",
  projectId: "expo-competition-dac9f",
  storageBucket: "expo-competition-dac9f.firebasestorage.app",
  messagingSenderId: "755572065031",
  appId: "1:755572065031:web:7ae85681b0bb8084337ba2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
