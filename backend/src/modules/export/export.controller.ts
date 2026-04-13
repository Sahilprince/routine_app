import { Request, Response } from "express";
import { streamCompletionsCsv } from "../../utils/csvExport";

export const exportCsv = async (req: Request, res: Response) => {
  await streamCompletionsCsv(req.user!.id, res);
};
