import { Order } from "@prisma/client";
import { prisma } from "../db/client.js";
import { CreateOrderDTO } from "../validators/order.validator.js";
import { addMinutes } from "date-fns";
import { orderQueue } from "../lib/bullmq/client.js";

type CreateOrderResult = {
  order: Order;
  created: boolean;
};

export const createOrder = async (
  data: CreateOrderDTO,
  key: string,
): Promise<CreateOrderResult> => {
  const existing = await prisma.order.findUnique({
    where: { idempotencyKey: key },
  });
  if (existing) return { order: existing, created: false };

  // fake address
  const paymentAddress =
    "0x" + crypto.randomUUID().replace(/-/g, "").slice(0, 40);

  const user = await prisma.user.findUnique({
    where: { id: data.userId },
  });

  if (!user) throw new Error("User not found");

  const item = await prisma.item.findUnique({
    where: { id: data.itemId },
  });

  if (!item) throw new Error("Item not found");

  const order = await prisma.order.create({
    data: {
      userId: data.userId,
      itemId: data.itemId,
      idempotencyKey: key,
      status: "WAITING_PAYMENT",
      paymentAddress,
      expiredAt: addMinutes(new Date(), 15),
    },
  });

  await orderQueue.add(
    "expire-order",
    { orderId: order.id },
    {
      delay: 15 * 60 * 1000,
      jobId: order.id,
    },
  );

  return { order, created: true };
};
