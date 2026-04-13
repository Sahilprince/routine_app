import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import { aiSuggestions } from "./ai.controller";

export const aiRouter = Router();

aiRouter.use(authenticate);
aiRouter.get("/suggestions", aiSuggestions);
