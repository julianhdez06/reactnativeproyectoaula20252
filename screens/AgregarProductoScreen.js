import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity, ScrollView, Text, ActivityIndicator } from "react-native";
import { collection, addDoc } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import { db } from "../firebaseConfig";

export default function AgregarProductoScreen({ navigation }) {
  const [nombre, setNombre] = useState("");
  const [codigo, setCodigo] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [foto, setFoto] = useState(null);
  // Mantener cargando como un estado local, aunque ya no bloqueará la navegación
  const [cargando, setCargando] = useState(false); 

  const handleSelectPicture = async (useCamera) => {
    const permissionResult = useCamera 
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permiso Denegado", "Necesitas conceder permiso para acceder a la galería o la cámara.");
      return;
    }
    
    const pickerOptions = {
      base64: true,
      quality: 0.3,
      allowsEditing: true,
    };
    
    let result;
    if (useCamera) {
      result = await ImagePicker.launchCameraAsync(pickerOptions);
    } else {
      result = await ImagePicker.launchImageLibraryAsync(pickerOptions);
    }

    if (!result.canceled && result.assets.length > 0) {
      setFoto(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const guardarProducto = async () => {
    if (!nombre || !codigo || !cantidad) {
      return Alert.alert("Error", "Todos los campos (Nombre, Código, Cantidad) son obligatorios.");
    }
    
    // 🚨 PASO 1: NAVEGACIÓN INSTANTÁNEA
    navigation.goBack(); 
    
    // El estado de carga solo es relevante para deshabilitar el botón antes de la navegación.
    setCargando(true);

    try {
      // PASO 2: Ejecutar la operación de Firebase en segundo plano (sin await)
      addDoc(collection(db, "productos"), {
        nombre,
        codigo,
        cantidad: parseInt(cantidad, 10),
        foto
      })
      .catch((error) => console.error("Error al agregar producto en background:", error));

    } catch (error) {
      // El error solo se mostraría si la operación falla antes de la navegación.
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput 
        placeholder="Nombre del Producto" 
        style={styles.input} 
        value={nombre} 
        onChangeText={setNombre} 
      />
      <TextInput 
        placeholder="Código Único" 
        style={styles.input} 
        value={codigo} 
        onChangeText={setCodigo} 
      />
      <TextInput 
        placeholder="Cantidad en Inventario" 
        style={styles.input} 
        value={cantidad} 
        onChangeText={setCantidad} 
        keyboardType="numeric" 
      />

      <Text style={styles.label}>Foto del Producto:</Text>
      <View style={styles.buttonGroup}>
        <TouchableOpacity style={[styles.photoButton, { marginRight: 10 }]} onPress={() => handleSelectPicture(false)}>
          <Text style={styles.buttonText}>Galería</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.photoButton} onPress={() => handleSelectPicture(true)}>
          <Text style={styles.buttonText}>Tomar Foto</Text>
        </TouchableOpacity>
      </View>

      {foto && <Image source={{ uri: foto }} style={styles.imagen} />}

      <Button 
        title={cargando ? "Guardando..." : "Guardar Producto"} 
        onPress={guardarProducto} 
        color="#34C759" 
        disabled={cargando}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#F2F2F7', flexGrow: 1 },
  label: { fontSize: 16, marginBottom: 8, color: '#333', fontWeight: '500' },
  input: { 
    backgroundColor: '#fff', 
    borderWidth: 1, 
    borderColor: "#D1D1D6", 
    padding: 15, 
    borderRadius: 10, 
    marginBottom: 15, 
    fontSize: 16 
  },
  buttonGroup: { flexDirection: 'row', marginBottom: 20 },
  photoButton: { flex: 1, backgroundColor: "#007AFF", padding: 12, borderRadius: 10, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  imagen: { 
    width: 150, 
    height: 150, 
    marginBottom: 25, 
    alignSelf: "center", 
    borderRadius: 10, 
    borderWidth: 1, 
    borderColor: '#D1D1D6' 
  },
});