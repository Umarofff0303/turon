import { create } from "zustand";

export const useAppStore = create((set) => ({
  telegramUser: null,
  config: {
    restaurantName: import.meta.env.VITE_RESTAURANT_NAME || "Turon Oshxonasi",
    contactPhone: "",
    contactTelegram: "",
  },
  adminKey: localStorage.getItem("turon_admin_key") || "",
  setTelegramUser: (telegramUser) => set({ telegramUser }),
  setConfig: (config) => set({ config }),
  setAdminKey: (adminKey) => {
    localStorage.setItem("turon_admin_key", adminKey);
    set({ adminKey });
  },
  clearAdminKey: () => {
    localStorage.removeItem("turon_admin_key");
    set({ adminKey: "" });
  },
}));
