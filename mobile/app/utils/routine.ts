export const WEEKDAY_OPTIONS = [
  { label: "Sun", value: 0 },
  { label: "Mon", value: 1 },
  { label: "Tue", value: 2 },
  { label: "Wed", value: 3 },
  { label: "Thu", value: 4 },
  { label: "Fri", value: 5 },
  { label: "Sat", value: 6 },
] as const;

export const DEFAULT_CATEGORIES = ["Morning", "Health", "Work", "Study", "Personal", "Evening"];

export type RoutineFrequency = {
  type: "daily" | "weekly" | "custom";
  days?: number[];
};

export const normalizeDays = (days?: number[]) =>
  [...new Set((days ?? []).filter((day) => day >= 0 && day <= 6))].sort((a, b) => a - b);

export const isRoutineScheduledForDate = (frequency: RoutineFrequency, date = new Date()) => {
  if (frequency.type === "daily") {
    return true;
  }

  const today = date.getDay();
  const days = normalizeDays(frequency.days);
  return days.includes(today);
};

export const getRoutineScheduleLabel = (frequency: RoutineFrequency) => {
  if (frequency.type === "daily") {
    return "Every day";
  }

  const days = normalizeDays(frequency.days);
  if (days.length === 5 && days.join(",") === "1,2,3,4,5") {
    return "Weekdays";
  }
  if (days.length === 7) {
    return "Every day";
  }
  if (days.length === 0) {
    return "Custom";
  }

  return days
    .map((day) => WEEKDAY_OPTIONS.find((option) => option.value === day)?.label ?? "")
    .filter(Boolean)
    .join(", ");
};
