import { z } from "zod";

export const addressSchema = z.object({
  label: z.string().min(1).default("Principal"),
  recipientName: z.string().min(2),
  phone: z.string().min(8),
  cep: z.string().min(8).max(9),
  street: z.string().min(2),
  number: z.string().min(1),
  complement: z.string().optional(),
  neighborhood: z.string().min(2),
  city: z.string().min(2),
  state: z.string().length(2),
});

export type AddressInput = z.infer<typeof addressSchema>;
