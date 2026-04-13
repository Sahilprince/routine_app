import { Request, Response } from "express";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { completionSchema } from "./completions.schema";
import { Completion } from "../../models/Completion";
import { awardXp, resolveLevel } from "../../utils/gamification";
import { User } from "../../models/User";
import mongoose from "mongoose";

dayjs.extend(utc);

export const recordCompletion = async (req: Request, res: Response) => {
  const parsed = completionSchema.parse(req.body);
  const date = dayjs().utc().startOf("day").toDate();
  const completion = await Completion.findOneAndUpdate(
    { routineId: parsed.routineId, userId: req.user!.id, date },
    { $set: { status: parsed.status, userId: req.user!.id } },
    { new: true, upsert: true }
  );

  const xpDelta = awardXp(parsed.status);
  const user = await User.findById(req.user!.id);
  if (user) {
    user.xp += xpDelta;
    if (parsed.status === "completed") {
      user.streak += 1;
    } else {
      user.streak = 0;
    }
    user.level = resolveLevel(user.xp);
    await user.save();
  }

  res.json({ completion, user });
};

export const stats = async (req: Request, res: Response) => {
  const from = req.query.from ? dayjs(String(req.query.from)).toDate() : dayjs().utc().subtract(7, "day").toDate();
  const to = req.query.to ? dayjs(String(req.query.to)).toDate() : dayjs().utc().endOf("day").toDate();

  const data = await Completion.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(req.user!.id), date: { $gte: from, $lte: to } } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const completed = data.find((d) => d._id === "completed")?.count ?? 0;
  const missed = data.find((d) => d._id === "missed")?.count ?? 0;
  const total = completed + missed;
  const completionRate = total ? completed / total : 0;

  res.json({ completed, missed, completionRate });
};
