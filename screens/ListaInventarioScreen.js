import React, { useState, useCallback } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, Image, StyleSheet, Alert, ActivityIndicator } from "react-native";
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
    useCallback(() => {
      cargarProductos();
    }, [cargarProductos])
  );

  const eliminarProducto = async (id) => {
    Alert.alert("Confirmar Eliminación", "¿Estás seguro de que deseas eliminar este producto?", [
      { text: "Cancelar", style: "cancel" },
      { 
        text: "Eliminar", 
        style: "destructive", 
        onPress: async () => {
          try {
            // 🚨 OPTIMIZACIÓN: Elimina el producto del estado local (instantáneo)
            setProductos(currentProductos => currentProductos.filter(p => p.id !== id));
            
            // Ejecuta la eliminación en la base de datos
            await deleteDoc(doc(db, "productos", id));
            
            Alert.alert("Éxito", "Producto eliminado con éxito."); 
            
          } catch (error) {
            // Si Firebase falla, recargamos la lista para que el producto regrese
            Alert.alert("Error", "No se pudo eliminar el producto. La lista se ha actualizado.");
            cargarProductos(); 
          }
        }
      }
    ]);
  };

  const logout = async () => {
    try { 
      await signOut(auth); 
      // Reiniciamos la navegación al Login
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } 
    catch (error) { 
      Alert.alert("Error", error.message); 
    }
  };

  const filtrarProductos = productos.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.codigo.toLowerCase().includes(busqueda.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <View style={styles.productoContainer}>
      <Image
        // Asegúrate de que esta ruta sea válida o maneja el caso nulo.
        source={item.foto ? { uri: item.foto } : require('../assets/no-image.png')}
        style={styles.imagen}
      />
      <View style={styles.info}>
        <Text style={styles.nombre}>{item.nombre}</Text>
        <Text style={styles.detalle}>Código: {item.codigo}</Text>
        <Text style={styles.cantidad}>Cantidad: {item.cantidad}</Text>
        
        <View style={styles.botones}>
          <TouchableOpacity
            style={[styles.buttonSmall, { backgroundColor: "#007AFF" }]}
            onPress={() => navigation.navigate("EditarProducto", { producto: item })}
          >
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.buttonSmall, { backgroundColor: "#FF3B30" }]}
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
        <TextInput
          placeholder="Buscar por nombre o código"
          style={styles.inputBusqueda}
          value={busqueda}
          onChangeText={setBusqueda}
        />
        <TouchableOpacity style={styles.btnAgregar} onPress={() => navigation.navigate("AgregarProducto")}>
          <Text style={styles.btnAgregarText}>+</Text>
        </TouchableOpacity>
      </View>
      
      {cargando ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={filtrarProductos}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          ListEmptyComponent={() => <Text style={styles.listaVacia}>No hay productos en el inventario.</Text>}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
      
      <TouchableOpacity style={styles.btnCerrar} onPress={logout}>
        <Text style={styles.buttonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#F2F2F7' },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
  inputBusqueda: { 
    flex: 1,
    backgroundColor: '#fff', 
    borderWidth: 1, 
    borderColor: "#D1D1D6", 
    padding: 12, 
    borderRadius: 10, 
    fontSize: 16,
    marginRight: 10
  },
  btnAgregar: {
    backgroundColor: "#34C759", // Verde para Agregar
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  btnAgregarText: { color: "#fff", fontWeight: "bold", fontSize: 24 },
  btnCerrar: { 
    backgroundColor: "#E67E22", 
    padding: 12, 
    borderRadius: 10, 
    alignItems: "center", 
    marginTop: 10 
  },
  
  productoContainer: { 
    flexDirection: "row", 
    backgroundColor: 'white', 
    borderRadius: 12, 
    marginVertical: 8, 
    padding: 10, 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, 
  },
  imagen: { 
    width: 80, 
    height: 80, 
    borderRadius: 8,
    marginRight: 15 
  },
  info: { flex: 1, justifyContent: 'center' },
  nombre: { fontWeight: "bold", fontSize: 17, marginBottom: 4, color: '#333' },
  detalle: { fontSize: 14, color: '#666' },
  cantidad: { fontSize: 14, color: '#666', fontWeight: 'bold' },
  botones: { flexDirection: "row", marginTop: 8 },
  buttonSmall: { 
    flex: 1, 
    padding: 8, 
    borderRadius: 8, 
    alignItems: "center", 
    marginRight: 10 
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  listaVacia: { textAlign: "center", marginTop: 50, fontSize: 16, color: '#666' },
});