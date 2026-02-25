import { z } from "zod";

export const ConfirmPaymentSchema = z.object({
  orderId: z.string(),
  paymentAddress: z.string(),
  txHash: z.string(),
});

export type ConfirmPaymentDTO = z.infer<typeof ConfirmPaymentSchema>;
