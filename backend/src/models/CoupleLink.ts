import { Schema, model, Document } from "mongoose";

export interface CoupleLinkDocument extends Document {
  inviterId: Schema.Types.ObjectId;
  inviteeEmail: string;
  code: string;
  status: "pending" | "active";
}

const coupleLinkSchema = new Schema<CoupleLinkDocument>(
  {
    inviterId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    inviteeEmail: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    status: { type: String, enum: ["pending", "active"], default: "pending" },
  },
  { timestamps: true }
);

export const CoupleLink = model<CoupleLinkDocument>("CoupleLink", coupleLinkSchema);
