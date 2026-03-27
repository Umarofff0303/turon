import { z } from "zod";

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2),
    slug: z
      .string()
      .min(2)
      .regex(/^[a-z0-9-]+$/, "slug faqat a-z0-9- bo'lishi kerak"),
    image: z.string().url().optional().or(z.literal("")),
  }),
  params: z.object({}),
  query: z.object({}),
});

export const updateCategorySchema = z.object({
  body: z
    .object({
      name: z.string().min(2).optional(),
      slug: z
        .string()
        .min(2)
        .regex(/^[a-z0-9-]+$/, "slug faqat a-z0-9- bo'lishi kerak")
        .optional(),
      image: z.string().url().optional().or(z.literal("")),
    })
    .refine((v) => Object.keys(v).length > 0, { message: "Kamida bitta field yuboring" }),
  params: z.object({
    id: z.string().min(1),
  }),
  query: z.object({}),
});

export const categoryIdSchema = z.object({
  body: z.object({}),
  params: z.object({
    id: z.string().min(1),
  }),
  query: z.object({}),
});
