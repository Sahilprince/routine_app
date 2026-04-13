import jwt from "jsonwebtoken";
import { env } from "../config/env";

export const signToken = (payload: { sub: string; email: string; partnerId?: string }) =>
  jwt.sign(payload, env.jwtSecret, { expiresIn: "7d" });
