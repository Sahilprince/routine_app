import Svg, { Circle } from "react-native-svg";
import { View, Text } from "react-native";

interface Props {
  progress: number;
}

export const ProgressRing = ({ progress }: Props) => {
  const size = 140;
  const stroke = 12;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <View style={{ alignItems: "center", justifyContent: "center", marginVertical: 16 }}>
      <Svg width={size} height={size}>
        <Circle stroke="#1f1f2e" fill="transparent" strokeWidth={stroke} cx={size / 2} cy={size / 2} r={radius} />
        <Circle
          stroke="#7c3aed"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          cx={size / 2}
          cy={size / 2}
          r={radius}
        />
      </Svg>
      <Text style={{ color: "#fff", position: "absolute", fontSize: 24, fontWeight: "600" }}>{progress}%</Text>
    </View>
  );
};
