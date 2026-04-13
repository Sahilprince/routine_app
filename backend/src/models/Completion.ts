import { Schema, model, Document } from "mongoose";

export interface CompletionDocument extends Document {
  routineId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  date: Date;
  status: "completed" | "missed" | "pending";
}

const completionSchema = new Schema<CompletionDocument>(
  {
    routineId: { type: Schema.Types.ObjectId, ref: "Routine", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ["completed", "missed", "pending"], default: "pending" },
  },
  { timestamps: true }
);

completionSchema.index({ routineId: 1, userId: 1, date: 1 }, { unique: true });

export const Completion = model<CompletionDocument>("Completion", completionSchema);
