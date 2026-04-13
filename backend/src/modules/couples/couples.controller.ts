import { Request, Response } from "express";
import { CoupleLink } from "../../models/CoupleLink";
import { User } from "../../models/User";
import { acceptSchema, inviteSchema } from "./couples.schema";

const makeCode = () => Math.random().toString(36).substring(2, 7).toUpperCase();

export const invitePartner = async (req: Request, res: Response) => {
  const parsed = inviteSchema.parse(req.body);
  const code = makeCode();
  await CoupleLink.create({ inviterId: req.user!.id, inviteeEmail: parsed.email, code });
  res.status(201).json({ code });
};

export const acceptPartner = async (req: Request, res: Response) => {
  const parsed = acceptSchema.parse(req.body);
  const invite = await CoupleLink.findOne({ code: parsed.code, status: "pending" });
  if (!invite) return res.status(404).json({ message: "Invite not found" });

  const inviter = await User.findById(invite.inviterId);
  const user = await User.findById(req.user!.id);
  if (!inviter || !user) return res.status(404).json({ message: "Users missing" });

  inviter.partnerId = user.id;
  user.partnerId = inviter.id;
  await inviter.save();
  await user.save();

  invite.status = "active";
  await invite.save();

  res.json({ partner: inviter });
};

export const getPartner = async (req: Request, res: Response) => {
  if (!req.user?.partnerId) return res.json({ partner: null });
  const partner = await User.findById(req.user.partnerId);
  res.json({ partner });
};
