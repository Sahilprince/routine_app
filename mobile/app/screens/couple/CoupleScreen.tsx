import { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { api } from "../../services/api";
import { AppScreen } from "../../components/layout/AppScreen";
import { useAuthStore } from "../../store/useAuthStore";

export const CoupleScreen = () => {
  const refreshUser = useAuthStore((state) => state.refreshUser);
  const [partner, setPartner] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchPartner = async () => {
    const { data } = await api.get("/couples/partner");
    setPartner(data.partner ?? null);
  };

  useEffect(() => {
    void fetchPartner();
  }, []);

  const sendInvite = async () => {
    try {
      setLoading(true);
      const { data } = await api.post("/couples/invite", { email });
      setInviteCode(data.code);
      Alert.alert("Invite sent", `Share code ${data.code}`);
    } catch (error: any) {
      Alert.alert("Invite failed", error?.response?.data?.message ?? error?.message ?? "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const acceptInvite = async () => {
    try {
      setLoading(true);
      await api.post("/couples/accept", { code });
      setCode("");
      await refreshUser();
      await fetchPartner();
      Alert.alert("Connected", "Your partner is now linked.");
    } catch (error: any) {
      Alert.alert("Connect failed", error?.response?.data?.message ?? error?.message ?? "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppScreen style={styles.container}>
      {partner ? (
        <View>
          <Text style={styles.title}>Connected with {partner.name}</Text>
          <Text style={styles.subtitle}>Shared routines are now synced.</Text>
        </View>
      ) : (
        <Text style={styles.title}>No partner linked</Text>
      )}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Invite partner</Text>
        <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#a1a1aa" value={email} onChangeText={setEmail} />
        <Pressable style={styles.button} onPress={sendInvite} disabled={loading}>
          <Text style={styles.buttonText}>Send invite</Text>
        </Pressable>
        {inviteCode && <Text style={styles.note}>Share code: {inviteCode}</Text>}
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Accept invite</Text>
        <TextInput style={styles.input} placeholder="Code" placeholderTextColor="#a1a1aa" value={code} onChangeText={setCode} />
        <Pressable style={styles.button} onPress={acceptInvite} disabled={loading}>
          <Text style={styles.buttonText}>Connect</Text>
        </Pressable>
      </View>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#05050a", padding: 16 },
  title: { color: "#fff", fontSize: 22, fontWeight: "600" },
  subtitle: { color: "#a1a1aa", marginBottom: 16 },
  card: { backgroundColor: "#11111a", padding: 16, borderRadius: 16, marginTop: 24, gap: 12 },
  cardTitle: { color: "#fff", fontSize: 18, fontWeight: "600" },
  input: { backgroundColor: "#1b1b24", color: "#fff", padding: 12, borderRadius: 12 },
  button: { backgroundColor: "#7c3aed", padding: 14, borderRadius: 12, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "600" },
  note: { color: "#a1a1aa", textAlign: "center" },
});
