import { Schema, model, Document } from "mongoose";

export interface RoutineDocument extends Document {
  userId: Schema.Types.ObjectId;
  title: string;
  description?: string;
  time: string;
  category: string;
  frequency: {
    type: "daily" | "weekly" | "custom";
    days?: number[];
  };
  shared: boolean;
  partnerIds: Schema.Types.ObjectId[];
}

const routineSchema = new Schema<RoutineDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String },
    time: { type: String, required: true },
    category: { type: String, required: true, trim: true, default: "General" },
    frequency: {
      type: {
        type: String,
        enum: ["daily", "weekly", "custom"],
        default: "daily",
      },
      days: { type: [Number], default: undefined },
    },
    shared: { type: Boolean, default: false },
    partnerIds: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export const Routine = model<RoutineDocument>("Routine", routineSchema);
