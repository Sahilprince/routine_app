import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useAuthStore } from "../store/useAuthStore";
import { SignInScreen } from "../screens/auth/SignInScreen";
import { SignUpScreen } from "../screens/auth/SignUpScreen";
import { HomeScreen } from "../screens/home/HomeScreen";
import { RoutinesScreen } from "../screens/routines/RoutinesScreen";
import { AnalyticsScreen } from "../screens/analytics/AnalyticsScreen";
import { ProfileScreen } from "../screens/profile/ProfileScreen";
import { CoupleScreen } from "../screens/couple/CoupleScreen";
import { PenaltiesScreen } from "../screens/penalties/PenaltiesScreen";
import { Ionicons } from "@expo/vector-icons";
import { View, ActivityIndicator } from "react-native";
import { useEffect } from "react";
import { useRoutineStore } from "../store/useRoutineStore";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }} />
    <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const Tabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarStyle: { backgroundColor: "#0b0b0f" },
      tabBarActiveTintColor: "#7c3aed",
      tabBarIcon: ({ color, size }) => {
        const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
          Home: "home",
          Routines: "calendar",
          Analytics: "analytics",
          Profile: "person",
        };
        return <Ionicons name={icons[route.name] ?? "ellipse"} color={color} size={size} />;
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Routines" component={RoutinesScreen} />
    <Tab.Screen name="Analytics" component={AnalyticsScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

export const RootNavigator = () => {
  const { token, loading } = useAuthStore();
  const fetchRoutines = useRoutineStore((state) => state.fetchRoutines);

  useEffect(() => {
    if (token) {
      fetchRoutines();
    }
  }, [token, fetchRoutines]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {token ? (
        <>
          <Stack.Screen name="Main" component={Tabs} options={{ headerShown: false }} />
          <Stack.Screen name="Couple" component={CoupleScreen} options={{ title: "Couple Mode" }} />
          <Stack.Screen name="Penalties" component={PenaltiesScreen} options={{ title: "Penalties" }} />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} options={{ headerShown: false }} />
      )}
    </Stack.Navigator>
  );
};
