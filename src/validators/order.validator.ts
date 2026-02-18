import { z } from "zod";

export const createOrderSchema = z.object({
  userId: z.string().uuid(),
  itemId: z.string().uuid(),
});
