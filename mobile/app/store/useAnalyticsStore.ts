import { create } from "zustand";
import { api } from "../services/api";

interface AnalyticsState {
  stats: Array<{ date: string; completed: number; missed: number }>;
  loading: boolean;
  fetchStats: () => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  stats: [],
  loading: false,
  fetchStats: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get("/analytics/summary");
      const stats = (data.stats ?? []).map((item: any) => ({
        date: typeof item._id === "string" ? item._id : "",
        completed: typeof item.completed === "number" ? item.completed : 0,
        missed: typeof item.missed === "number" ? item.missed : 0,
      }));
      set({ stats, loading: false });
    } catch {
      set({ stats: [], loading: false });
    }
  },
}));
