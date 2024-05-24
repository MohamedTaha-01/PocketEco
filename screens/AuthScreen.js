import { useTheme } from "@react-navigation/native";
import { useState } from "react";
import { Pressable, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { useUserContext } from "../context/UserProvider";
import "../firebaseConfig";
import { useAsyncStorage } from "../hooks/useAsyncStorage";
import { useAuth } from "../hooks/useAuth";
import { FirebaseUtilsLib } from "../lib/FirebaseUtilsLib";
import { CONSTANTS } from "../util/constants";

export default function AuthScreen({ route }) {
  // Colores del tema activo
  const { colors } = useTheme();
  // Hook con funciones para autentificar usuarios
  const { login, signup } = useAuth();
  // Estado de usuario de la aplicación
  const userState = useUserContext();
  // Función para almacenar el usuario en el AsyncStorage
  const { storeUserToken } = useAsyncStorage();

  // Define si se muestra el formulario de registro en lugar del formulario de login
  // Valor por defecto true si lo recibe mediante la ruta, en caso contrario false
  const [signupForm, setSignupForm] = useState((route.params && route.params.sign) ?? false);

  // Campos formulario
  const [name, setName] = useState("");
  const [email, setEmail] = useState("micuenta@gmail.com");
  const [password, setPassword] = useState("123456");

  // ---

  /** Llama a la funcion login, que devuelve el usuario logueado.
   *  Establece el usuario en el userState.
   *  Almacena el usuario en el AsyncStorage. */
  const handleLogin = async () => {
    login(email, password)
      .then((user) => {
        // actualiza el estado de usuario
        userState.setUser(user);
        // almacena el token de usuario en el async storage
        storeUserToken(user);
      })
      .catch((error) => {
        // Error en el login
        const errorCode = error.code;
        Toast.show({
          type: "error",
          text1: "Ha ocurrido un error",
          text2: FirebaseUtilsLib.errorCodeMessage(errorCode),
          position: "bottom",
        });
      });
  };

  /** Llama a la función signup, que devuelve el usuario registrado
   *  Activa el formulario de inicio de sesión
   */
  const handleSignup = async () => {
    signup(name, email, password)
      .then((u) => {
        setSignupForm(false);
      })
      .catch((error) => {
        const errorCode = error.code;
        Toast.show({
          type: "error",
          text1: "Ha ocurrido un error",
          text2: FirebaseUtilsLib.errorCodeMessage(errorCode),
          position: "bottom",
        });
      });
  };

  const styles = StyleSheet.create({
    wrapper: { flex: 1, display: "flex", flexDirection: "column", padding: 24 },
    title: { color: colors.primary, fontSize: CONSTANTS.fontSize_xl, fontWeight: "bold" },
    input__label: {
      marginTop: 16,
    },
    input: {
      marginTop: 8,
      padding: 8,
      borderRadius: CONSTANTS.borderRadius,
      backgroundColor: colors.card,
    },
    pressable: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 16,
      padding: 16,
      borderRadius: CONSTANTS.borderRadius,
      backgroundColor: colors.primary,
    },
    pressable__text: {
      color: colors.light,
      fontWeight: "bold",
      fontSize: CONSTANTS.fontSize_md,
    },
    bottom_text: {
      display: "flex",
      flexDirection: "row",
      gap: 4,
      marginTop: 16,
    },
    bottom_text__link: {
      color: colors.primary,
    },
  });

  return (
    <SafeAreaView style={styles.wrapper}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <Text style={styles.title}>{signupForm ? "Registro" : "Inicio de sesión"}</Text>
      {/* campo nombre */}
      {signupForm ? (
        <>
          <Text style={styles.input__label}>Nombre</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={(text) => setName(text)}
            placeholder="Nombre"
            autoComplete="name"
            textContentType="name"
            maxLength={40}
          />
        </>
      ) : null}
      {/* campo correo */}
      <Text style={styles.input__label}>Correo electrónico</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={(text) => setEmail(text)}
        placeholder="Correo electrónico"
        autoComplete="email"
        inputMode="email"
        textContentType="emailAddress"
      />
      {/* campo contraseña */}
      <Text style={styles.input__label}>Contraseña</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={(text) => setPassword(text)}
        placeholder="Contraseña"
        autoComplete="password"
        textContentType="password"
        maxLength={40}
      />
      {/* botones */}
      {signupForm ? (
        <>
          <Pressable onPress={handleSignup} style={styles.pressable} android_ripple={{ color: colors.ripple2, borderless: false }}>
            <Text style={styles.pressable__text}>Registrarse</Text>
          </Pressable>
          <View style={styles.bottom_text}>
            <Text>¿Ya tienes cuenta?</Text>
            <TouchableOpacity
              onPress={() => {
                setSignupForm(false);
              }}>
              <Text style={styles.bottom_text__link}>Inicia sesión</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <Pressable onPress={handleLogin} style={styles.pressable} android_ripple={{ color: colors.ripple2, borderless: false }}>
            <Text style={styles.pressable__text}>Iniciar sesión</Text>
          </Pressable>
          <View style={styles.bottom_text}>
            <Text>¿Aún no te has registrado?</Text>
            <TouchableOpacity
              onPress={() => {
                setSignupForm(true);
              }}>
              <Text style={styles.bottom_text__link}>Regístrate aquí</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}
