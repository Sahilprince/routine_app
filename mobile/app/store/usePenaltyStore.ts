import { create } from "zustand";
import { api } from "../services/api";

export interface Penalty {
  _id: string;
  description: string;
  status: "open" | "completed" | "waived";
  assignedBy: string;
  assignedTo: string;
}

interface PenaltyState {
  penalties: Penalty[];
  fetchPenalties: () => Promise<void>;
  assignPenalty: (payload: { assigneeId: string; description: string }) => Promise<void>;
  updatePenalty: (id: string, status: Penalty["status"]) => Promise<void>;
}

export const usePenaltyStore = create<PenaltyState>((set, get) => ({
  penalties: [],
  fetchPenalties: async () => {
    const { data } = await api.get("/penalties");
    set({ penalties: data.penalties });
  },
  assignPenalty: async (payload) => {
    await api.post("/penalties", payload);
    await get().fetchPenalties();
  },
  updatePenalty: async (id, status) => {
    await api.patch(`/penalties/${id}`, { status });
    await get().fetchPenalties();
  },
}));
