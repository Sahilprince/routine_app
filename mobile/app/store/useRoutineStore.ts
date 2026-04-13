import { create } from "zustand";
import { api } from "../services/api";
import { enqueueAction } from "../services/offline";
import { RoutineFrequency } from "../utils/routine";

export type Routine = {
  _id: string;
  title: string;
  time: string;
  category: string;
  shared: boolean;
  description?: string;
  frequency: RoutineFrequency;
  status?: "pending" | "completed" | "missed";
};

type RoutineState = {
  routines: Routine[];
  routineStatuses: Record<string, "pending" | "completed" | "missed">;
  loading: boolean;
  fetchRoutines: () => Promise<void>;
  createRoutine: (payload: Partial<Routine>) => Promise<void>;
  toggleCompletion: (routineId: string, status: "completed" | "missed") => Promise<void>;
};

export const useRoutineStore = create<RoutineState>((set, get) => ({
  routines: [],
  routineStatuses: {},
  loading: false,
  fetchRoutines: async () => {
    set({ loading: true });
    const { data } = await api.get("/routines");
    const routines = (data.routines ?? []) as Routine[];
    const statuses = routines.reduce<Record<string, "pending" | "completed" | "missed">>((acc, routine) => {
      acc[routine._id] = routine.status ?? "pending";
      return acc;
    }, {});
    set({ routines, routineStatuses: statuses, loading: false });
  },
  createRoutine: async (payload) => {
    await api.post("/routines", payload);
    await get().fetchRoutines();
  },
  toggleCompletion: async (routineId, status) => {
    try {
      await api.post("/tracking/complete", { routineId, status });
    } catch (error) {
      await enqueueAction({ id: Date.now().toString(), path: "/tracking/complete", method: "post", payload: { routineId, status } });
    }
    set((state) => ({
      routineStatuses: { ...state.routineStatuses, [routineId]: status },
    }));
  },
}));
