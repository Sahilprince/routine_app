import { useEffect } from "react";
import { View, Text, FlatList, RefreshControl, Pressable, StyleSheet } from "react-native";
import { useRoutineStore } from "../../store/useRoutineStore";
import { useNavigation } from "@react-navigation/native";
import { RoutineCard } from "../../components/cards/RoutineCard";
import { ProgressRing } from "../../components/charts/ProgressRing";
import { AppScreen } from "../../components/layout/AppScreen";
import { useAuthStore } from "../../store/useAuthStore";
import { isRoutineScheduledForDate } from "../../utils/routine";

export const HomeScreen = () => {
  const navigation = useNavigation();
  const user = useAuthStore((state) => state.user);
  const routines = useRoutineStore((state) => state.routines);
  const fetchRoutines = useRoutineStore((state) => state.fetchRoutines);
  const loading = useRoutineStore((state) => state.loading);
  const routineStatuses = useRoutineStore((state) => state.routineStatuses);

  useEffect(() => {
    fetchRoutines();
  }, [fetchRoutines]);

  const todaysRoutines = routines.filter((routine) => isRoutineScheduledForDate(routine.frequency));
  const completed = todaysRoutines.filter((routine) => routineStatuses[routine._id] === "completed").length;
  const missed = todaysRoutines.filter((routine) => routineStatuses[routine._id] === "missed").length;
  const progress = todaysRoutines.length ? Math.round((completed / todaysRoutines.length) * 100) : 0;
  const categories = [...new Set(todaysRoutines.map((routine) => routine.category))];

  return (
    <AppScreen style={styles.container}>
      <FlatList
        data={todaysRoutines}
        keyExtractor={(item) => item._id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchRoutines} />}
        renderItem={({ item }) => <RoutineCard routine={item} status={routineStatuses[item._id]} />}
        ListHeaderComponent={
          <>
            <View style={styles.hero}>
              <View style={{ flex: 1 }}>
                <Text style={styles.eyebrow}>Daily rhythm</Text>
                <Text style={styles.heading}>Hi {user?.name?.split(" ")[0] ?? "there"}</Text>
                <Text style={styles.subheading}>
                  {completed} done, {missed} missed, {Math.max(todaysRoutines.length - completed - missed, 0)} waiting
                </Text>
                <View style={styles.categoryRow}>
                  {categories.slice(0, 3).map((category) => (
                    <View key={category} style={styles.categoryChip}>
                      <Text style={styles.categoryChipText}>{category}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <ProgressRing progress={progress} />
            </View>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Today's routines</Text>
                <Text style={styles.statValue}>{todaysRoutines.length}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Current streak</Text>
                <Text style={styles.statValue}>{user?.streak ?? 0}d</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>XP earned</Text>
                <Text style={styles.statValue}>{user?.xp ?? 0}</Text>
              </View>
            </View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Today's checklist</Text>
              <Pressable onPress={() => navigation.navigate("Analytics" as never)}>
                <Text style={styles.sectionLink}>Open analytics</Text>
              </Pressable>
            </View>
          </>
        }
        ListEmptyComponent={<Text style={styles.empty}>No routines scheduled today. Add one from the routines tab.</Text>}
      />
      <Pressable style={styles.addButton} onPress={() => navigation.navigate("Routines" as never)}>
        <Text style={styles.addText}>+</Text>
      </Pressable>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16 },
  hero: {
    backgroundColor: "#11111a",
    borderRadius: 28,
    padding: 20,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  eyebrow: { color: "#fbbf24", textTransform: "uppercase", letterSpacing: 1, fontSize: 12, marginBottom: 8 },
  heading: { fontSize: 30, fontWeight: "700", color: "#fff" },
  subheading: { color: "#cbd5e1", marginTop: 8, maxWidth: 180 },
  categoryRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 14 },
  categoryChip: { backgroundColor: "#1f2937", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  categoryChipText: { color: "#e2e8f0", fontSize: 12, fontWeight: "600" },
  statsGrid: { flexDirection: "row", gap: 12, marginBottom: 18 },
  statCard: { flex: 1, backgroundColor: "#0f172a", borderRadius: 18, padding: 14 },
  statLabel: { color: "#94a3b8", fontSize: 12, marginBottom: 8 },
  statValue: { color: "#fff", fontSize: 22, fontWeight: "700" },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  sectionTitle: { fontSize: 20, fontWeight: "700", color: "#fff" },
  sectionLink: { color: "#38bdf8", fontWeight: "600" },
  empty: { color: "#71717a", textAlign: "center", marginTop: 32, marginBottom: 80 },
  addButton: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#7c3aed",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  addText: { color: "#fff", fontSize: 32, lineHeight: 32 },
});
