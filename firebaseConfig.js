<<<<<<< HEAD
// firebaseConfig.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";  // Cambiar getAuth por initializeAuth
import AsyncStorage from "@react-native-async-storage/async-storage";  // Importar AsyncStorage
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// 🔵 Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBWHfZhQGVw8uzYj7jifBZ_whlPh0wyRtk",
  authDomain: "proyecto-bfbf0.firebaseapp.com",
  projectId: "proyecto-bfbf0",
  storageBucket: "proyecto-bfbf0.appspot.com",
  messagingSenderId: "408699981802",
  appId: "1:408699981802:web:7c9232959815a709a0ec93"
};

// 🔵 Inicializar Firebase solo 1 vez
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// 🔴 Inicializar Firebase Auth con persistencia usando AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)  // Usar persistencia con AsyncStorage
});

// 🔵 Firestore
const db = getFirestore(app);

// 🔵 Storage (con la correcta inicialización de app)
const storage = getStorage(app);

export { app as firebaseApp, auth, db, storage };
export default app;
=======
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAHd0a1mEBrpMyXylM0eLLbbiGwwuSqpEY",
  authDomain: "vetapp-3720c.firebaseapp.com",
  projectId: "vetapp-3720c",
  storageBucket: "vetapp-3720c.firebasestorage.app",
  messagingSenderId: "260297994785",
  appId: "1:260297994785:web:c8328c8f9424e7f4e02960"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export { auth };

export default app;
>>>>>>> profesor/main
