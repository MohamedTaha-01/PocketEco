import { useTheme } from "@react-navigation/native";
import { View } from "react-native";
import { Svg } from "react-native-svg";
import { CONSTANTS } from "../util/constants";

export default function TabBarIcon({ children, activeColor, focused }) {
  const { colors } = useTheme();

  return (
    <View
      style={
        focused
          ? {
              backgroundColor: activeColor,
              borderRadius: CONSTANTS.borderRadius,
              padding: 4,
              padding: 4,
              width: 48,
              height: 48,
              justifyContent: "center",
              alignItems: "center",
            }
          : {
              backgroundColor: colors.light,
              borderRadius: 100,
              padding: 4,
              width: 40,
              height: 40,
              justifyContent: "center",
              alignItems: "center",
            }
      }>
      <Svg xmlns="http://www.w3.org/2000/svg" height="32" width="32" fill={focused ? colors.light : activeColor} viewBox="0 -960 960 960">
        {children}
      </Svg>
    </View>
  );
}
