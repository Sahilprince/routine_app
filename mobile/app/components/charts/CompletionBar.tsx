import { VictoryBar, VictoryChart, VictoryTheme, VictoryAxis } from "victory-native";
import { View } from "react-native";

interface Props {
  data: Array<{ label: string; value: number }>;
}

export const CompletionBar = ({ data }: Props) => (
  <View>
    <VictoryChart theme={VictoryTheme.material} domainPadding={20}>
      <VictoryAxis style={{ axis: { stroke: "#334155" }, tickLabels: { fill: "#fff" } }} />
      <VictoryAxis dependentAxis style={{ axis: { stroke: "#334155" }, grid: { stroke: "#1f2937" }, tickLabels: { fill: "#fff" } }} />
      <VictoryBar
        data={data}
        x="label"
        y="value"
        cornerRadius={8}
        style={{ data: { fill: ({ datum }) => (datum.label === "Missed" ? "#ef4444" : "#22c55e") } }}
      />
    </VictoryChart>
  </View>
);
