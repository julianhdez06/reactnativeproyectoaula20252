import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity, ScrollView, Text } from "react-native";
import { collection, addDoc } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import { db } from "../firebaseConfig";

export default function AgregarProductoScreen({ navigation }) {
  const [nombre, setNombre] = useState("");
  const [codigo, setCodigo] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [foto, setFoto] = useState(null);

  const seleccionarFoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      quality: 0.3,
      allowsEditing: true,
    });
    if (!result.canceled && result.assets.length > 0) {
      setFoto(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const guardarProducto = async () => {
    if (!nombre || !codigo || !cantidad) return Alert.alert("Error", "Todos los campos son obligatorios");
    try {
      await addDoc(collection(db, "productos"), {
        nombre,
        codigo,
        cantidad: parseInt(cantidad, 10),
        foto
      });
      Alert.alert("Éxito", "Producto agregado");
      navigation.goBack(); // Lista se recarga automáticamente con useFocusEffect
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput placeholder="Nombre" style={styles.input} value={nombre} onChangeText={setNombre} />
      <TextInput placeholder="Código" style={styles.input} value={codigo} onChangeText={setCodigo} />
      <TextInput placeholder="Cantidad" style={styles.input} value={cantidad} onChangeText={setCantidad} keyboardType="numeric" />

      <TouchableOpacity style={styles.button} onPress={seleccionarFoto}>
        <Text style={styles.buttonText}>{foto ? "Cambiar Foto" : "Seleccionar Foto"}</Text>
      </TouchableOpacity>

      {foto && <Image source={{ uri: foto }} style={styles.imagen} />}

      <Button title="Guardar Producto" onPress={guardarProducto} color="#2E86AB" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 10 },
  button: { backgroundColor: "#2E86AB", padding: 10, borderRadius: 8, alignItems: "center", marginBottom: 10 },
  buttonText: { color: "#fff", fontWeight: "bold" },
  imagen: { width: 150, height: 150, marginBottom: 10, alignSelf: "center", borderRadius: 8 },
});
