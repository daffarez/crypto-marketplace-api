import { Router } from "express";
import healthcheckRouter from "./healthcheck/healthcheck.route.js";
import orderRouter from "./order/order.route.js";
import userRouter from "./user/user.route.js";

const v1Router = Router();

v1Router.use("/orders", orderRouter);
v1Router.use("/healthcheck", healthcheckRouter);
v1Router.use("/user", userRouter);

export default v1Router;
