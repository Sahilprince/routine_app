import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import { acceptPartner, getPartner, invitePartner } from "./couples.controller";

export const couplesRouter = Router();

couplesRouter.use(authenticate);
couplesRouter.post("/invite", invitePartner);
couplesRouter.post("/accept", acceptPartner);
couplesRouter.get("/partner", getPartner);
