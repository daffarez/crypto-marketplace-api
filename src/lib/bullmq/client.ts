import { Queue } from "bullmq";
import { redisConnection } from "../redis/client.js";

export const orderQueue = new Queue("order-expiration", {
  connection: redisConnection,
});
