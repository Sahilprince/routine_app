export type Level = "Beginner" | "Pro" | "Beast";

const thresholds = [0, 500, 1500];
const labels: Level[] = ["Beginner", "Pro", "Beast"];

export const awardXp = (status: "completed" | "missed") => (status === "completed" ? 50 : -10);

export const resolveLevel = (xp: number): Level => {
  if (xp >= thresholds[2]) return labels[2];
  if (xp >= thresholds[1]) return labels[1];
  return labels[0];
};

export const resolveBadges = (streak: number, completionRate: number) => {
  const badges: string[] = [];
  if (streak >= 7) badges.push("7-day streak");
  if (completionRate === 1) badges.push("Perfect day");
  if (completionRate >= 0.9) badges.push("No-miss day");
  return badges;
};
