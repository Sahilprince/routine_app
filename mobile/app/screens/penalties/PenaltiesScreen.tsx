import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TextInput, Pressable } from "react-native";
import { usePenaltyStore } from "../../store/usePenaltyStore";
import { useAuthStore } from "../../store/useAuthStore";
import { AppScreen } from "../../components/layout/AppScreen";

export const PenaltiesScreen = () => {
  const penalties = usePenaltyStore((state) => state.penalties);
  const fetchPenalties = usePenaltyStore((state) => state.fetchPenalties);
  const assignPenalty = usePenaltyStore((state) => state.assignPenalty);
  const updatePenalty = usePenaltyStore((state) => state.updatePenalty);
  const [description, setDescription] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    fetchPenalties();
  }, [fetchPenalties]);

  const handleAssign = async () => {
    await assignPenalty({ assigneeId, description });
    setDescription("");
    setAssigneeId("");
  };

  return (
    <AppScreen style={styles.container}>
      <FlatList
        data={penalties}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.meta}>Status: {item.status}</Text>
            {item.assignedTo === user?._id && (
              <View style={styles.actions}>
                <Pressable style={styles.badge} onPress={() => updatePenalty(item._id, "completed")}>
                  <Text style={styles.badgeText}>Complete</Text>
                </Pressable>
              </View>
            )}
          </View>
        )}
      />
      <View style={styles.form}>
        <Text style={styles.heading}>Assign penalty</Text>
        <TextInput style={styles.input} placeholder="Partner user id" placeholderTextColor="#a1a1aa" value={assigneeId} onChangeText={setAssigneeId} />
        <TextInput style={styles.input} placeholder="Description" placeholderTextColor="#a1a1aa" value={description} onChangeText={setDescription} />
        <Pressable style={styles.button} onPress={handleAssign}>
          <Text style={styles.buttonText}>Assign</Text>
        </Pressable>
      </View>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#05050a" },
  card: { backgroundColor: "#11111a", padding: 16, borderRadius: 16, marginBottom: 12 },
  description: { color: "#fff", fontSize: 16, marginBottom: 8 },
  meta: { color: "#a1a1aa" },
  actions: { flexDirection: "row", marginTop: 12 },
  badge: { backgroundColor: "#22c55e", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  badgeText: { color: "#05050a" },
  form: { marginTop: 16 },
  heading: { color: "#fff", fontSize: 18, fontWeight: "600", marginBottom: 12 },
  input: { backgroundColor: "#11111a", color: "#fff", padding: 12, borderRadius: 12, marginBottom: 12 },
  button: { backgroundColor: "#7c3aed", padding: 14, borderRadius: 12, alignItems: "center" },
  buttonText: { color: "#fff" },
});
