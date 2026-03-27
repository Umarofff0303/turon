import axios from "axios";
import { env } from "../config/env.js";

const api = axios.create({
  baseURL: env.backendUrl,
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error?.response?.data?.message || error.message || "Backend so'rovida xatolik";
    return Promise.reject(new Error(message));
  }
);

const withAdminHeaders = () => ({
  headers: {
    "x-admin-key": env.adminApiKey,
  },
});

export const registerOrLoginUser = async ({ telegramId, fullName, phone }) => {
  const { data } = await api.post("/api/users/register-or-login", {
    telegramId,
    fullName,
    phone,
  });
  return data;
};

export const getPublicConfig = async () => {
  const { data } = await api.get("/api/config/public");
  return data;
};

export const getUserOrders = async (telegramId) => {
  const { data } = await api.get(`/api/orders/user/${telegramId}`);
  return data;
};

export const getCategories = async () => {
  const { data } = await api.get("/api/categories");
  return data;
};

export const createCategory = async (payload) => {
  const { data } = await api.post("/api/categories", payload, withAdminHeaders());
  return data;
};

export const createProduct = async (payload) => {
  const { data } = await api.post("/api/products", payload, withAdminHeaders());
  return data;
};

export const updateProduct = async (id, payload) => {
  const { data } = await api.put(`/api/products/${id}`, payload, withAdminHeaders());
  return data;
};

export const deleteProduct = async (id) => {
  await api.delete(`/api/products/${id}`, withAdminHeaders());
};

export const getProducts = async () => {
  const { data } = await api.get("/api/products");
  return data;
};

export const getOrders = async () => {
  const { data } = await api.get("/api/orders", withAdminHeaders());
  return data;
};

export const getOrderById = async (id) => {
  const { data } = await api.get(`/api/orders/${id}`, withAdminHeaders());
  return data;
};

export const setOrderStatus = async (orderId, status) => {
  const { data } = await api.patch(
    `/api/orders/${orderId}/status`,
    { status },
    withAdminHeaders()
  );
  return data;
};
