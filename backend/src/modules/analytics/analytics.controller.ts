import { Request, Response } from "express";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Completion } from "../../models/Completion";
import mongoose from "mongoose";

dayjs.extend(utc);

export const analyticsSummary = async (req: Request, res: Response) => {
  const now = dayjs().utc();
  const weekStart = now.subtract(6, "day").startOf("day");
  const stats = await Completion.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(req.user!.id),
        date: { $gte: weekStart.toDate(), $lte: now.endOf("day").toDate() },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        completed: {
          $sum: {
            $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
          },
        },
        missed: {
          $sum: {
            $cond: [{ $eq: ["$status", "missed"] }, 1, 0],
          },
        },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json({ stats });
};
