import { Router } from "express";
import { FakeSendSchema } from "../../../schemas/blockchain.schema.js";
import { fakeSend } from "../../../services/blockchain.service.js";

const devRoute = Router();

devRoute.post("/fake-chain/send", async (req, res) => {
  const parsed = FakeSendSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json(parsed.error);
  }

  const tx = await fakeSend(parsed.data);

  res.status(201).json({
    txHash: tx.hash,
    toAddress: tx.toAddress,
    amount: tx.amount,
  });
});

export default devRoute;
