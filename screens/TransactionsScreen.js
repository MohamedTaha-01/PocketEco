import { useNavigation, useTheme } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, SectionList, StatusBar, StyleSheet, Text, View } from "react-native";
import { Path, Svg } from "react-native-svg";
import Toast from "react-native-toast-message";

import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import Transaction from "../components/Transaction";
import { useTransactionContext } from "../context/TransactionContext";
import { deleteTransaction } from "../firebaseConfig";
import { CONSTANTS } from "../util/constants";

export default function TransactionsScreen() {
  // hooks
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { transactionsLoading, fetchTransactions, getGroupedTransactions, removeTransactionById } = useTransactionContext();

  // states
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [endOfList, setEndOfList] = useState(false);
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);

  // Obtiene las transacciones agrupadas por año
  const groupedData = getGroupedTransactions();

  // Muestra la ventana de confirmación de borrado para la transacción objetivo
  const handleTransactionLongPress = (txId) => {
    setSelectedTransactionId(txId);
    setConfirmationModalVisible(true);
  };

  // Borra la transacción de la base de datos y actualiza el estado
  const handleDeleteTransaction = async (id) => {
    const res = await deleteTransaction(id);
    if (res.success) {
      removeTransactionById(id);
      Toast.show({
        type: "success",
        text1: "Transacción eliminada",
        position: "bottom",
      });
    } else {
      Toast.show({
        type: "error",
        text1: "Ha ocurrido un error:",
        text2: res.msg,
        position: "bottom",
      });
    }
  };

  // detecta si el scroll esta cerca del final y actualiza el estado
  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
  };

  // Gestiona el refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchTransactions().finally(() => setIsRefreshing(false));
  };

  // Solicita fetch de la bd al cargar la página
  useEffect(() => {
    handleRefresh();
  }, []);

  const styles = StyleSheet.create({
    wrapper: { flex: 1, padding: 24, paddingBottom: 0 },
    sectionHeader: {
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderColor: "#9E9E9E20",
    },
    loadingIndicator: { marginTop: 32 },
    yearDivider: {
      textAlign: "center",
      fontSize: CONSTANTS.fontSize_lg,
      marginHorizontal: 20,
      marginVertical: 10,
      marginTop: 20,
      color: "#9E9E9E",
    },
    floatingButtonContainer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      flex: 1,
      flexDirection: "row",
      justifyContent: "flex-end",
    },
    floatingButton: {
      width: 64,
      height: 64,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: CONSTANTS.borderRadius,
      margin: 16,
      backgroundColor: colors.primary,
    },
  });

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <Text>Transacciones</Text>
      {transactionsLoading ? (
        <ActivityIndicator style={styles.loadingIndicator} size="large" />
      ) : (
        <SectionList
          sections={groupedData}
          keyExtractor={(item, index) => item.id.toString() + index}
          renderItem={({ item }) => (
            <Transaction tx={item} handleTransactionLongPress={handleTransactionLongPress} handleDeleteTransaction={handleDeleteTransaction} />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.yearDivider}>{title}</Text>
            </View>
          )}
          showsVerticalScrollIndicator={false}
          onRefresh={handleRefresh}
          refreshing={isRefreshing}
          stickySectionHeadersEnabled
          style={{ elevation: -1 }}
          ListEmptyComponent={<Text>Ninguna transacción registrada</Text>}
          onMomentumScrollEnd={({ nativeEvent }) => {
            setEndOfList(isCloseToBottom(nativeEvent));
          }}
          scrollEventThrottle={400}
        />
      )}
      <View style={[styles.floatingButtonContainer, { opacity: endOfList ? 0.3 : 1 }]}>
        <Pressable style={styles.floatingButton} onPress={() => navigation.navigate("AddTransactionScreen")} android_ripple={{ color: colors.ripple2 }}>
          <Svg xmlns="http://www.w3.org/2000/svg" height="32" width="32" fill={colors.background} viewBox="0 -960 960 960">
            <Path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
          </Svg>
        </Pressable>
      </View>
      <DeleteConfirmationModal
        confirmationModalVisible={confirmationModalVisible}
        setConfirmationModalVisible={setConfirmationModalVisible}
        handleDeleteTransaction={handleDeleteTransaction}
        selectedTransactionId={selectedTransactionId}
      />
    </View>
  );
}
