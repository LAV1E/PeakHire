import { Resend } from "resend";
import config from "../config/config.js";

const resend = new Resend(config.RESEND_API_KEY);

export async function sendEmail(to, subject, text, html) {
  try {
    const data = await resend.emails.send({
      from: "PeakHire <onboarding@resend.dev>",
      to,
      subject,
      html,
      text,
    });

    console.log("✅ Email Sent");
    console.log(data);

    return data;
  } catch (error) {
    console.error("❌ Email Error:", error);
    throw error;
  }
}