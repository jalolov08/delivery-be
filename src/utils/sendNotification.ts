import admin, { messaging } from "firebase-admin";

interface SendNotificationParams {
  token: string;
  title: string;
  body?: string;
  data?: any;
}
export async function sendNotification(
  params: SendNotificationParams
): Promise<void> {
  const { token, title, body, data } = params;

  const message: messaging.Message = {
    notification: {
      title,
      body,
    },
    token,
    data,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("Successfully sent message:", response);
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}
