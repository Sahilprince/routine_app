import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { api } from "../services/api";

type AuthState = {
  token: string | null;
  user: any | null;
  loading: boolean;
  setToken: (token: string | null) => Promise<void>;
  refreshUser: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (payload: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  loading: true,
  setToken: async (token) => {
    if (token) {
      await SecureStore.setItemAsync("token", token);
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      await SecureStore.deleteItemAsync("token");
      delete api.defaults.headers.common.Authorization;
    }
    set({ token });
  },
  refreshUser: async () => {
    const { data } = await api.get("/auth/me");
    set({ user: data.user ?? null });
  },
  login: async (email, password) => {
    set({ loading: true });
    try {
      const { data } = await api.post("/auth/login", { email, password });
      await get().setToken(data.token);
      set({ user: data.user, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
  signup: async (payload) => {
    set({ loading: true });
    try {
      const { data } = await api.post("/auth/signup", payload);
      await get().setToken(data.token);
      set({ user: data.user, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
  logout: async () => {
    await get().setToken(null);
    set({ user: null });
  },
}));

export const loadInitialAuthState = async () => {
  useAuthStore.setState({ loading: true });
  const token = await SecureStore.getItemAsync("token");
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    useAuthStore.setState({ token });
    try {
      const { data } = await api.get("/auth/me");
      useAuthStore.setState({ user: data.user, loading: false });
      return;
    } catch (error) {
      await SecureStore.deleteItemAsync("token");
      useAuthStore.setState({ token: null });
    }
  }
  useAuthStore.setState({ loading: false });
};
