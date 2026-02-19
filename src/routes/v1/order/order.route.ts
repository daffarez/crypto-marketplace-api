import { Router } from "express";
import { createOrderSchema } from "../../../validators/order.validator.js";
import { createOrder } from "../../../services/order.service.js";

const orderRouter = Router();

orderRouter.post("/create", async (req, res) => {
  try {
    const body = createOrderSchema.parse(req.body);

    const order = await createOrder(body.userId, body.itemId);

    res.status(201).json(order);
  } catch (err: any) {
    res.status(400).json({
      error: err.message,
    });
  }
});

export default orderRouter;
