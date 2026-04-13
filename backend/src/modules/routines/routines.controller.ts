import { Request, Response } from "express";
import { Routine } from "../../models/Routine";
import { routineSchema } from "./routines.schema";
import { Completion } from "../../models/Completion";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export const listRoutines = async (req: Request, res: Response) => {
  const routines = await Routine.find({
    $or: [{ userId: req.user!.id }, { partnerIds: req.user!.id }],
  })
    .sort({ createdAt: -1 })
    .lean();

  const today = dayjs().utc().startOf("day").toDate();
  const routineIds = routines.map((routine) => routine._id);
  const completions = await Completion.find({
    userId: req.user!.id,
    routineId: { $in: routineIds },
    date: today,
  })
    .select("routineId status")
    .lean();

  const statusByRoutine = new Map(
    completions.map((completion) => [String(completion.routineId), completion.status])
  );

  res.json({
    routines: routines.map((routine) => ({
      ...routine,
      status: statusByRoutine.get(String(routine._id)) ?? "pending",
    })),
  });
};

export const createRoutine = async (req: Request, res: Response) => {
  const parsed = routineSchema.parse(req.body);
  const routine = await Routine.create({
    ...parsed,
    userId: req.user!.id,
    partnerIds: parsed.shared && req.user!.partnerId ? [req.user!.partnerId] : [],
  });
  res.status(201).json({ routine });
};

export const updateRoutine = async (req: Request, res: Response) => {
  const parsed = routineSchema.partial().parse(req.body);
  const routine = await Routine.findOneAndUpdate(
    { _id: req.params.id, userId: req.user!.id },
    parsed,
    { new: true }
  );
  if (!routine) return res.status(404).json({ message: "Routine not found" });
  res.json({ routine });
};

export const deleteRoutine = async (req: Request, res: Response) => {
  const deleted = await Routine.findOneAndDelete({ _id: req.params.id, userId: req.user!.id });
  if (!deleted) return res.status(404).json({ message: "Routine not found" });
  res.status(204).send();
};
