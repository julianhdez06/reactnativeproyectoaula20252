// cambio mínimo para habilitar el Pull Request
import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Alert, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

export default function RegistroScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);

  const register = async () => {
    if (!email || !password) return Alert.alert("Error", "Todos los campos son obligatorios");
    setCargando(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Éxito", "Usuario creado correctamente. Inicia sesión.");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Text style={styles.title}>Crear Cuenta</Text>
      <TextInput 
        placeholder="Correo Electrónico" 
        style={styles.input} 
        value={email} 
        onChangeText={setEmail} 
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput 
        placeholder="Contraseña (mín. 6 caracteres)" 
        style={styles.input} 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry 
      />
      <Button 
        title={cargando ? "Registrando..." : "Registrar"} 
        onPress={register} 
        color="#007AFF" // Color Primario
        disabled={cargando}
      />
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
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