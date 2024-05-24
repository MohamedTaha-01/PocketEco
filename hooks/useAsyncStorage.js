import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * * Hook para acceder al AsyncStorage y almacenar/obtener datos del usuario y otros datos
 * @function storeUserToken Almacenar datos de usuario en AsyncStorage
 * @function getUserToken Obtener datos de usuario en AsyncStorage
 * @function getData Almacenar datos en AsyncStorage
 * @function storeData Obtener datos del AsyncStorage
 */

export function useAsyncStorage() {
  const storeUserToken = async (user) => {
    try {
      await AsyncStorage.setItem("userData", JSON.stringify(user));
    } catch (error) {
      console.log("Error al almacenar token de usuario", error);
    }
  };
  const getUserToken = async () => {
    try {
      let userData = await AsyncStorage.getItem("userData");
      return JSON.parse(userData);
    } catch (error) {
      console.log("Error al obtener token de usuario", error);
    }
  };

  const getData = async (key) => {
    try {
      let data = await AsyncStorage.getItem(key);
      return JSON.parse(data);
    } catch (error) {
      console.log("Error al obtener datos", error);
    }
  };
  const storeData = async (key, data) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.log("Error al almacenar datos", error);
    }
  };

  return { storeUserToken, getUserToken, getData, storeData };
}
