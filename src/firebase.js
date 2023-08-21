// Imports
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD4cu5CDEUYWYFf6lAtWX8meZWW7EMxGkU",
  authDomain: "myapp.firebaseapp.com",
  projectId: "myapp", 
  storageBucket: "myapp.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:1234567890:web:abcdefghi"
};

// Initialisation  
const app = initializeApp(firebaseConfig);

// Get Authentification instance
const auth = getAuth(app);

// export 
export {
  app,
  auth,
};