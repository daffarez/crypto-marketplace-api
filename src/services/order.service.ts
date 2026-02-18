import { prisma } from "../db/prisma.js";

export const createOrder = async (userId: string, itemId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) throw new Error("User not found");

  const item = await prisma.item.findUnique({
    where: { id: itemId },
  });

  if (!item) throw new Error("Item not found");

  const order = await prisma.order.create({
    data: {
      userId,
      itemId,
    },
  });

  return order;
};
