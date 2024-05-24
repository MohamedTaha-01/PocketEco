import { useTheme } from "@react-navigation/native";
import { useState } from "react";
import { StatusBar, StyleSheet, Text, View } from "react-native";
import { Path, Svg } from "react-native-svg";
import Toast from "react-native-toast-message";
import OptionCard from "../components/OptionCard";
import { useUserContext } from "../context/UserProvider";
import { useAuth } from "../hooks/useAuth";
import { CONSTANTS } from "../util/constants";

export default function OptionsScreen() {
  const userState = useUserContext();
  const { logout } = useAuth();
  const { colors } = useTheme();

  const [selectedCurrency, setSelectedCurrency] = useState("€");
  const [selectedTheme, setSelectedTheme] = useState("light");

  const handleLogoutPress = () => {
    logout().catch((error) => {
      Toast.show({
        type: "error",
        text1: "Ha ocurrido un error:",
        text2: error,
        position: "bottom",
      });
    });
  };

  const currencyData = [{ label: "Euro (EUR)", value: "€" }];
  const themeData = [{ label: "Claro", value: "light" }];

  const styles = StyleSheet.create({
    wrapper: { flex: 1, display: "flex", flexDirection: "column" },
    header: {
      height: 100,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
    },
    options_title: {
      fontSize: CONSTANTS.fontSize_xl,
      fontWeight: "bold",
      color: colors.light,
      marginVertical: 4,
      letterSpacing: 1.1,
    },
    options_subtitle: {
      fontSize: CONSTANTS.fontSize_md,
      color: colors.light,
    },
    options_svg: {
      position: "absolute",
      top: 100,
      left: 0,
      height: 70,
      width: "100%",
    },
    body: {
      display: "flex",
      flexDirection: "column",
      marginTop: 70,
      padding: 16,
    },
    section_title: {
      marginTop: 12,
    },
    section_content: {
      marginVertical: 16,
      borderRadius: CONSTANTS.borderRadius,
      backgroundColor: colors.card,
    },
  });

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <View style={styles.header}>
        <Text style={styles.options_title}>{(userState.user.displayName && userState.user.displayName.toUpperCase()) || "PERFIL"}</Text>
        <Text style={styles.options_subtitle}>{userState.user.email}</Text>
        {
          <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" style={styles.options_svg} preserveAspectRatio="none">
            <Path
              fill="#7986CB"
              fill-opacity="1"
              d="M0,256L120,218.7C240,181,480,107,720,112C960,117,1200,203,1320,245.3L1440,288L1440,0L1320,0C1200,0,960,0,720,0C480,0,240,0,120,0L0,0Z"></Path>
          </Svg>
        }
      </View>
      <View style={styles.body}>
        <Text style={styles.section_title}>Preferencias</Text>
        <View style={styles.section_content}>
          <OptionCard
            text={"Moneda"}
            pickerPrompt="Moneda"
            pickerSelectedValue={selectedCurrency}
            pickerSetSelectedValue={setSelectedCurrency}
            pickerData={currencyData}
          />
          <OptionCard text={"Tema"} pickerPrompt="Tema" pickerSelectedValue={selectedTheme} pickerSetSelectedValue={setSelectedTheme} pickerData={themeData} />
        </View>
        <Text style={styles.section_title}>Opciones</Text>
        <View style={styles.section_content}>
          <OptionCard text={"Cerrar sesión"} isPressable={true} pressAction={handleLogoutPress}></OptionCard>
        </View>
      </View>
    </View>
  );
}
