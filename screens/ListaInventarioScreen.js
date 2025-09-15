import React, { useState, useCallback } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from "react-native";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useFocusEffect } from "@react-navigation/native";
import { db, auth } from "../firebaseConfig";

export default function ListaInventarioScreen({ navigation }) {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(false);

  const cargarProductos = useCallback(async () => {
    setCargando(true);
    try {
      const snapshot = await getDocs(collection(db, "productos"));
      const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProductos(lista);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
    setCargando(false);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      cargarProductos();
    }, [cargarProductos])
  );

  const eliminarProducto = async (id) => {
    Alert.alert("Confirmar", "¿Deseas eliminar este producto?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: async () => {
        try {
          await deleteDoc(doc(db, "productos", id));
          cargarProductos();
        } catch (error) {
          Alert.alert("Error", error.message);
        }
      }}
    ]);
  };

  const logout = async () => {
    try { await signOut(auth); } 
    catch (error) { Alert.alert("Error", error.message); }
  };

  const filtrarProductos = productos.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.codigo.toLowerCase().includes(busqueda.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <View style={styles.productoContainer}>
      <Image
        source={item.foto ? { uri: item.foto } : require('../assets/no-image.png')}
        style={styles.imagen}
      />
      <View style={styles.info}>
        <Text style={styles.nombre}>{item.nombre}</Text>
        <Text>Código: {item.codigo}</Text>
        <Text>Cantidad: {item.cantidad}</Text>
        <View style={styles.botones}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#2E86AB" }]}
            onPress={() => navigation.navigate("EditarProducto", { producto: item })}
          >
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#E74C3C" }]}
            onPress={() => eliminarProducto(item.id)}
          >
            <Text style={styles.buttonText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.btnAgregar} onPress={() => navigation.navigate("AgregarProducto")}>
          <Text style={styles.buttonText}>Agregar Producto</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnCerrar} onPress={logout}>
          <Text style={styles.buttonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        placeholder="Buscar por nombre o código"
        style={styles.input}
        value={busqueda}
        onChangeText={setBusqueda}
      />

      {cargando ? (
        <Text style={{ textAlign: "center", marginTop: 20 }}>Cargando...</Text>
      ) : (
        <FlatList
          data={filtrarProductos}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  btnAgregar: { flex: 1, backgroundColor: "#27AE60", padding: 10, borderRadius: 8, alignItems: "center", marginRight: 5 },
  btnCerrar: { flex: 1, backgroundColor: "#E67E22", padding: 10, borderRadius: 8, alignItems: "center", marginLeft: 5 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 10 },
  productoContainer: { flexDirection: "row", borderWidth: 1, borderColor: "#ccc", borderRadius: 8, marginVertical: 5, overflow: "hidden" },
  imagen: { width: 100, height: 100 },
  info: { flex: 1, padding: 10 },
  nombre: { fontWeight: "bold", fontSize: 16, marginBottom: 5 },
  botones: { flexDirection: "row", marginTop: 10, justifyContent: "space-between" },
  button: { flex: 1, padding: 5, borderRadius: 5, alignItems: "center", marginHorizontal: 5 },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
