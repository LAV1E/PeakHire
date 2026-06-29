import NotificationModel from "../models/notification.model.js";
import userModel from "../models/user.model.js";
import { sendEmail } from "./email.service.js";

// =====================================================
// Create Notification
// =====================================================

export async function createNotification({
  recipient,
  recipientEmail = null,
  sender = null,
  title,
  message,
  type,
  entityId = null,
  entityType = null,
  redirectUrl = "",
  sendEmailNotification = false,
  emailSubject = "",
  emailHtml = "",
  isSystemNotification = false,
}) {
  try {
    // Track whether an email was sent
    let emailSent = false;

    // ==========================
    // Create In-App Notification
    // ==========================

    const notification = await NotificationModel.create({
      recipient,
      sender,
      title,
      message,
      type,
      entityId,
      entityType,
      redirectUrl,
      isSystemNotification,
    });

    // ==========================
    // Optional Email
    // ==========================

    if (sendEmailNotification) {
      let email = recipientEmail;

      // Fetch email only if not already provided
      if (!email) {
        const user = await userModel.findById(recipient);
        email = user?.email;
      }

      if (email) {
        await sendEmail(
          email,
          emailSubject || title,
          emailHtml || message
        );

        // Mark email as sent
        emailSent = true;
      }
    }

    return {
      notification,
      emailSent,
    };
  } catch (error) {
    console.error(
      "Notification Service Error:",
      error
    );

    throw error;
  }
}