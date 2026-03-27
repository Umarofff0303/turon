import { api } from "../lib/axios";

export const getPublicConfig = async () => {
  const { data } = await api.get("/api/config/public");
  return data;
};
