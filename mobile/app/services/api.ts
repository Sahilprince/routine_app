import axios from "axios";
import Constants from "expo-constants";

const FALLBACK_API_URL = "http://localhost:4000/api";
const LOCAL_API_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);
const processEnv = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env;

const getExpoDevServerHost = () => {
  const possibleHostUri =
    Constants.expoConfig?.hostUri ??
    Constants.manifest2?.extra?.expoClient?.hostUri ??
    Constants.manifest?.debuggerHost;

  if (!possibleHostUri) {
    return null;
  }

  return possibleHostUri.split(":")[0] ?? null;
};

const resolveApiBaseUrl = () => {
  const configuredUrl = Constants.expoConfig?.extra?.apiUrl ?? processEnv?.EXPO_PUBLIC_API_URL ?? FALLBACK_API_URL;

  try {
    const url = new URL(configuredUrl);

    if (LOCAL_API_HOSTS.has(url.hostname)) {
      const expoHost = getExpoDevServerHost();
      if (expoHost) {
        url.hostname = expoHost;
      }
    }

    return url.toString().replace(/\/$/, "");
  } catch {
    return configuredUrl;
  }
};

export const apiBaseUrl = resolveApiBaseUrl();

export const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isTimeout = error.code === "ECONNABORTED" || error.message?.toLowerCase().includes("timeout");
    const hasNoResponse = !error.response;

    if (isTimeout || hasNoResponse) {
      error.message = `Unable to reach the API at ${apiBaseUrl}. If you are using a physical phone, set EXPO_PUBLIC_API_URL to your computer's LAN IP, for example http://192.168.1.10:4000/api.`;
    }

    if (error.response?.status === 401) {
      // auto logout handled by store watchers if needed
    }
    return Promise.reject(error);
  }
);
