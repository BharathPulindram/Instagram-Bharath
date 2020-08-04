import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyC_rM8q4OXZJc0UoOhRZE3WJJAyohe89xM",
  authDomain: "instagram-bharath.firebaseapp.com",
  databaseURL: "https://instagram-bharath.firebaseio.com",
  projectId: "instagram-bharath",
  storageBucket: "instagram-bharath.appspot.com",
  messagingSenderId: "405716514492",
  appId: "1:405716514492:web:87e1f506e04786b9cd42b9",
  measurementId: "G-DQ0G1XKN7K",
});

const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const storage = firebaseApp.storage();

export { db, auth, storage };
