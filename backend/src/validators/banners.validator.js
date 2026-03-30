import { z } from "zod";

export const createBannerSchema = {
  body: z.object({
    title: z.string().min(2, "Sarlavha kamida 2ta harfdan iborat bo'lishi kerak").max(100),
    description: z.string().max(1000).optional().default(""),
    imageUrl: z.string().url("Noto'g'ri URL format").max(500),
    isActive: z.boolean().default(true),
  }),
};

export const updateBannerSchema = {
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Noto'g'ri Banner ID"),
  }),
  body: z.object({
    title: z.string().min(2).max(100).optional(),
    description: z.string().max(1000).optional(),
    imageUrl: z.string().url().max(500).optional(),
    isActive: z.boolean().optional(),
  }),
};

export const bannerIdSchema = {
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Noto'g'ri Banner ID"),
  }),
};
