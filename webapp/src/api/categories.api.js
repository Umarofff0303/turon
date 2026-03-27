import { api } from "../lib/axios";

const adminHeaders = (adminKey) => ({ headers: { "x-admin-key": adminKey } });

export const getCategories = async () => {
  const { data } = await api.get("/api/categories");
  return data;
};

export const createCategory = async (payload, adminKey) => {
  const { data } = await api.post("/api/categories", payload, adminHeaders(adminKey));
  return data;
};

export const updateCategory = async (id, payload, adminKey) => {
  const { data } = await api.put(`/api/categories/${id}`, payload, adminHeaders(adminKey));
  return data;
};

export const deleteCategory = async (id, adminKey) => {
  await api.delete(`/api/categories/${id}`, adminHeaders(adminKey));
};
