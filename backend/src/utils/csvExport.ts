import { Response } from "express";
import { Completion } from "../models/Completion";

export const streamCompletionsCsv = async (userId: string, res: Response) => {
  const completions = await Completion.find({ userId }).populate("routineId");
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=completion-export.csv");
  res.write("routineTitle,date,status\n");
  completions.forEach((completion) => {
    const routineTitle = (completion.routineId as any)?.title ?? "";
    res.write(`${routineTitle},${completion.date.toISOString()},${completion.status}\n`);
  });
  res.end();
};
