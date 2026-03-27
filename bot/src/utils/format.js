import { ORDER_STATUS_LABELS } from "../constants/orderStatus.js";

export const formatPrice = (value) => `${Number(value || 0).toLocaleString("uz-UZ")} so'm`;

export const formatOrderRow = (order) => {
  const createdAt = new Date(order.createdAt).toLocaleString("uz-UZ");
  return `#${order.orderNumber} | ${ORDER_STATUS_LABELS[order.status] || order.status} | ${formatPrice(order.totalPrice)} | ${createdAt}`;
};
