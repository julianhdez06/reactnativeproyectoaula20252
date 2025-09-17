import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  initializeAuth, 
  getReactNativePersistence 
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBWHfZhQGVw8uzYj7jifBZ_whlPh0wyRtk",
  authDomain: "proyecto-bfbf0.firebaseapp.com",
  projectId: "proyecto-bfbf0",
  storageBucket: "proyecto-bfbf0.appspot.com",
  messagingSenderId: "408699981802",
  appId: "1:408699981802:web:7c9232959815a709a0ec93"
};

// 1. Inicializar la App de Firebase (Evita duplicados)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// 2. Inicializar Auth con persistencia (Evita el error 'already-initialized')
let auth;
try {
  // Intenta obtener la instancia existente
  auth = getAuth(app);
} catch (e) {
  // Si no existe, inicialízala
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

// Exportamos las constantes
export { auth };
export const db = getFirestore(app);
export default app;