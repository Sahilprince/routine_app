import "dotenv/config";

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000),
  mongoUri: process.env.MONGO_URI ?? "",
  jwtSecret: process.env.JWT_SECRET ?? "",
  expoPushKey: process.env.EXPO_PUSH_KEY,
  openAiKey: process.env.OPENAI_API_KEY,
};

if (!env.mongoUri) {
  throw new Error("Missing MONGO_URI env variable");
}
if (!env.jwtSecret) {
  throw new Error("Missing JWT_SECRET env variable");
}
