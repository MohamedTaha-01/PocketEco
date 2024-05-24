import { createContext, useContext, useState } from "react";

/**
 * @file UserProvider.js
 ** Proveedor de contexto para gestionar el estado del usuario en la aplicación.
 * @constant userContext
 * @function useUserContext Hook para acceder al contexto del usuario en componentes hijos.
 * @function userProvider Componente proveedor que envuelve a la aplicación y proporciona el contexto del usuario.
 */

const userContext = createContext();

/**
 * Hook para acceder al contexto del usuario en componentes hijos.
 * @returns userState
 */
export function useUserContext() {
  return useContext(userContext);
}

/**
 * Componente proveedor de contexto que envuelve a la aplicación y proporciona el contexto del usuario.
 */
export function UserProvider({ children }) {
  // Estado del usuario
  const [user, setUser] = useState(null);

  /**
   * Estado de usuario en el contexto de la aplicación
   * user Datos del usuario
   * @function setUser Establecer datos del usuario
   */
  const userState = {
    user,
    setUser,
  };

  // Pasa el contexto de usuario a los componentes hijos.
  return <userContext.Provider value={userState}>{children}</userContext.Provider>;
}
