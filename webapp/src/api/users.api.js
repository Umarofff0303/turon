import { api } from "../lib/axios";

export const registerOrLogin = async (payload) => {
  const { data } = await api.post("/api/users/register-or-login", payload);
  return data;
};

export const getUserByTelegramId = async (telegramId) => {
  const { data } = await api.get(`/api/users/${telegramId}`);
  return data;
};
