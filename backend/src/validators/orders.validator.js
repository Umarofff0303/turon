import { z } from "zod";
import { ORDER_STATUSES } from "../constants/orderStatus.js";

const orderItemSchema = z.object({
  product: z.string().min(1),
  name: z.string().optional(),
  price: z.number().nonnegative().optional(),
  quantity: z.number().int().min(1),
});

export const createOrderSchema = z.object({
  body: z.object({
    telegramUserId: z.string().min(2),
    customerName: z.string().min(2),
    customerPhone: z.string().min(5),
    note: z.string().optional(),
    paymentMethod: z.enum(["cash", "card"]),
    location: z.object({
      lat: z.number(),
      lng: z.number(),
      address: z.string().optional(),
    }),
    items: z.array(orderItemSchema).min(1),
  }),
  params: z.object({}),
  query: z.object({}),
});

export const orderIdSchema = z.object({
  body: z.object({}),
  params: z.object({ id: z.string().min(1) }),
  query: z.object({}),
});

export const ordersByTelegramSchema = z.object({
  body: z.object({}),
  params: z.object({ telegramId: z.string().min(2) }),
  query: z.object({}),
});

export const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.enum(ORDER_STATUSES),
  }),
  params: z.object({ id: z.string().min(1) }),
  query: z.object({}),
});
