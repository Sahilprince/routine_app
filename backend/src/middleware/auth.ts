import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { User } from "../models/User";

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, env.jwtSecret) as {
      sub: string;
      email: string;
      partnerId?: string;
    };

    const user = await User.findById(decoded.sub).select("_id email partnerId");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = {
      id: user.id,
      email: user.email,
      partnerId: user.partnerId?.toString(),
    };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalid" });
  }
};
