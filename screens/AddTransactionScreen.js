import { Picker } from "@react-native-picker/picker";
import { useNavigation, useTheme } from "@react-navigation/native";
import { useState } from "react";
import { Button, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import DatePicker from "react-native-date-picker";
import Toast from "react-native-toast-message";
import { useTransactionContext } from "../context/TransactionContext";
import { useUserContext } from "../context/UserProvider";
import { createTransaction } from "../firebaseConfig";
import { CATEGORIES } from "../util/categories";
import { CONSTANTS } from "../util/constants";

export default function AddTransactionScreen() {
  // hooks
  const { colors } = useTheme();
  const userState = useUserContext();
  const navigation = useNavigation();
  const { fetchTransactions } = useTransactionContext();
  // states
  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ingresos");
  const [selectedType, setSelectedType] = useState("Ingreso");
  const [monetaryValue, setMonetaryValue] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const handleCreateTransaction = async () => {
    if (validateInputs()) {
      const res =
        (await createTransaction({
          name: title.trim(),
          category: selectedCategory,
          type: selectedType,
          value: selectedType === "Ingreso" ? monetaryValue : -monetaryValue,
          date: selectedDate,
          userUid: userState.user.uid,
        })) || false;
      if (res.success) {
        fetchTransactions();
        navigation.goBack();
      } else {
        Toast.show({
          type: "error",
          text1: "Ha ocurrido un error:",
          text2: res.msg,
          position: "bottom",
        });
      }
    } else {
      Toast.show({
        type: "error",
        text1: "Error de validación",
        text2: "Uno o más campos son incorrectos",
        position: "bottom",
      });
    }
  };

  const validateInputs = () => {
    let validationCorrect = true;

    // validar titulo
    if (title.trim().length <= 0) validationCorrect = false;

    // validar número
    const re = /^\d+(\.\d+)?$/;
    if (!re.test(monetaryValue)) validationCorrect = false;

    return validationCorrect;
  };

  const styles = StyleSheet.create({
    wrapper: { flex: 1, display: "flex", flexDirection: "column", padding: 24 },
    title: { color: colors.primary, fontSize: CONSTANTS.fontSize_xl, fontWeight: "bold" },
    input__label: {
      marginTop: 16,
    },
    input: {
      marginTop: 8,
      padding: 8,
      borderRadius: CONSTANTS.borderRadius,
      backgroundColor: colors.card,
    },
    pressable: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 16,
      padding: 16,
      borderRadius: CONSTANTS.borderRadius,
      backgroundColor: colors.primary,
    },
    pressable__text: {
      color: colors.light,
      fontWeight: "bold",
      fontSize: CONSTANTS.fontSize_md,
    },
    date_button: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 16,
      padding: 16,
      borderRadius: CONSTANTS.borderRadius,
      backgroundColor: colors.primary,
    },
  });

  return (
    <View style={styles.wrapper}>
      <Text style={styles.input__label}>Título</Text>
      <TextInput style={styles.input} value={title} onChangeText={(text) => setTitle(text)} placeholder="Título" maxLength={40} />
      <Text style={styles.input__label}>Categoría</Text>
      <Picker selectedValue={selectedCategory} onValueChange={(text, index) => setSelectedCategory(text)} prompt="Categoría">
        {Object.keys(CATEGORIES).map((ctg) => (
          <Picker.Item key={ctg} label={CATEGORIES[ctg].name} value={ctg} />
        ))}
      </Picker>
      <Text style={styles.input__label}>Tipo</Text>
      <Picker selectedValue={selectedType} onValueChange={(text, index) => setSelectedType(text)} prompt="Tipo">
        <Picker.Item label="Gasto" value="Gasto" />
        <Picker.Item label="Ingreso" value="Ingreso" />
      </Picker>
      <Text style={styles.input__label}>Valor</Text>
      <TextInput
        style={styles.input}
        value={monetaryValue}
        onChangeText={(text) => setMonetaryValue(text.trim().replace("-", "").replace(",", "."))}
        placeholder="Valor"
        inputMode="decimal"
        maxLength={7}
      />
      <Text style={styles.input__label}>Fecha</Text>
      <>
        <Button
          title={`${selectedDate.toLocaleString("es-ES", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}`}
          onPress={() => setDatePickerOpen(true)}
        />
        <DatePicker
          modal
          open={datePickerOpen}
          date={selectedDate}
          title="Fecha"
          locale="es"
          is24hourSource="locale"
          maximumDate={new Date()}
          onConfirm={(text) => {
            setDatePickerOpen(false);
            setSelectedDate(text);
          }}
          onCancel={() => {
            setDatePickerOpen(false);
          }}
          buttonColor="#7986CB"
        />
      </>
      <Pressable onPress={handleCreateTransaction} style={styles.pressable}>
        <Text style={styles.pressable__text}>Añadir</Text>
      </Pressable>
    </View>
  );
}
