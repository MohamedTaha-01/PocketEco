// Import the functions you need from the SDKs you need
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore, orderBy, query, where } from "firebase/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDgOpYK4pVNHHOAlFxgzTy6NtLPM9Etk-k",
  authDomain: "economia-tx.firebaseapp.com",
  projectId: "economia-tx",
  storageBucket: "economia-tx.appspot.com",
  messagingSenderId: "384800260660",
  appId: "1:384800260660:web:ffc13bf4cb2d5f73198061",
  measurementId: "G-59QMJBE2DL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);

/**
 ** Obtiene las transacciones de la base de datos con el UID del usuario especificado
 */
async function getTransactions(userUid) {
  try {
    const q = query(collection(db, "transactions"), where("userUid", "==", userUid), orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);

    const transactions = [];
    querySnapshot.forEach((doc) => {
      //console.log(doc.id, " => ", doc.data());
      transactions.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, transactions };
  } catch (error) {
    return { success: false, msg: error };
  }
}

/**
 ** Crea una transacción en la base de datos.
 */
async function createTransaction(tx) {
  try {
    const docRef = await addDoc(collection(db, "transactions"), {
      ...tx,
    });
    //console.log("Documento añadido con ID: ", docRef.id);
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, msg: error };
  }
}

/**
 ** Elimina una transacción de la base de datos
 */
async function deleteTransaction(id) {
  try {
    await deleteDoc(doc(db, "transactions", id));
    return { success: true };
  } catch (error) {
    return { success: false, msg: error };
  }
}

export { auth, createTransaction, deleteTransaction, getTransactions };
