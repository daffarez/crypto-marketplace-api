import { Worker } from "bullmq";
import { redisConnection } from "../lib/redis/client.js";
import { prisma } from "../db/client.js";

new Worker(
  "order-expiration",
  async (job) => {
    const { orderId } = job.data;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) return;

    if (order.status === "PAID" || order.status === "CONFIRMED") {
      return;
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status: "EXPIRED" },
    });

    console.log("Order expired:", orderId);
  },
  { connection: redisConnection },
);
