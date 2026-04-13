import { View, Text, StyleSheet, Pressable } from "react-native";
import { Routine, useRoutineStore } from "../../store/useRoutineStore";
import { formatTime } from "../../utils/date";
import { getRoutineScheduleLabel } from "../../utils/routine";

interface Props {
  routine: Routine;
  status?: "pending" | "completed" | "missed";
}

export const RoutineCard = ({ routine, status = "pending" }: Props) => {
  const toggleCompletion = useRoutineStore((state) => state.toggleCompletion);
  const schedule = getRoutineScheduleLabel(routine.frequency);

  return (
    <View style={[styles.card, statusStyles[status]]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{routine.title}</Text>
        <Text style={styles.meta}>
          {formatTime(routine.time)} | {routine.category} | {schedule}
        </Text>
      </View>
      <View style={styles.actions}>
        <Pressable style={[styles.badge, status === "completed" && styles.badgeActive]} onPress={() => toggleCompletion(routine._id, "completed")}>
          <Text style={styles.badgeText}>Done</Text>
        </Pressable>
        <Pressable style={[styles.badge, status === "missed" && styles.badgeDanger]} onPress={() => toggleCompletion(routine._id, "missed")}>
          <Text style={styles.badgeText}>Missed</Text>
        </Pressable>
      </View>
    </View>
  );
};

const statusStyles = StyleSheet.create({
  pending: {},
  completed: { borderColor: "#22c55e" },
  missed: { borderColor: "#ef4444" },
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#11111a",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#1f1f2e",
    flexDirection: "row",
    alignItems: "center",
  },
  title: { color: "#fff", fontSize: 18, fontWeight: "600" },
  meta: { color: "#a1a1aa", marginTop: 4, fontSize: 12 },
  actions: { gap: 8, flexDirection: "row" },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, borderWidth: 1, borderColor: "#27272a" },
  badgeActive: { backgroundColor: "#22c55e" },
  badgeDanger: { backgroundColor: "#ef4444" },
  badgeText: { color: "#fff" },
});
