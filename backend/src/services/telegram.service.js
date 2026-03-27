import axios from "axios";
import { env } from "../config/env.js";
import { ORDER_STATUS_LABELS } from "../constants/orderStatus.js";

const telegramApi = axios.create({
  timeout: 8000,
});

const sendTelegramMessage = async (chatId, text) => {
  if (!env.telegramBotToken || !chatId) {
    return;
  }

  await telegramApi.post(`https://api.telegram.org/bot${env.telegramBotToken}/sendMessage`, {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
  });
};

export const notifyAdminsNewOrder = async (order) => {
  if (!env.telegramAdminChatIds.length) {
    return;
  }

  const text = [
    "<b>Yangi buyurtma keldi</b>",
    `#${order.orderNumber}`,
    `Mijoz: ${order.customerName}`,
    `Telefon: ${order.customerPhone}`,
    `To'lov: ${order.paymentMethod === "cash" ? "Naqd" : "Karta"}`,
    `Summa: ${order.totalPrice.toLocaleString("uz-UZ")} so'm`,
    `Status: ${ORDER_STATUS_LABELS[order.status]}`,
  ].join("\n");

  await Promise.allSettled(env.telegramAdminChatIds.map((chatId) => sendTelegramMessage(chatId, text)));
};

export const notifyUserOrderAccepted = async (telegramUserId, order) => {
  const text = [
    "Buyurtmangiz qabul qilindi ?",
    `Raqam: #${order.orderNumber}`,
    `Jami: ${order.totalPrice.toLocaleString("uz-UZ")} so'm`,
  ].join("\n");

  await sendTelegramMessage(telegramUserId, text);
};

export const notifyUserOrderStatus = async (telegramUserId, orderNumber, status) => {
  const text = `Buyurtma #${orderNumber} holati: ${ORDER_STATUS_LABELS[status]}`;
  await sendTelegramMessage(telegramUserId, text);
};
