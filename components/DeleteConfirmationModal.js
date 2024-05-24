import { useTheme } from "@react-navigation/native";
import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { CONSTANTS } from "../util/constants";

export default function DeleteConfirmationModal({ confirmationModalVisible, setConfirmationModalVisible, handleDeleteTransaction, selectedTransactionId }) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    modal_wrapper: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22,
    },
    modal: {
      margin: 20,
      backgroundColor: colors.light,
      borderRadius: CONSTANTS.borderRadius,
      padding: 32,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modal_text: {
      marginBottom: 15,
      textAlign: "center",
      color: colors.text,
    },
    modal_buttons_container: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
    },
    modal_button: {
      marginHorizontal: 16,
      borderRadius: CONSTANTS.borderRadius,
      padding: 16,
      elevation: 2,
    },
    button__close: {
      backgroundColor: colors.primary,
    },
    modal_button__text: {
      color: colors.light,
      fontWeight: "bold",
      textAlign: "center",
    },
    modal_button__ripple: {
      color: colors.ripple2,
    },
  });

  return (
    <View style={styles.modal_wrapper}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={confirmationModalVisible}
        onRequestClose={() => {
          setConfirmationModalVisible(!confirmationModalVisible);
        }}>
        <View style={styles.modal_wrapper}>
          <View style={styles.modal}>
            <Text style={styles.modal_text}>¿Eliminar transacción?</Text>
            <View style={styles.modal_buttons_container}>
              <Pressable
                style={[styles.modal_button, styles.button__close]}
                onPress={() => setConfirmationModalVisible(!confirmationModalVisible)}
                android_ripple={styles.modal_button__ripple}>
                <Text style={styles.modal_button__text}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={[styles.modal_button, styles.button__close]}
                onPress={() => {
                  setConfirmationModalVisible(!confirmationModalVisible);
                  handleDeleteTransaction(selectedTransactionId);
                }}
                android_ripple={styles.modal_button__ripple}>
                <Text style={styles.modal_button__text}>Confirmar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
