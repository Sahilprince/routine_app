import { Request, Response } from "express";
import { Routine } from "../../models/Routine";
import { generateSuggestions } from "../../utils/aiSuggestions";

export const aiSuggestions = async (req: Request, res: Response) => {
  const routines = await Routine.find({ userId: req.user!.id });
  const suggestions = generateSuggestions({ routines });
  res.json({ suggestions });
};
