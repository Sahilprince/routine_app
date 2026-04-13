import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { ZodError } from "zod";
import { logger } from "../config/logger";

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  logger.error(err);
  if (err instanceof ZodError) {
    return res.status(400).json({ message: "Validation error", issues: err.flatten() });
  }
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({ message: err.message });
  }
  return res.status(500).json({ message: "Internal server error" });
};
