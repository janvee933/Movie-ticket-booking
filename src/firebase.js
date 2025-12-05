import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDp7Mj5IGXNe1aHDSWMhzfIILBmPqq4ajk",
    authDomain: "movie-ticket-booking-3b11d.firebaseapp.com",
    projectId: "movie-ticket-booking-3b11d",
    storageBucket: "movie-ticket-booking-3b11d.firebasestorage.app",
    messagingSenderId: "888333248990",
    appId: "1:888333248990:web:1ae0b34095a8ee7d00154f",
    measurementId: "G-HH1G7ZZ62E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
