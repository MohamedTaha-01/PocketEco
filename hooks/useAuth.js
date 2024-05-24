import AsyncStorage from "@react-native-async-storage/async-storage";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { auth } from "../firebaseConfig";

/**
 * * Hook con funciones para autentificar usuarios
 * @function signup Crea un usuario con email y contraseña, luego le asigna el nombre. Retorna datos del usuario creado.
 * @function login Loguea usuario con email y contraseña. Retorna datos usuario logueado.
 * @function logout Cierra sesión y elimina los datos del usuario del AsyncStorage.
 */

export function useAuth() {
  const signup = async (name, email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    updateProfile(user, { displayName: name });
    user.displayName = name;
    return user;
  };

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    return user;
  };

  const logout = async () => {
    await signOut(auth);
    AsyncStorage.clear();
  };

  return { signup, login, logout };
}
