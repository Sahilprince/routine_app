import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import { analyticsSummary } from "./analytics.controller";

export const analyticsRouter = Router();

analyticsRouter.use(authenticate);
analyticsRouter.get("/summary", analyticsSummary);
