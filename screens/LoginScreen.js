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
  );
}

const styles = StyleSheet.create({
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
