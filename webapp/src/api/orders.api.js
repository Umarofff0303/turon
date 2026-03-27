import { api } from "../lib/axios";

const adminHeaders = (adminKey) => ({ headers: { "x-admin-key": adminKey } });

export const createOrder = async (payload) => {
  const { data } = await api.post("/api/orders", payload);
  return data;
};

export const getUserOrders = async (telegramId) => {
  const { data } = await api.get(`/api/orders/user/${telegramId}`);
  return data;
};

export const getAllOrders = async (adminKey) => {
  const { data } = await api.get("/api/orders", adminHeaders(adminKey));
  return data;
};

export const getOrderById = async (id, adminKey) => {
  const { data } = await api.get(`/api/orders/${id}`, adminHeaders(adminKey));
  return data;
};

export const updateOrderStatus = async (id, status, adminKey) => {
  const { data } = await api.patch(`/api/orders/${id}/status`, { status }, adminHeaders(adminKey));
  return data;
};
