import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import { exportCsv } from "./export.controller";

export const exportRouter = Router();

exportRouter.use(authenticate);
exportRouter.get("/csv", exportCsv);
