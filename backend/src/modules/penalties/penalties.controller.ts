import { Request, Response } from "express";
import { Penalty } from "../../models/Penalty";
import { penaltySchema, penaltyStatusSchema } from "./penalties.schema";

export const createPenalty = async (req: Request, res: Response) => {
  const parsed = penaltySchema.parse(req.body);
  const penalty = await Penalty.create({
    assignedBy: req.user!.id,
    assignedTo: parsed.assigneeId,
    description: parsed.description,
  });
  res.status(201).json({ penalty });
};

export const listPenalties = async (req: Request, res: Response) => {
  const penalties = await Penalty.find({
    $or: [{ assignedBy: req.user!.id }, { assignedTo: req.user!.id }],
  }).sort({ createdAt: -1 });
  res.json({ penalties });
};

export const updatePenalty = async (req: Request, res: Response) => {
  const parsed = penaltyStatusSchema.parse(req.body);
  const penalty = await Penalty.findOneAndUpdate(
    { _id: req.params.id, assignedTo: req.user!.id },
    { status: parsed.status },
    { new: true }
  );
  if (!penalty) return res.status(404).json({ message: "Penalty not found" });
  res.json({ penalty });
};
