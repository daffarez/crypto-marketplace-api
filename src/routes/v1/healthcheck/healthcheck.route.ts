import { Router } from "express";

const healthcheckRouter = Router();

healthcheckRouter.get("/", async (_req, res) => {
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

export default healthcheckRouter;
