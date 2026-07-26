import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyProXOneStudentEcosystem2026",
  authDomain: "prox-one-student.firebaseapp.com",
  projectId: "prox-one-student",
  storageBucket: "prox-one-student.appspot.com",
  messagingSenderId: "847291038472",
  appId: "1:847291038472:web:9f8e7d6c5b4a3f2e1d0c"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
};
