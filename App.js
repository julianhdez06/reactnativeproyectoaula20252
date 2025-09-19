import 'react-native-reanimated';
import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";


// Screens
import LoginScreen from "./screens/LoginScreen";
import RegistroScreen from "./screens/RegistroScreen";
import ListaInventarioScreen from "./screens/ListaInventarioScreen";
import AgregarProductoScreen from "./screens/AgregarProductoScreen";
import EditarProductoScreen from "./screens/EditarProductoScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mantenemos el listener para saber si hay usuario.
    const unsubscribe = onAuthStateChanged(auth, (usuario) => {
      setUser(usuario);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        // 🚨 CAMBIO CLAVE: La ruta inicial es SIEMPRE "Login"
        initialRouteName={"Login"} 
        screenOptions={{
          headerStyle: { backgroundColor: "#007AFF" }, // Color Primario Moderno
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: "Iniciar Sesión" }} />
        <Stack.Screen name="Registro" component={RegistroScreen} options={{ title: "Crear Cuenta" }} />
        <Stack.Screen name="Inventario" component={ListaInventarioScreen} options={{ title: "Inventario" }} />
        <Stack.Screen name="AgregarProducto" component={AgregarProductoScreen} options={{ title: "Agregar Producto" }} />
        <Stack.Screen name="EditarProducto" component={EditarProductoScreen} options={{ title: "Editar Producto" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: '#F2F2F7' },
});