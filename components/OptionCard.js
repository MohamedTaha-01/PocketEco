import { Picker } from "@react-native-picker/picker";
import { useTheme } from "@react-navigation/native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { CONSTANTS } from "../util/constants";

/**
 * Representa una opción en el menú de opciones.
 * @param {string} text Texto de la opción
 * @param {boolean} isPressable Indica si la opción es un botón (true). En caso contrario será un picker
 * @param {object} pressAction La función a ejecutar al ser pulsado en caso de ser un botón
 * @param {string} pickerPrompt Título del picker
 * @param {string} pickerSelectedValue Valor seleccionado useState
 * @param {string} pickerSetSelectedValue Establecer valor seleccionado useState
 * @param {array} pickerData Lista de objetos desde los cuales generar items
 */
export default function OptionCard({ text, isPressable, pressAction, pickerPrompt, pickerSelectedValue, pickerSetSelectedValue, pickerData }) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    card_container: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderRadius: CONSTANTS.borderRadius,
      padding: 16,
    },
    card_child: {
      flex: 1,
    },
  });

  return isPressable && isPressable ? (
    <Pressable onPress={pressAction} style={styles.card_container} android_ripple={{ color: colors.ripple, borderless: true }}>
      <Text>{text}</Text>
    </Pressable>
  ) : (
    <View style={styles.card_container}>
      <Text style={styles.card_child}>{text}</Text>
      <Picker
        selectedValue={pickerSelectedValue}
        onValueChange={(text, index) => pickerSetSelectedValue(text)}
        prompt={pickerPrompt}
        dropdownIconRippleColor={colors.ripple}
        style={styles.card_child}>
        {pickerData && pickerData.map((item) => <Picker.Item label={item.label} value={item.value} key={item.value} />)}
      </Picker>
    </View>
  );
}
