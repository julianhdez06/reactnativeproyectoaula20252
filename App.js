<<<<<<< HEAD
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import { AppProvider, useAppContext } from "./context/AppContext";

// 🔵 Pantallas
import LoginScreen from "./screens/LoginScreen";
import RegistroScreen from "./screens/RegistroScreen";
import ListaInventarioScreen from "./screens/ListaInventarioScreen";
import AgregarProductoScreen from "./screens/AgregarProductoScreen";
import EditarProductoScreen from "./screens/EditarProductoScreen";
import MovimientosScreen from "./screens/MovimientosScreen";

// ⬇⬇⬇ AÑADIDO
import Toast from "react-native-toast-message";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/* ---------------------------------------------------
   🧭 Navegación Principal (Stack)
--------------------------------------------------- */
function Rutas() {
  const { user, cargandoUsuario } = useAppContext();

  if (cargandoUsuario) return null;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="Home" component={HomeTabs} />
          <Stack.Screen name="AgregarProducto" component={AgregarProductoScreen} />
          <Stack.Screen name="EditarProducto" component={EditarProductoScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Registro" component={RegistroScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

/* ---------------------------------------------------
   📌 Tabs (Inventario / Movimientos)
--------------------------------------------------- */
function HomeTabs() {
  return (
    <Tab.Navigator
      initialRouteName="ListaInventario"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "ListaInventario") {
            iconName = focused ? "list" : "list-outline";
          } else if (route.name === "Movimientos") {
            iconName = focused ? "swap-horizontal" : "swap-horizontal-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="ListaInventario"
        component={ListaInventarioScreen}
        options={{ title: "Inventario" }}
      />

      <Tab.Screen
        name="Movimientos"
        component={MovimientosScreen}
        options={{ title: "Movimientos" }}
      />
    </Tab.Navigator>
  );
}

/* ---------------------------------------------------
   🚀 App Root 
--------------------------------------------------- */
export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <Rutas />
      </NavigationContainer>

      {/* ⬇⬇⬇ NECESARIO PARA QUE FUNCIONE EL TOAST ⬇⬇⬇ */}
      <Toast />
    </AppProvider>
  );
}
=======
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, useAuth } from './AuthContext';
import { OfflineProvider } from './OfflineContext'; // ⬅️ NUEVO
// Importar tus pantallas
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import DetailsScreen from './screens/DetailsScreen';
import TreeScreen from './screens/TreeScreen';
import AddPetScreen from './screens/AddPetScreen';
import EditPetScreen from './screens/EditPetScreen';
// ⬇️ NUEVAS PANTALLAS
import AppointmentScreen from './screens/AppointmentScreen';
import SpecialistsScreen from './screens/SpecialistsScreen';

const Stack = createStackNavigator();

function AppNavigator() {
  const { currentUser } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {currentUser ? (
          // Usuario autenticado - mostrar pantallas principales
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{
                title: 'Inicio',
                headerLeft: null,
                gestureEnabled: false
              }}
            />
            <Stack.Screen
              name="Details"
              component={DetailsScreen}
              options={{ title: 'Detalles' }}
            />
            <Stack.Screen
              name="Tree"
              component={TreeScreen}
              options={{ title: 'Árbol' }}
            />
            <Stack.Screen
              name="AddPet"
              component={AddPetScreen}
              options={{ title: 'Agregar Mascota' }}
            />
            <Stack.Screen
              name="EditPet"
              component={EditPetScreen}
              options={{ title: 'Editar Mascota' }}
            />
            {/* ⬇️ NUEVAS PANTALLAS */}
            <Stack.Screen
              name="Appointments"
              component={AppointmentScreen}
              options={{ title: 'Agenda de Citas' }}
            />
            <Stack.Screen
              name="Specialists"
              component={SpecialistsScreen}
              options={{ title: 'Especialistas' }}
            />
          </>
        ) : (
          // Usuario no autenticado - mostrar pantallas de auth
          <>
            <Stack.Screen
              name="Welcome"
              component={WelcomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ title: 'Iniciar Sesión' }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ title: 'Registrarse' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      {/* ⬇️ NUEVO PROVIDER PARA MODO OFFLINE */}
      <OfflineProvider>
        <AppNavigator />
      </OfflineProvider>
    </AuthProvider>
  );
}
>>>>>>> profesor/main
