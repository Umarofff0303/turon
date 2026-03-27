import { z } from "zod";

export const registerOrLoginSchema = z.object({
  body: z.object({
    telegramId: z.string().min(2),
    fullName: z.string().optional(),
    phone: z.string().optional(),
  }),
  params: z.object({}),
  query: z.object({}),
});

export const userByTelegramIdSchema = z.object({
  body: z.object({}),
  params: z.object({
    telegramId: z.string().min(2),
  }),
  query: z.object({}),
});
