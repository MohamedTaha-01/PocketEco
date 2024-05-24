import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg from "react-native-svg";
import { FirebaseUtilsLib } from "../lib/FirebaseUtilsLib";
import { CATEGORIES } from "../util/categories";
import { CONSTANTS } from "../util/constants";

// TODO: Añadir modal confirmación borrado transacción

export default function Transaction({ tx, handleTransactionLongPress }) {
  const category = CATEGORIES[tx.category];

  const styles = StyleSheet.create({
    tx: {
      display: "flex",
      flexDirection: "row",
      marginVertical: 12,
    },
    tx_col1: {
      width: 48,
      height: 48,
      marginRight: 12,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: CONSTANTS.borderRadius,
    },
    tx_col2: {
      flex: 3,
      justifyContent: "center",
    },
    tx_col3: {
      flex: 2,
      alignItems: "flex-end",
      justifyContent: "space-evenly",
    },
    tx_title: {
      fontSize: CONSTANTS.fontSize_md,
      fontWeight: "bold",
    },
    tx_subtitle: {
      color: "#424242",
      fontSize: CONSTANTS.fontSize_sm,
    },
  });

  return (
    <Pressable
      style={styles.tx}
      onLongPress={() => {
        handleTransactionLongPress(tx.id);
      }}>
      {/* Columna 1 (Icono) */}
      <View
        style={{
          ...styles.tx_col1,
          backgroundColor: category?.color || CATEGORIES.otros.color,
        }}>
        <Svg xmlns="http://www.w3.org/2000/svg" height="36" width="36" fill="#FAFAFA" viewBox="0 -960 960 960">
          {category?.icon || CATEGORIES.otros.icon}
        </Svg>
      </View>

      {/* Columna 2 */}
      <View style={styles.tx_col2}>
        <Text style={styles.tx_title}>{tx?.name}</Text>
        <Text style={styles.tx_subtitle}>{category?.name}</Text>
      </View>

      {/* Columna 3 */}
      <View style={styles.tx_col3}>
        <Text
          style={{
            ...styles.tx_title,
            color: tx?.type !== "Gasto" ? "#33691E" : null,
          }}>
          {`${tx.value}€`}
        </Text>
        <Text style={styles.tx_subtitle}>{FirebaseUtilsLib.formatDate(tx.date.seconds)}</Text>
      </View>
    </Pressable>
  );
}
