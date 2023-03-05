// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDDHv9wlh3qDcenElZlNP488bO1R5cj5JY",
  authDomain: "taskmaster-298ca.firebaseapp.com",
  projectId: "taskmaster-298ca",
  storageBucket: "taskmaster-298ca.appspot.com",
  messagingSenderId: "537557674704",
  appId: "1:537557674704:web:b534abd1a45392040a8cd5",
  measurementId: "G-QWJNFL264V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()

export const db = getFirestore(app)