import { Router } from "express";

const orderRouter = Router();

orderRouter.post("/v1/healthcheck", async (_req, res) => {
  try {
    const body = {
      status: "ok",
    };
    res.status(200).json(body);
  } catch (err: any) {
    res.status(400).json({
      error: err.message,
    });
  }
});

export default orderRouter;
