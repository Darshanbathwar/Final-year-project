// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getStorage} from "firebase/storage";
import {getFirestore} from "firebase/firestore"
import {getAuth, GoogleAuthProvider} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCux9bTKN9FyVOLbETNukDwv2Q8QnhqSjk",
  authDomain: "product-page-94cad.firebaseapp.com",
  databaseURL: "https://product-page-94cad-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "product-page-94cad",
  storageBucket: "product-page-94cad.appspot.com",
  messagingSenderId: "358690562695",
  appId: "1:358690562695:web:238f513df58ffc34838e22",
  measurementId: "G-44NDCPZPXH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const imgDB = getStorage(app);
const txtdb = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export {app,auth,provider};