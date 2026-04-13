import { VictoryChart, VictoryLine, VictoryTheme, VictoryAxis } from "victory-native";
import { View, Text } from "react-native";

interface Props {
  data: Array<{ date: string; completed: number; missed: number }>;
}

export const ConsistencyChart = ({ data }: Props) => {
  if (data.length === 0) {
    return (
      <View style={{ paddingVertical: 24 }}>
        <Text style={{ color: "#a1a1aa", textAlign: "center" }}>No analytics data yet.</Text>
      </View>
    );
  }

  const chartData = data.map((item, index) => ({
    x: index + 1,
    label: typeof item.date === "string" ? item.date.slice(5) : "",
    completed: item.completed,
    missed: item.missed,
  }));

  return (
    <View>
      <VictoryChart theme={VictoryTheme.material}>
        <VictoryAxis
          tickValues={chartData.map((item) => item.x)}
          tickFormat={(tick) => chartData.find((item) => item.x === tick)?.label ?? ""}
          style={{ tickLabels: { fill: "#fff" } }}
        />
        <VictoryAxis dependentAxis style={{ tickLabels: { fill: "#fff" } }} />
        <VictoryLine data={chartData} x="x" y="completed" style={{ data: { stroke: "#7c3aed" } }} />
        <VictoryLine data={chartData} x="x" y="missed" style={{ data: { stroke: "#ef4444" } }} />
      </VictoryChart>
    </View>
  );
};
