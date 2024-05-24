import React, { createContext, useContext, useEffect, useState } from "react";
import { getTransactions } from "../firebaseConfig";
import { FirebaseUtilsLib } from "../lib/FirebaseUtilsLib";
import { useUserContext } from "./UserProvider";

const TransactionContext = createContext();

export const useTransactionContext = () => useContext(TransactionContext);

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);

  const { user } = useUserContext();

  const getGroupedTransactions = () => {
    const groupedData = [];
    const yearsFound = new Set();
    // recorro los datos y recojo los años disponibles en un set
    transactions.forEach((tx) => {
      yearsFound.add(FirebaseUtilsLib.toYear(tx.date.seconds));
    });

    // por cada año del set, busco las transacciones de ese mismo año
    yearsFound.forEach((yearFound) => {
      // filtro la lista de datos transacciones dejando solo las del año actual de la iteración
      const dataOfYear = transactions.filter((tx) => FirebaseUtilsLib.toYear(tx.date.seconds) === yearFound);
      // añado al array final el año y todas las entradas de ese año
      groupedData.push({ title: `${yearFound}`, data: dataOfYear });
    });
    return groupedData;
  };

  const fetchTransactions = async () => {
    setTransactionsLoading(true);
    if (user) {
      const res = await getTransactions(user.uid);
      if (res.success) {
        setTransactions(res.transactions);
        setTransactionsLoading(false);
      } else {
        console.log(res.msg);
      }
    }
  };

  /**
   * * Elimina una transacción mediante ID del estado de transacciones
   */
  const removeTransactionById = async (transactionId) => {
    const updatedTransactions = transactions.filter((tx) => tx.id !== transactionId);
    setTransactions(updatedTransactions);
  };

  /**
   ** Obtiene las transacciones del mes actual
   * @returns transacciones del mes actual
   */
  const getCurrentMonthTransactions = () => {
    const currMonth = new Date().getMonth() + 1;
    const filteredTransactions = transactions.filter((tx) => currMonth === FirebaseUtilsLib.toMonth(tx.date.seconds));

    return filteredTransactions ?? [];
  };

  /**
   ** Calcula el total de ingresos, total de gastos y total conjunto de cada categoría
   * @returns objeto con total ingresos, total gastos y total conjunto
   */
  const getCurrentMonthTotal = () => {
    // obtengo las transacciones del mes actual
    const currentMonthTransactions = getCurrentMonthTransactions();

    const totals = {};
    currentMonthTransactions.forEach((tx) => {
      const category = tx.category;
      const type = tx.type;
      const value = parseFloat(tx.value);

      if (!totals[category]) {
        totals[category] = {
          Ingresos: 0,
          Gastos: 0,
          Total: 0,
        };
      }
      // sumo ingresos y gastos por separado
      if (type === "Ingreso") {
        totals[category]["Ingresos"] += value;
      } else if (type === "Gasto") {
        totals[category]["Gastos"] += value;
      }
      // sumo total ingresos y total gastos para obtener total conjunto
      totals[category]["Total"] = totals[category]["Ingresos"] + totals[category]["Gastos"];
    });

    return totals;
  };

  // fetch transacciones cuando el usuario cambia
  useEffect(() => {
    fetchTransactions();
  }, [user]);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        transactionsLoading,
        fetchTransactions,
        getGroupedTransactions,
        removeTransactionById,
        getCurrentMonthTotal,
      }}>
      {children}
    </TransactionContext.Provider>
  );
};
