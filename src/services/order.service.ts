import { Order } from "@prisma/client";
import { prisma } from "../db/prisma.js";
import { CreateOrderDTO } from "../validators/order.validator.js";

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
      status: "PENDING",
    },
  });

  return { order, created: true };
};
