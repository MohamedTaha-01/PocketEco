import { useTheme } from "@react-navigation/native";
import { ImageBackground, Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import { CONSTANTS } from "../util/constants";

export default function WelcomeScreen({ navigation }) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    welcome_screen__wrapper: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      gap: 64,
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      color: colors.light,
      fontSize: CONSTANTS.fontSize_xxl,
      fontWeight: "bold",
      textTransform: "uppercase",
      letterSpacing: 1.1,
    },
    subtitle: {
      color: colors.light,
      fontSize: CONSTANTS.fontSize_md,
      letterSpacing: 1.1,
    },
    header__container: { flex: 1, display: "flex", flexDirection: "column", gap: 16, justifyContent: "center" },
    auth_buttons__container: {
      flex: 1,
      display: "flex",
      flexDirection: "row",
      gap: 16,
      marginHorizontal: 32,
      justifyContent: "center",
      alignItems: "flex-end",
    },
    pressable: {
      flex: 1,
      height: 52,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: 16,
      borderRadius: CONSTANTS.borderRadius,
      backgroundColor: colors.primary,
    },
    pressable__text: {
      fontWeight: "bold",
      color: colors.light,
    },
  });

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <ImageBackground source={CONSTANTS.img_1} resizeMode="cover" style={styles.welcome_screen__wrapper}>
        <View style={styles.header__container}>
          <Text style={styles.title}>Pocket Eco</Text>
          <Text style={styles.subtitle}>Gestiona todos tus gastos fácilmente</Text>
        </View>
        <View style={styles.auth_buttons__container}>
          <Pressable
            onPress={() => {
              navigation.navigate("AuthScreen");
            }}
            style={styles.pressable}
            android_ripple={{ color: colors.ripple2, borderless: false }}>
            <Text style={styles.pressable__text}>Iniciar sesión</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              navigation.navigate("AuthScreen", { sign: true });
            }}
            style={styles.pressable}
            android_ripple={{ color: colors.ripple2, borderless: false }}>
            <Text style={styles.pressable__text}>Regístrate</Text>
          </Pressable>
        </View>
      </ImageBackground>
    </View>
  );
}
