import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// const firebaseConfig = {
//     apiKey: "AIzaSyA17xzRJusR26qtfl0N-4XSgax0Pe19TS4",
//     authDomain: "react-app-cde40.firebaseapp.com",
//     projectId: "react-app-cde40",
//     storageBucket: "react-app-cde40.appspot.com",
//     messagingSenderId: "948904744584",
//     appId: "1:948904744584:web:0ce0596388a75b5f7a313d",
//     measurementId: "G-3LF2V7DCDD"
//   };

const firebaseConfig = {
  apiKey: "AIzaSyDhIYiRjT5bGzzlzPgfTIWZC6O557dORwo",
  authDomain: "user-db-9bd20.firebaseapp.com",
  projectId: "user-db-9bd20",
  storageBucket: "user-db-9bd20.appspot.com",
  messagingSenderId: "683126346057",
  appId: "1:683126346057:web:c7be9316c9011f2d7c0a98"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export const db = getFirestore(app);
