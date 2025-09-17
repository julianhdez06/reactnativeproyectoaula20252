import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Alert, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);

  const login = async () => {
    if (!email || !password) return Alert.alert("Error", "Todos los campos son obligatorios");
    setCargando(true); // <--- INICIAR CARGA

    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      // 🚨 NAVEGACIÓN CORREGIDA: Borra el historial y va al Inventario
      navigation.reset({
        index: 0,
        routes: [{ name: 'Inventario' }],
      });
      
    } catch (error) {
      Alert.alert("Error", "Credenciales incorrectas o usuario no encontrado.");
      setCargando(false); // <--- DETENER CARGA solo si hay un ERROR
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Text style={styles.title}>Sistema de Inventario</Text>
      <TextInput 
        placeholder="Correo Electrónico" 
        style={styles.input} 
        value={email} 
        onChangeText={setEmail} 
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput 
        placeholder="Contraseña" 
        style={styles.input} 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry 
      />
      <Button 
        title={cargando ? "Cargando..." : "Iniciar Sesión"} 
        onPress={login} 
        color="#007AFF" // Color Primario
        disabled={cargando} // <--- DESHABILITAR MIENTRAS CARGA
      />
      <TouchableOpacity onPress={() => navigation.navigate("Registro")}>
        <Text style={styles.link}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 30, backgroundColor: '#F2F2F7' },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 40, textAlign: "center", color: '#007AFF' },
  input: { 
    backgroundColor: '#fff', 
    borderWidth: 1, 
    borderColor: "#D1D1D6", 
    padding: 15, 
    borderRadius: 10, 
    marginBottom: 15, 
    fontSize: 16 
  },
  link: { color: "#007AFF", marginTop: 20, textAlign: "center", fontSize: 16 },
});