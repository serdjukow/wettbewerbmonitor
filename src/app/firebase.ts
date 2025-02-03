import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyAbIJdmcL26Xm-_6VIVJ7m1YTss3lL0D8k",
  authDomain: "auth-next-js-bd6df.firebaseapp.com",
  projectId: "auth-next-js-bd6df",
  storageBucket: "auth-next-js-bd6df.firebasestorage.app",
  messagingSenderId: "664230655946",
  appId: "1:664230655946:web:c35f6e5dc2dba5d4a5c133"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);