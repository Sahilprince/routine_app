import * as FileSystem from "expo-file-system";
import NetInfo from "@react-native-community/netinfo";
import { api } from "./api";

const queueFile = `${FileSystem.documentDirectory}offlineQueue.json`;

export type OfflineAction = {
  id: string;
  path: string;
  method: "post" | "put" | "patch";
  payload: any;
};

export const enqueueAction = async (action: OfflineAction) => {
  const queue = await readQueue();
  queue.push(action);
  await FileSystem.writeAsStringAsync(queueFile, JSON.stringify(queue));
};

const readQueue = async (): Promise<OfflineAction[]> => {
  try {
    const data = await FileSystem.readAsStringAsync(queueFile);
    return JSON.parse(data);
  } catch {
    return [];
  }
};

export const flushQueue = async () => {
  const state = await NetInfo.fetch();
  if (!state.isConnected) return;
  const queue = await readQueue();
  for (const action of queue) {
    if (action.method === "post") {
      await api.post(action.path, action.payload);
    } else if (action.method === "put") {
      await api.put(action.path, action.payload);
    } else {
      await api.patch(action.path, action.payload);
    }
  }
  await FileSystem.deleteAsync(queueFile, { idempotent: true });
};
