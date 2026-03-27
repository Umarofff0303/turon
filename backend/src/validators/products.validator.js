import { z } from "zod";

const optionalUrl = z.string().url().optional().or(z.literal(""));

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    description: z.string().optional(),
    price: z.number().nonnegative(),
    image: optionalUrl,
    category: z.string().min(1),
    isAvailable: z.boolean().optional(),
  }),
  params: z.object({}),
  query: z.object({}),
});

export const updateProductSchema = z.object({
  body: z
    .object({
      name: z.string().min(2).optional(),
      description: z.string().optional(),
      price: z.number().nonnegative().optional(),
      image: optionalUrl,
      category: z.string().min(1).optional(),
      isAvailable: z.boolean().optional(),
    })
    .refine((v) => Object.keys(v).length > 0, { message: "Kamida bitta field yuboring" }),
  params: z.object({ id: z.string().min(1) }),
  query: z.object({}),
});

export const productIdSchema = z.object({
  body: z.object({}),
  params: z.object({ id: z.string().min(1) }),
  query: z.object({}),
});

export const listProductsSchema = z.object({
  body: z.object({}),
  params: z.object({}),
  query: z.object({
    search: z.string().optional(),
    category: z.string().optional(),
    isAvailable: z
      .string()
      .regex(/^(true|false)$/)
      .optional(),
  }),
});
