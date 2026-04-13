import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { useAuthStore } from "../../store/useAuthStore";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { api } from "../../services/api";
import { AppScreen } from "../../components/layout/AppScreen";

export const ProfileScreen = () => {
  const navigation = useNavigation<NativeStackScreenProps<any>["navigation"]>();
  const { user, logout, token } = useAuthStore();

  const exportCsv = async () => {
    try {
      const uri = `${FileSystem.documentDirectory}routines.csv`;
      const response = await fetch(`${api.defaults.baseURL}/export/csv`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const text = await response.text();
      await FileSystem.writeAsStringAsync(uri, text, { encoding: FileSystem.EncodingType.UTF8 });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert("Export ready", `File saved to ${uri}`);
      }
    } catch (error) {
      Alert.alert("Export failed", "Please try again later");
    }
  };

  return (
    <AppScreen style={styles.container}>
      <Text style={styles.title}>{user?.name}</Text>
      <Text style={styles.subtitle}>{user?.email}</Text>
      <View style={styles.statsRow}>
        <View>
          <Text style={styles.statLabel}>XP</Text>
          <Text style={styles.statValue}>{user?.xp ?? 0}</Text>
        </View>
        <View>
          <Text style={styles.statLabel}>Level</Text>
          <Text style={styles.statValue}>{user?.level ?? "Beginner"}</Text>
        </View>
        <View>
          <Text style={styles.statLabel}>Streak</Text>
          <Text style={styles.statValue}>{user?.streak ?? 0} days</Text>
        </View>
      </View>
      <Pressable style={styles.button} onPress={() => navigation.navigate("Couple" as never)}>
        <Text style={styles.buttonText}>Couple Mode</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => navigation.navigate("Penalties" as never)}>
        <Text style={styles.buttonText}>Penalties</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={exportCsv}>
        <Text style={styles.buttonText}>Export CSV</Text>
      </Pressable>
      <Pressable style={styles.logout} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#05050a", padding: 16 },
  title: { color: "#fff", fontSize: 24, fontWeight: "600" },
  subtitle: { color: "#a1a1aa", marginBottom: 24 },
  statsRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
  statLabel: { color: "#a1a1aa" },
  statValue: { color: "#fff", fontSize: 20, fontWeight: "600" },
  button: { backgroundColor: "#11111a", padding: 16, borderRadius: 16, marginBottom: 12 },
  buttonText: { color: "#fff", textAlign: "center" },
  logout: { marginTop: 24 },
  logoutText: { color: "#ef4444", textAlign: "center" },
});
