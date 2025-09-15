import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity, ScrollView, Text } from "react-native";
import { doc, updateDoc } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import { db } from "../firebaseConfig";

export default function EditarProductoScreen({ route, navigation }) {
  const { producto } = route.params;
  const [nombre, setNombre] = useState(producto.nombre);
  const [codigo, setCodigo] = useState(producto.codigo);
  const [cantidad, setCantidad] = useState(producto.cantidad.toString());
  const [foto, setFoto] = useState(producto.foto || null);

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

  const guardarCambios = async () => {
    if (!nombre || !codigo || !cantidad) return Alert.alert("Error", "Todos los campos son obligatorios");
    try {
      const docRef = doc(db, "productos", producto.id);
      await updateDoc(docRef, {
        nombre,
        codigo,
        cantidad: parseInt(cantidad, 10),
        foto
      });
      Alert.alert("Éxito", "Producto actualizado");
      navigation.goBack(); // Lista se recarga automáticamente
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

      <Button title="Guardar Cambios" onPress={guardarCambios} color="#2E86AB" />
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
