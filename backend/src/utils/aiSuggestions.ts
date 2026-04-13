import { RoutineDocument } from "../models/Routine";

export interface SuggestionInput {
  routines: RoutineDocument[];
}

export interface RoutineSuggestion {
  title: string;
  recommendedTime: string;
  category: string;
  reason: string;
}

export const generateSuggestions = ({ routines }: SuggestionInput): RoutineSuggestion[] => {
  const byCategory = routines.reduce<Record<string, number>>((acc, routine) => {
    acc[routine.category] = (acc[routine.category] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(byCategory).map(([category]) => ({
    title: `Improve your ${category.toLowerCase()} habits`,
    recommendedTime: routines.find((r) => r.category === category)?.time ?? "08:00",
    category,
    reason: `You focus heavily on ${category}, consider batching tasks at the most consistent time.`,
  }));
};
