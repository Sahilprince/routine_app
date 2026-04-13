import { Request, Response } from "express";
import { loginSchema, signupSchema } from "./auth.schema";
import { z } from "zod";
import { User } from "../../models/User";
import { comparePassword, hashPassword } from "../../utils/password";
import { signToken } from "../../utils/jwt";

const buildInvite = () => Math.random().toString(36).substring(2, 8).toUpperCase();
const toSafeUser = (user: any) => {
  const plain = user.toObject();
  delete plain.password;
  return plain;
};

export const signup = async (req: Request, res: Response) => {
  const parsed = signupSchema.parse(req.body);
  const exists = await User.findOne({ email: parsed.email });
  if (exists) {
    return res.status(409).json({ message: "Email already registered" });
  }
  const passwordHash = await hashPassword(parsed.password);
  const user = await User.create({
    name: parsed.name,
    email: parsed.email,
    password: passwordHash,
    inviteCode: buildInvite(),
  });
  const token = signToken({ sub: user.id, email: user.email, partnerId: user.partnerId });
  return res.status(201).json({ token, user: toSafeUser(user) });
};

export const login = async (req: Request, res: Response) => {
  const parsed = loginSchema.parse(req.body);
  const user = await User.findOne({ email: parsed.email });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const isValid = await comparePassword(parsed.password, user.password);
  if (!isValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = signToken({ sub: user.id, email: user.email, partnerId: user.partnerId });
  return res.json({ token, user: toSafeUser(user) });
};

export const currentUser = async (req: Request, res: Response) => {
  const user = await User.findById(req.user!.id);
  return res.json({ user: user ? toSafeUser(user) : null });
};

export const savePushToken = async (req: Request, res: Response) => {
  const schema = z.object({ token: z.string() });
  const parsed = schema.parse(req.body);
  const user = await User.findByIdAndUpdate(
    req.user!.id,
    { $addToSet: { notificationTokens: parsed.token } },
    { new: true }
  );
  return res.json({ user: user ? toSafeUser(user) : null });
};
