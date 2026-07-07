import { z } from "zod";
import { addressSchema } from "@/lib/validations/address";

export const createOrderSchema = z.object({
  addressId: z.string().optional(),
  address: addressSchema.omit({ label: true }).optional(),
  guestContact: z
    .object({
      name: z.string().min(2),
      email: z.string().email(),
      phone: z.string().min(8),
    })
    .optional(),
  shipping: z.object({
    carrierName: z.string().min(1),
    serviceName: z.string().min(1),
    price: z.number().min(0),
    estimatedDays: z.number().int().min(0),
  }),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
