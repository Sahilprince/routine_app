import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import { createPenalty, listPenalties, updatePenalty } from "./penalties.controller";

export const penaltiesRouter = Router();

penaltiesRouter.use(authenticate);
penaltiesRouter.get("/", listPenalties);
penaltiesRouter.post("/", createPenalty);
penaltiesRouter.patch("/:id", updatePenalty);
