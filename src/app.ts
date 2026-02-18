import express from "express";
import orderRouter from "./routes/v1/order/order.route.js";

const app = express();
app.use(express.json());

app.use("/", orderRouter);

app.listen(9999, () => {
  console.log("server running on port 9999");
});
