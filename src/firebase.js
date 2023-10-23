// Imports
import { initializeApp } from "firebase/app";
import { getAuth, deleteUser, onAuthStateChanged} from "firebase/auth";
import { getDatabase, ref, get, onValue, remove , set} from 'firebase/database';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD4cu5CDEUYWYFf6lAtWX8meZWW7EMxGkU",
  authDomain: "myapp.firebaseapp.com",
  databaseURL: "https://achieveit-d8b83-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "myapp", 
  storageBucket: "myapp.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:1234567890:web:abcdefghi"
};

// Initialisation  
const app = initializeApp(firebaseConfig);

// Get Authentification instance
const auth = getAuth(app);

// Get Firestore instance
const db = getDatabase(app);
const firestore = getFirestore(app);

// export 
export {
  app,
  auth,
  db,
  firestore,
  onAuthStateChanged,
  remove,
  set,
  ref,
  get,
  onValue,
  deleteUser,
  getDoc,
};