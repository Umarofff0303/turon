import { api } from "../lib/axios";

export const getBanners = async () => {
  const { data } = await api.get("/api/banners");
  return data;
};

export const getActiveBanners = async () => {
  const { data } = await api.get("/api/banners/active");
  return data;
};

export const createBanner = async (payload) => {
  const { data } = await api.post("/api/banners", payload);
  return data;
};

export const updateBanner = async (id, payload) => {
  const { data } = await api.put(`/api/banners/${id}`, payload);
  return data;
};

export const deleteBanner = async (id) => {
  await api.delete(`/api/banners/${id}`);
};

export const broadcastBanner = async (id) => {
  const { data } = await api.post(`/api/banners/${id}/broadcast`);
  return data;
};
