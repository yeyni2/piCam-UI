import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import * as firebaseui from "firebaseui";

const firebaseConfig = {
  apiKey: "AIzaSyBXUWw3Gq_dkVA--i_fFMdedZO_2rydg-g",
  authDomain: "makoorwako.firebaseapp.com",
  databaseURL: "https://makoorwako-default-rtdb.firebaseio.com",
  projectId: "makoorwako",
  storageBucket: "makoorwako.appspot.com",
  messagingSenderId: "81460336352",
  appId: "1:81460336352:web:f46c81187521fa783fe285",
  measurementId: "G-S17ZK87BXT",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

const uiConfig = {
  signInSuccessUrl: "/",
  signInOptions: [
    "google.com", // Or use 'firebase.auth.GoogleAuthProvider.PROVIDER_ID'
  ],
  signInFlow: "popup",
};

const ui = new firebaseui.auth.AuthUI(auth);

export { auth, database, ui, uiConfig };
