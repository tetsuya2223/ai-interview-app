import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBUe2Zg9vem49JXHCMEYy9hWZ1zY0kcEPM",
  authDomain: "ai-interview-project-5e220.firebaseapp.com",
  projectId: "ai-interview-project-5e220",
  storageBucket: "gs://ai-interview-project-5e220.firebasestorage.app",
  messagingSenderId: "169615757608",
  appId: "1:169615757608:web:0eb74efba9e5154ba7401d",
  measurementId: "G-JKD6RNY83Y",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export const storage = getStorage(app);
