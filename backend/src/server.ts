import app from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";
import { logger } from "./config/logger";

const bootstrap = async () => {
  try {
    await connectDB();
    app.listen(env.port, () => logger.info(`API listening on port ${env.port}`));
  } catch (error) {
    logger.error(error, "Failed to start server");
    process.exit(1);
  }
};

void bootstrap();
