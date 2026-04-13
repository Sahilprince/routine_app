import mongoose from "mongoose";
import { env } from "./env";
import { logger } from "./logger";

export const connectDB = async (): Promise<void> => {
  mongoose.set("strictQuery", true);
  await mongoose.connect(env.mongoUri);
  logger.info("MongoDB connected");
};

mongoose.connection.on("error", (err) => {
  logger.error({ err }, "Mongo connection error");
});
