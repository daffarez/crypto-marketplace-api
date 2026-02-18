import express from "express";
import v1Router from "./routes/v1/index.js";

const app = express();
app.use(express.json());

app.use("/v1", v1Router);

app.listen(9999, () => {
  console.log("server running on port 9999");
});
