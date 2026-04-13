import { Schema, model, Document } from "mongoose";

export interface PenaltyDocument extends Document {
  assignedBy: Schema.Types.ObjectId;
  assignedTo: Schema.Types.ObjectId;
  description: string;
  status: "open" | "completed" | "waived";
}

const penaltySchema = new Schema<PenaltyDocument>(
  {
    assignedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User", required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ["open", "completed", "waived"], default: "open" },
  },
  { timestamps: true }
);

export const Penalty = model<PenaltyDocument>("Penalty", penaltySchema);
