import { model, Schema, Document } from "mongoose";

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  xp: number;
  level: string;
  streak: number;
  partnerId?: string;
  inviteCode: string;
  badges: string[];
  notificationTokens: string[];
}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    xp: { type: Number, default: 0 },
    level: { type: String, default: "Beginner" },
    streak: { type: Number, default: 0 },
    partnerId: { type: Schema.Types.ObjectId, ref: "User" },
    inviteCode: { type: String, unique: true },
    badges: { type: [String], default: [] },
    notificationTokens: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const User = model<UserDocument>("User", userSchema);
