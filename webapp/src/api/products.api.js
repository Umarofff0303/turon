import { api } from "../lib/axios";

const adminHeaders = (adminKey) => ({ headers: { "x-admin-key": adminKey } });

export const getProducts = async (params = {}) => {
  const { data } = await api.get("/api/products", { params });
  return data;
};

export const getProductById = async (id) => {
  const { data } = await api.get(`/api/products/${id}`);
  return data;
};

export const createProduct = async (payload, adminKey) => {
  const { data } = await api.post("/api/products", payload, adminHeaders(adminKey));
  return data;
};

export const updateProduct = async (id, payload, adminKey) => {
  const { data } = await api.put(`/api/products/${id}`, payload, adminHeaders(adminKey));
  return data;
};

export const deleteProduct = async (id, adminKey) => {
  await api.delete(`/api/products/${id}`, adminHeaders(adminKey));
};
