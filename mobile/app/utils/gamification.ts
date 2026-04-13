export const levelThresholds = [0, 500, 1500];
export const levelLabels = ["Beginner", "Pro", "Beast Mode"];

export const getLevelFromXp = (xp: number) => {
  if (xp >= levelThresholds[2]) return levelLabels[2];
  if (xp >= levelThresholds[1]) return levelLabels[1];
  return levelLabels[0];
};
