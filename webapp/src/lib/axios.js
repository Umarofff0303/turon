import axios from "axios";

const localhostHosts = new Set(["localhost", "127.0.0.1", "0.0.0.0"]);

const rawBaseURL = (import.meta.env.VITE_API_URL || "").trim();

const resolveBaseURL = () => {
  if (rawBaseURL) {
    return rawBaseURL;
  }

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return "/";
};

const getConfigurationError = () => {
  if (typeof window === "undefined" || !rawBaseURL) {
    return "";
  }

  const appHost = window.location.hostname;
  if (!appHost || localhostHosts.has(appHost)) {
    return "";
  }

  try {
    const parsedUrl = new URL(rawBaseURL, window.location.origin);
    if (localhostHosts.has(parsedUrl.hostname)) {
      return "Mini App tashqi URL orqali ochilgan, lekin API `localhost` ga ulangan. `webapp/.env` ichida `VITE_API_URL=/` qiling yoki public backend URL kiriting.";
    }
  } catch {
    return "";
  }

  return "";
};

const configurationError = getConfigurationError();

export const api = axios.create({
  baseURL: resolveBaseURL(),
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  if (configurationError) {
    return Promise.reject(new Error(configurationError));
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error?.response?.data?.message || error.message || "So'rovda xatolik";
    return Promise.reject(new Error(message));
  }
);
