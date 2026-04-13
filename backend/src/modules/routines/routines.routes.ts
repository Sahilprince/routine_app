import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import { createRoutine, deleteRoutine, listRoutines, updateRoutine } from "./routines.controller";

export const routinesRouter = Router();

routinesRouter.use(authenticate);
routinesRouter.get("/", listRoutines);
routinesRouter.post("/", createRoutine);
routinesRouter.put("/:id", updateRoutine);
routinesRouter.delete("/:id", deleteRoutine);
