import { Router } from "express";
import { registerUser } from "../../../services/user.service.js";
import { registerUserSchema } from "../../../validators/user.validator.js";

const userRouter = Router();

userRouter.post("/register", async (req, res) => {
  try {
    const body = registerUserSchema.parse(req.body);

    const user = await registerUser(body.email);

    res.status(201).json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default userRouter;
