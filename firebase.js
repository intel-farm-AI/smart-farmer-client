// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCNSp3XxxqjwRTnY0R4sKajpA9JYAl4rv8",
  authDomain: "agrify-client.firebaseapp.com",
  projectId: "agrify-client",
  storageBucket: "agrify-client.firebasestorage.app",
  messagingSenderId: "1010306042044",
  appId: "1:1010306042044:web:2993576afed614c0d528b9",
  measurementId: "G-T72WPD8FML"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);