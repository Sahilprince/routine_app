import { useMemo, useState } from "react";
import { View, Text, Modal, TextInput, Pressable, StyleSheet, FlatList, ScrollView } from "react-native";
import { useRoutineStore } from "../../store/useRoutineStore";
import { RoutineCard } from "../../components/cards/RoutineCard";
import { AppScreen } from "../../components/layout/AppScreen";
import { DEFAULT_CATEGORIES, WEEKDAY_OPTIONS, normalizeDays } from "../../utils/routine";

type FrequencyMode = "daily" | "weekdays" | "custom";

export const RoutinesScreen = () => {
  const routines = useRoutineStore((state) => state.routines);
  const routineStatuses = useRoutineStore((state) => state.routineStatuses);
  const createRoutine = useRoutineStore((state) => state.createRoutine);
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("08:00");
  const [category, setCategory] = useState("Morning");
  const [customCategory, setCustomCategory] = useState("");
  const [frequencyMode, setFrequencyMode] = useState<FrequencyMode>("daily");
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [categoryOpen, setCategoryOpen] = useState(false);

  const categories = useMemo(
    () =>
      [...new Set([...DEFAULT_CATEGORIES, ...routines.map((routine) => routine.category), customCategory.trim()].filter(Boolean))].sort(),
    [customCategory, routines]
  );

  const resetForm = () => {
    setTitle("");
    setTime("08:00");
    setCategory("Morning");
    setCustomCategory("");
    setFrequencyMode("daily");
    setSelectedDays([1, 2, 3, 4, 5]);
    setCategoryOpen(false);
  };

  const toggleDay = (day: number) => {
    setSelectedDays((current) =>
      current.includes(day) ? current.filter((value) => value !== day) : normalizeDays([...current, day])
    );
  };

  const handleCreate = async () => {
    const resolvedCategory = customCategory.trim() || category;
    const frequency =
      frequencyMode === "daily"
        ? { type: "daily" as const }
        : frequencyMode === "weekdays"
          ? { type: "custom" as const, days: [1, 2, 3, 4, 5] }
          : { type: "custom" as const, days: normalizeDays(selectedDays.length ? selectedDays : [new Date().getDay()]) };

    await createRoutine({ title, time, category: resolvedCategory, shared: false, frequency });
    resetForm();
    setVisible(false);
  };

  return (
    <AppScreen style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your routines</Text>
        <Text style={styles.subtitle}>Build repeating flows instead of recreating the same task every day.</Text>
      </View>
      <FlatList
        data={routines}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <RoutineCard routine={item} status={routineStatuses[item._id]} />}
        contentContainerStyle={{ paddingBottom: 120 }}
      />
      <Pressable style={styles.addButton} onPress={() => setVisible(true)}>
        <Text style={styles.addText}>Add Routine</Text>
      </Pressable>
      <Modal visible={visible} animationType="slide">
        <AppScreen style={styles.modalScreen}>
          <ScrollView contentContainerStyle={styles.modal}>
            <Text style={styles.modalTitle}>New Routine</Text>
            <TextInput style={styles.input} placeholder="Title" placeholderTextColor="#a1a1aa" value={title} onChangeText={setTitle} />
            <TextInput style={styles.input} placeholder="Time (HH:mm)" placeholderTextColor="#a1a1aa" value={time} onChangeText={setTime} />

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Category</Text>
              <Pressable style={styles.dropdown} onPress={() => setCategoryOpen((current) => !current)}>
                <Text style={styles.dropdownText}>{customCategory.trim() || category}</Text>
              </Pressable>
              {categoryOpen && (
                <View style={styles.dropdownList}>
                  {categories.map((option) => (
                    <Pressable
                      key={option}
                      style={[styles.dropdownItem, option === category && styles.dropdownItemActive]}
                      onPress={() => {
                        setCategory(option);
                        setCustomCategory("");
                        setCategoryOpen(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{option}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
              <TextInput
                style={styles.input}
                placeholder="Or create a new category"
                placeholderTextColor="#a1a1aa"
                value={customCategory}
                onChangeText={setCustomCategory}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Repeat</Text>
              <View style={styles.choiceRow}>
                {[
                  { label: "Every day", value: "daily" as const },
                  { label: "Weekdays", value: "weekdays" as const },
                  { label: "Custom", value: "custom" as const },
                ].map((option) => (
                  <Pressable
                    key={option.value}
                    style={[styles.choiceChip, frequencyMode === option.value && styles.choiceChipActive]}
                    onPress={() => setFrequencyMode(option.value)}
                  >
                    <Text style={styles.choiceText}>{option.label}</Text>
                  </Pressable>
                ))}
              </View>
              {frequencyMode === "custom" && (
                <View style={styles.dayRow}>
                  {WEEKDAY_OPTIONS.map((day) => (
                    <Pressable
                      key={day.value}
                      style={[styles.dayChip, selectedDays.includes(day.value) && styles.dayChipActive]}
                      onPress={() => toggleDay(day.value)}
                    >
                      <Text style={styles.dayText}>{day.label}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            <Pressable style={styles.button} onPress={handleCreate}>
              <Text style={styles.buttonText}>Save routine</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                resetForm();
                setVisible(false);
              }}
            >
              <Text style={styles.link}>Close</Text>
            </Pressable>
          </ScrollView>
        </AppScreen>
      </Modal>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16 },
  header: { marginBottom: 16 },
  title: { color: "#fff", fontSize: 28, fontWeight: "700" },
  subtitle: { color: "#a1a1aa", marginTop: 6, maxWidth: 280 },
  addButton: {
    backgroundColor: "#7c3aed",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 24,
  },
  addText: { color: "#fff", fontWeight: "700" },
  modalScreen: { paddingHorizontal: 16 },
  modal: { gap: 14, paddingBottom: 32 },
  modalTitle: { color: "#fff", fontSize: 24, fontWeight: "700" },
  input: { backgroundColor: "#11111a", color: "#fff", padding: 14, borderRadius: 14 },
  section: { gap: 10 },
  sectionLabel: { color: "#cbd5e1", fontSize: 14, fontWeight: "600" },
  dropdown: { backgroundColor: "#11111a", padding: 14, borderRadius: 14 },
  dropdownText: { color: "#fff" },
  dropdownList: { backgroundColor: "#11111a", borderRadius: 14, padding: 6 },
  dropdownItem: { padding: 12, borderRadius: 10 },
  dropdownItemActive: { backgroundColor: "#1f2937" },
  dropdownItemText: { color: "#fff" },
  choiceRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  choiceChip: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999, backgroundColor: "#11111a" },
  choiceChipActive: { backgroundColor: "#7c3aed" },
  choiceText: { color: "#fff", fontWeight: "600" },
  dayRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  dayChip: { width: 46, height: 46, borderRadius: 23, backgroundColor: "#11111a", alignItems: "center", justifyContent: "center" },
  dayChipActive: { backgroundColor: "#22c55e" },
  dayText: { color: "#fff", fontWeight: "600" },
  button: { backgroundColor: "#7c3aed", padding: 16, borderRadius: 16, alignItems: "center", marginTop: 8 },
  buttonText: { color: "#fff", fontWeight: "700" },
  link: { color: "#a1a1aa", textAlign: "center", marginTop: 12 },
});
