import { z } from "zod";

export const customerSchema = z.object({
  fullName: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().max(40).optional(),
  country: z.string().min(2).max(56),
  city: z.string().min(1).max(80),
  postcode: z.string().min(2).max(16),
  addressLine1: z.string().min(3).max(120),
});

export const createOrderSchema = z.object({
  quantity: z.number().int().min(1).max(5),
  customer: customerSchema,
  integration: z.enum(["revolut_checkout", "hosted_checkout"]),
});

export const localOrderIdSchema = z.object({
  localOrderId: z.string().uuid(),
});

export const simulateSchema = z.object({
  outcome: z.enum(["completed", "failed", "cancelled", "pending"]),
});
