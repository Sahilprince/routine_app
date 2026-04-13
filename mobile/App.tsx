import "react-native-gesture-handler";
import { useEffect } from "react";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { RootNavigator } from "./app/navigation/RootNavigator";
import { loadInitialAuthState } from "./app/store/useAuthStore";
import { flushQueue } from "./app/services/offline";
import { registerForPushNotificationsAsync } from "./app/services/notifications";
import { api } from "./app/services/api";
import { useColorScheme } from "react-native";

const App = () => {
  const scheme = useColorScheme();
  useEffect(() => {
    const bootstrap = async () => {
      await loadInitialAuthState();
      await flushQueue();
      const pushToken = await registerForPushNotificationsAsync();
      if (pushToken) {
        try {
          await api.post("/auth/push-token", { token: pushToken });
        } catch {
          // ignoring failures
        }
      }
    };
    void bootstrap();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={scheme === "dark" ? DarkTheme : DefaultTheme}>
        <StatusBar style={scheme === "dark" ? "light" : "dark"} />
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
