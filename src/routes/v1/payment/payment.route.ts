import { Router } from "express";
import { ConfirmPaymentSchema } from "../../../schemas/payment.schema.js";
import { confirmPayment } from "../../../services/payment.service.js";

const paymentRoute = Router();

paymentRoute.post("/confirm", async (req, res) => {
  const paymentData = ConfirmPaymentSchema.parse(req.body);

  const order = await confirmPayment(paymentData);
  res.json(order);
});

export default paymentRoute;
