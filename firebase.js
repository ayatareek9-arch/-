// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDpzYcfuGDg28dnSh-6EKSTgS3q0gMB9CA",
  authDomain: "shaidwarbah.firebaseapp.com",
  projectId: "shaidwarbah",
  storageBucket: "shaidwarbah.firebasestorage.app",
  messagingSenderId: "547128797093",
  appId: "1:547128797093:web:f4d861c845b0da79526a4c",
  measurementId: "G-PMDBK3GMF0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
