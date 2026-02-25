import { z } from "zod";

export const FakeSendSchema = z.object({
  toAddress: z.string().min(10),
  amount: z.number().positive(),
});

export type FakeSendDTO = z.infer<typeof FakeSendSchema>;
