import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  initializeAuth, 
  getReactNativePersistence 
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBWHfZhQGVw8uzYj7jifBZ_whlPh0wyRtk",
  authDomain: "proyecto-bfbf0.firebaseapp.com",
  projectId: "proyecto-bfbf0",
  storageBucket: "proyecto-bfbf0.appspot.com",
  messagingSenderId: "408699981802",
  appId: "1:408699981802:web:7c9232959815a709a0ec93"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let auth;
try {
  auth = getAuth(app);
} catch (e) {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

export const firebaseApp = app;

export { auth };
export const db = getFirestore(app);
export default app;