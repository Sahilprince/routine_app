import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import { currentUser, login, savePushToken, signup } from "./auth.controller";

export const authRouter = Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.get("/me", authenticate, currentUser);
authRouter.post("/push-token", authenticate, savePushToken);
