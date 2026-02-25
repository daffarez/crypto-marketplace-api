import { Prisma } from "@prisma/client";
import { prisma } from "../db/client.js";
import { ConfirmPaymentDTO } from "../schemas/payment.schema.js";

export async function confirmPayment(data: ConfirmPaymentDTO) {
  const order = await prisma.order.findUnique({
    where: { id: data.orderId },
    include: {
      item: true,
    },
  });

  if (!order) throw new Error("order not found");

  if (order.status === "PAID") return order;
  if (order.status === "EXPIRED") throw new Error("order expired");

  const tx = await prisma.blockchainTransaction.findUnique({
    where: { hash: data.txHash },
  });

  if (!tx) throw new Error("transaction not found");

  if (!tx.confirmed) throw new Error("transaction not confirmed");

  if (tx.toAddress.toLowerCase() !== order.paymentAddress?.toLowerCase())
    throw new Error("wrong recipient address");

  if (new Prisma.Decimal(tx.amount).lessThan(order.item.price)) {
    throw new Error("insufficient amount");
  }

  const updated = await prisma.order.update({
    where: { id: order.id },
    data: {
      status: "PAID",
      blockchainTx: tx.hash,
    },
  });

  return updated;
}
