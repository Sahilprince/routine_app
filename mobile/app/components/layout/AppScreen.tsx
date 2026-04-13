import { ReactNode } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export const AppScreen = ({ children, style }: Props) => (
  <SafeAreaView edges={["top"]} style={[{ flex: 1, backgroundColor: "#05050a" }, style]}>
    {children}
  </SafeAreaView>
);
