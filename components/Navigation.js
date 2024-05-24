import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, useTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { Path } from "react-native-svg";
import { useUserContext } from "../context/UserProvider";
import { auth } from "../firebaseConfig";
import { useAsyncStorage } from "../hooks/useAsyncStorage";
import AddTransactionScreen from "../screens/AddTransactionScreen";
import AuthScreen from "../screens/AuthScreen";
import OptionsScreen from "../screens/OptionsScreen";
import OverviewScreen from "../screens/OverviewScreen";
import TransactionsScreen from "../screens/TransactionsScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import { themes } from "../util/theme";
import TabBarIcon from "./TabBarIcon";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

/**
 * * Navigator
 * Al ser montado, loguea automáticamente al usuario con los datos del AsyncStorage
 */
export default function Navigation() {
  // Contexto del estado de usuario
  const userState = useUserContext();
  // Obtener datos de usuario del AsyncStorage
  const { getUserToken } = useAsyncStorage();
  const { colors } = useTheme();

  // Escucha cambios en el estado de auth y actualiza el estado de usuario con el nuevo estado de auth
  auth.onAuthStateChanged((user) => {
    if (user) userState.setUser(user);
    else userState.setUser(null);
  });

  // Al montar el componente, obtiene los datos del usuario almacenados en el AsyncStorage y los pasa al estado del usuario actual del contexto de usuario
  // De esta forma, logueo al usuario automáticamente
  useEffect(() => {
    getUserToken().then((data) => {
      userState.setUser(data);
    });
  }, []);

  const styles = StyleSheet.create({
    screen: {
      headerShown: false,
      contentStyle: {
        backgroundColor: "blue",
      },
      tabBarShowLabel: false,
      tabBarActiveTintColor: "#7986CB",
      tabBarInactiveTintColor: "#7986CB",
    },
    screen_header: {
      headerShown: true,
      headerStyle: { backgroundColor: "#7986CB" },
    },
    tabBar: {
      tabBarStyle: { height: 56, shadowColor: "transparent" },
    },
  });

  /**
   * Stack de transacciones.
   */
  const TransactionsStack = () => {
    return (
      <Stack.Navigator initialRouteName="TransactionsScreen">
        <Stack.Screen name="TransactionsScreen" component={TransactionsScreen} options={{ ...styles.screen }} />
        <Stack.Screen
          name="AddTransactionScreen"
          component={AddTransactionScreen}
          options={{
            ...styles.screen,
            ...styles.screen_header,
            title: "Nueva transacción",
          }}
        />
      </Stack.Navigator>
    );
  };

  /**
   * Stack principal.
   */
  return (
    <NavigationContainer theme={themes.lightTheme}>
      {userState.user ? (
        <Tab.Navigator initialRouteName="OverviewScreen" screenOptions={styles.tabBar}>
          <Tab.Screen
            name="OverviewScreen"
            component={OverviewScreen}
            options={{
              ...styles.screen,
              tabBarIcon: ({ color, focused }) => (
                <TabBarIcon activeColor={color} focused={focused}>
                  <Path d="M480-40 360-160H200q-33 0-56.5-23.5T120-240v-560q0-33 23.5-56.5T200-880h560q33 0 56.5 23.5T840-800v560q0 33-23.5 56.5T760-160H600L480-40Zm0-440q58 0 99-41t41-99q0-58-41-99t-99-41q-58 0-99 41t-41 99q0 58 41 99t99 41ZM200-240h560v-46q-54-53-125.5-83.5T480-400q-83 0-154.5 30.5T200-286v46Z" />
                </TabBarIcon>
              ),
            }}
          />
          <Tab.Screen
            name="TransactionsStack"
            component={TransactionsStack}
            options={{
              ...styles.screen,
              tabBarIcon: ({ color, focused }) => (
                <TabBarIcon activeColor={color} focused={focused}>
                  <Path d="M120-120v-80l80-80v160h-80Zm160 0v-240l80-80v320h-80Zm160 0v-320l80 81v239h-80Zm160 0v-239l80-80v319h-80Zm160 0v-400l80-80v480h-80ZM120-327v-113l280-280 160 160 280-280v113L560-447 400-607 120-327Z" />
                </TabBarIcon>
              ),
            }}
          />
          <Tab.Screen
            name="OptionsScreen"
            component={OptionsScreen}
            options={{
              ...styles.screen,
              tabBarIcon: ({ color, focused }) => (
                <TabBarIcon activeColor={color} focused={focused}>
                  <Path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm112-260q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Z" />
                </TabBarIcon>
              ),
            }}
          />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator initialRouteName="WelcomeScreen">
          <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} options={{ ...styles.screen }} />
          <Stack.Screen name="AuthScreen" component={AuthScreen} options={{ ...styles.screen }} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
