<<<<<<< HEAD
import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Alert,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import HeaderApp from "../components/HeaderApp"; // ⬅ IMPORTANTE

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const [mostrarPass, setMostrarPass] = useState(false);

  const login = async () => {
    if (!email || !password)
      return Alert.alert("Error", "Todos los campos son obligatorios.");

    setCargando(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
  console.log("🔥 ERROR LOGIN:", error.code, error.message);

  let mensaje = "Ocurrió un error inesperado.";

  switch (error.code) {
    case "auth/invalid-email":
      mensaje = "El correo no es válido.";
      break;

    case "auth/user-not-found":
      mensaje = "Este correo no está registrado.";
      break;

    case "auth/wrong-password":
      mensaje = "La contraseña es incorrecta.";
      break;

    // Firebase a veces usa este código para usuario inexistente O contraseña mala
    case "auth/invalid-credential":
      mensaje = "Correo o contraseña incorrectos.";
      break;

    case "auth/user-disabled":
      mensaje = "Este usuario ha sido deshabilitado.";
      break;

    case "auth/too-many-requests":
      mensaje = "Demasiados intentos, inténtelo más tarde.";
      break;
  }

  Alert.alert("Error", mensaje);
}

    setCargando(false);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* 🔵 Header visible incluso sin login */}
      <HeaderApp />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <LinearGradient
          colors={["#4c669f", "#3b5998", "#192f5d"]}
          style={styles.background}
        >
          <Text style={styles.title}>Sistema de Inventario</Text>

          <Animated.View style={styles.inputContainer}>
            <TextInput
              placeholder="Correo Electrónico"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </Animated.View>

          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Contraseña"
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!mostrarPass}
            />
            <TouchableOpacity
              onPress={() => setMostrarPass(!mostrarPass)}
              style={styles.eyeButton}
            >
              <Ionicons
                name={mostrarPass ? "eye-off-outline" : "eye-outline"}
                size={22}
                color="#555"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.boton, cargando && { opacity: 0.5 }]}
            onPress={login}
            disabled={cargando}
          >
            <Text style={styles.botonText}>
              {cargando ? "Cargando..." : "Iniciar Sesión"}
            </Text>
          </TouchableOpacity>

          {/* 🔵 CORREGIDO: nombre de ruta correcto */}
          <TouchableOpacity
            onPress={() => navigation.navigate("Registro")}
            style={styles.registerButton}
          >
            <Text style={styles.registerText}>
              ¿No estás registrado? Regístrate aquí
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </KeyboardAvoidingView>
    </View>
=======
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    console.log('=== INICIO DEBUG LOGIN ===');
    console.log('Auth object:', auth);
    console.log('Email:', email);
    console.log('Password length:', password.length);
    
    // Validaciones básicas
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Por favor ingresa un email válido');
      return;
    }

    setLoading(true);
    
    try {
      console.log('Intentando conectar con Firebase...');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Login exitoso!');
      console.log('Usuario:', userCredential.user.email);
      console.log('UID:', userCredential.user.uid);
      
      // El AuthContext debería manejar la navegación automáticamente
      
    } catch (error) {
      console.log('ERROR COMPLETO:', error);
      console.log('Código:', error.code);
      console.log('Mensaje:', error.message);
      
      let errorMessage = 'Error al iniciar sesión';
      
      // Errores específicos
      switch (error.code) {
        case 'auth/configuration-not-found':
          errorMessage = 'Error de configuración de Firebase. Verifica tu firebaseConfig.js';
          break;
        case 'auth/invalid-api-key':
          errorMessage = 'API Key de Firebase inválida';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No existe una cuenta con este email';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Contraseña incorrecta';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Email inválido';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Demasiados intentos fallidos. Intenta más tarde';
          break;
        default:
          errorMessage = `Error: ${error.message}`;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const goToRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Iniciar Sesión</Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity 
            style={[styles.loginButton, loading && styles.disabledButton]} 
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
            )}
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>¿No tienes cuenta? </Text>
            <TouchableOpacity onPress={goToRegister}>
              <Text style={styles.registerLink}>Regístrate aquí</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
>>>>>>> profesor/main
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
  container: { flex: 1 },
  background: {
    flex: 1,
    justifyContent: "center",
    padding: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#D1D1D6",
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  inputContainer: { opacity: 1 },
  passwordContainer: { position: "relative", width: "100%" },
  eyeButton: {
    position: "absolute",
    right: 15,
    top: 18,
  },
  boton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  botonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  registerButton: { marginTop: 20, alignItems: "center" },
  registerText: { color: "#fff", fontSize: 14, fontWeight: "bold" },
});
=======
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 30,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  loginButton: {
    backgroundColor: '#007AFF',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    fontSize: 16,
    color: '#666',
  },
  registerLink: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
});
>>>>>>> profesor/main
