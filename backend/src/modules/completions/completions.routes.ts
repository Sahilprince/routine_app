import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import { recordCompletion, stats } from "./completions.controller";

export const completionsRouter = Router();

completionsRouter.use(authenticate);
completionsRouter.post("/complete", recordCompletion);
completionsRouter.get("/stats", stats);
