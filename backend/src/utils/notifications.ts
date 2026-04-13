import { logger } from "../config/logger";

export interface NotificationPayload {
  userId: string;
  title: string;
  body: string;
}

export const queueNotification = async (payload: NotificationPayload) => {
  // Integrate Expo push here later
  logger.info({ payload }, "Notification queued");
};
