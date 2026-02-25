import { z } from "zod";

export const CreateOrderSchema = z.object({
  userId: z.string().uuid(),
  itemId: z.string().uuid(),
});

export type CreateOrderDTO = z.infer<typeof CreateOrderSchema>;
