import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAuu9XatsNaezT7PmgAcVx24ZDLxymrHZs",
    authDomain: "invoice-generator-52e5e.firebaseapp.com",
    projectId: "invoice-generator-52e5e",
    storageBucket: "invoice-generator-52e5e.firebasestorage.app",
    messagingSenderId: "629321061333",
    appId: "1:629321061333:web:724298520463efd33f235c",
    measurementId: "G-2D2YX3LXR4"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export {auth, provider, signInWithPopup, signOut};