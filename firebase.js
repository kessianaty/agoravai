import { initializeApp } from "firebase/app";
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBKebrX2g3QnEdN7PQVfRRvImrw94oRAvg",
  authDomain: "corsa2-0.firebaseapp.com",
  projectId: "corsa2-0",
  storageBucket: "corsa2-0.appspot.com",
  messagingSenderId: "730680290395",
  appId: "1:730680290395:web:5a4b57bed1089bcfe2237e"
};

const app = initializeApp(firebaseConfig);


export default app;

