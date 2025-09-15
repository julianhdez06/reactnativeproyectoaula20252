import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Alert, Text, TouchableOpacity } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

export default function RegistroScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    if (!email || !password) return Alert.alert("Error", "Todos los campos son obligatorios");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Éxito", "Usuario creado correctamente");
      // No se necesita navigation.reset, App.js detectará el cambio
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Cuenta</Text>
      <TextInput placeholder="Correo" style={styles.input} value={email} onChangeText={setEmail} />
      <TextInput placeholder="Contraseña" style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Registrar" onPress={register} color="#2E86AB" />
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 8, marginBottom: 10 },
  link: { color: "#2E86AB", marginTop: 10, textAlign: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
});
