import { create } from "zustand";

export const useAppStore = create((set) => ({
  telegramUser: null,
  config: {
    restaurantName: "",
    contactPhone: "",
    contactTelegram: "",
  },
  adminKey: "",
  isAdmin: false,
  setTelegramUser: (telegramUser) => set({ telegramUser }),
  setConfig: (config) => set({ config }),
  setAdminKey: (adminKey) => set({ adminKey }),
  clearAdminKey: () => set({ adminKey: "" }),
  setIsAdmin: (isAdmin) => set({ isAdmin }),
}));
