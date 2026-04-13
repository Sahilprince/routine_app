import { useEffect } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { useAnalyticsStore } from "../../store/useAnalyticsStore";
import { ConsistencyChart } from "../../components/charts/ConsistencyChart";
import { CompletionBar } from "../../components/charts/CompletionBar";
import { AppScreen } from "../../components/layout/AppScreen";
import { ProgressRing } from "../../components/charts/ProgressRing";

export const AnalyticsScreen = () => {
  const stats = useAnalyticsStore((state) => state.stats);
  const fetchStats = useAnalyticsStore((state) => state.fetchStats);
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const completedTotal = stats.reduce((acc, curr) => acc + curr.completed, 0);
  const missedTotal = stats.reduce((acc, curr) => acc + curr.missed, 0);
  const attempts = completedTotal + missedTotal;
  const completionRate = attempts ? Math.round((completedTotal / attempts) * 100) : 0;

  return (
    <AppScreen>
      <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <View style={styles.hero}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Analytics</Text>
            <Text style={styles.subtitle}>Track streaks, misses, and your weekly rhythm.</Text>
          </View>
          <ProgressRing progress={completionRate} />
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Done</Text>
            <Text style={styles.statValue}>{completedTotal}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Missed</Text>
            <Text style={styles.statValue}>{missedTotal}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Rate</Text>
            <Text style={styles.statValue}>{completionRate}%</Text>
          </View>
        </View>
        <View style={styles.chartCard}>
          <Text style={styles.sectionTitle}>7-day consistency</Text>
          <ConsistencyChart data={stats} />
        </View>
        <View style={styles.chartCard}>
          <Text style={styles.sectionTitle}>Outcome balance</Text>
          <CompletionBar data={[{ label: "Done", value: completedTotal }, { label: "Missed", value: missedTotal }]} />
        </View>
        <View style={styles.timelineCard}>
          <Text style={styles.sectionTitle}>Daily snapshots</Text>
          {stats.map((item) => (
            <View key={item.date} style={styles.timelineRow}>
              <Text style={styles.timelineDate}>{item.date.slice(5)}</Text>
              <Text style={styles.timelineValue}>{item.completed} completed</Text>
              <Text style={styles.timelineMissed}>{item.missed} missed</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#05050a" },
  hero: { flexDirection: "row", alignItems: "center", backgroundColor: "#11111a", borderRadius: 28, padding: 20, marginBottom: 20 },
  title: { color: "#fff", fontSize: 28, fontWeight: "700", marginBottom: 8 },
  subtitle: { color: "#a1a1aa", fontSize: 15, maxWidth: 180 },
  statsRow: { flexDirection: "row", gap: 12, marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: "#0f172a", borderRadius: 18, padding: 14 },
  statLabel: { color: "#94a3b8", fontSize: 12, marginBottom: 8 },
  statValue: { color: "#fff", fontSize: 22, fontWeight: "700" },
  chartCard: { backgroundColor: "#11111a", borderRadius: 24, padding: 18, marginBottom: 18 },
  timelineCard: { backgroundColor: "#11111a", borderRadius: 24, padding: 18 },
  sectionTitle: { color: "#fff", fontSize: 18, fontWeight: "700", marginBottom: 12 },
  timelineRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#1f2937" },
  timelineDate: { color: "#fff", fontWeight: "600" },
  timelineValue: { color: "#86efac" },
  timelineMissed: { color: "#fca5a5" },
});
