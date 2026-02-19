import { Router } from "express";
import { CreateOrderSchema } from "../../../validators/order.validator.js";
import { createOrder } from "../../../services/order.service.js";

const orderRouter = Router();

orderRouter.post("/create", async (req, res) => {
  try {
    const key = req.header("Idempotency-Key");
    if (!key) throw new Error("Idempotency-Key required");

    const body = CreateOrderSchema.parse(req.body);

    const order = await createOrder(body, key);

    res.status(201).json(order);
  } catch (err: any) {
    res.status(400).json({
      error: err.message,
    });
  }
});

export default orderRouter;
