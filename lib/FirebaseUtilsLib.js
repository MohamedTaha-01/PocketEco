/**
 ** Librería con funciones útiles para firebase
 * @function formatDate Recibe timestamp en segundos y lo formatea a "día mes año horas:minutos"
 * @function toYear Recibe timestamp en segundos y lo transforma a años
 * @function errorCodeMessage Recibe código de error de firebase y devuelve el mensaje de error en español
 */

export const FirebaseUtilsLib = {
  formatDate: (seconds) => {
    const date = new Date(seconds * 1000);
    const formattedDate = date.toLocaleString("default", {
      day: "2-digit",
      month: "short",
      //year: "numeric",
    });
    let formattedTime = date.toLocaleString("default", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // añadir 0 por delante en horas de un solo dígito
    formattedTime = formattedTime.replace(/^(\d):/, "0$1:");

    return `${formattedDate} / ${formattedTime}`;
  },

  /**
   * Obtiene el año a partir de un timestamp en segundos
   */
  toYear: (seconds) => {
    const date = new Date(seconds * 1000);
    return date.getFullYear();
  },

  /**
   * Obtiene el mes a partir de un timestamp en segundos
   */
  toMonth: (seconds) => {
    const date = new Date(seconds * 1000);
    return date.getMonth() + 1;
  },

  /**
   * Genera el mensaje de error en español a partir del código de error
   */
  errorCodeMessage: (errorCode) => {
    switch (errorCode) {
      case "auth/user-not-found":
        return "Usuario no encontrado.";
      case "auth/email-already-exists":
        return "El correo proporcionado ya está siendo utilizado.";
      case "auth/email-already-in-use":
        return "El correo proporcionado ya está siendo utilizado.";
      case "auth/invalid-credential":
        return "El correo electrónico o la contraseña son incorrectos.";
      case "auth/invalid-email":
        return "El correo electrónico proporcionado no es válido.";
      case "auth/invalid-password":
        return "La contraseña proporcionada no es válida. Debe ser una cadena con al menos seis caracteres.";
      case "auth/weak-password":
        return "La contraseña proporcionada es demasiado débil.";
      default:
        return "Error";
    }
  },
};
