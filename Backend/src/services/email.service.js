// import nodemailer from 'nodemailer'
// import config from '../config/config.js';

// // export const transporter = nodemailer.createTransport({
// //   service: 'gmail',
// //   auth: {
// //     type: 'OAuth2',
// //     user: process.env.GOOGLE_USER,
// //     clientId: process.env.GOOGLE_CLIENT_ID,
// //     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
// //     refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
// //   },
// // });

// export const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false,
//   auth: {
//     type: "OAuth2",
//     user: config.GOOGLE_USER,
//     clientId: config.GOOGLE_CLIENT_ID,
//     clientSecret: config.GOOGLE_CLIENT_SECRET,
//     refreshToken: config.GOOGLE_REFRESH_TOKEN,
//   },
//   connectionTimeout: 10000,
//   greetingTimeout: 10000,
//   socketTimeout: 10000,
// });

// // Verify the connection configuration
// transporter.verify((error, success) => {
//   if (error) {
//     console.error('Error connecting to email server:', error);
//   } else {
//     console.log('Email server is ready to send messages');
//   }
// });

// // Function to send email
// export const sendEmail = async (to, subject, text, html) => {
//   try {
//     const info = await transporter.sendMail({
//       from: `"Peak Hire" <${process.env.GOOGLE_USER}>`,
//       to,
//       subject,
//       text,
//       html,
//     });

//     console.log("Message sent:", info.messageId);
//     return info;
//   } catch (error) {
//     console.error("Error sending email:", error);
//     throw error;
//   }
// };




import nodemailer from "nodemailer";
import config from "../config/config.js";

// Create SMTP Transport
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.GOOGLE_USER,
    pass: config.GOOGLE_APP_PASSWORD,
  },
});
console.log("consoleee fro testing....")
// Verify SMTP Connection
transporter.verify((error) => {
  if (error) {
    console.error("❌ SMTP Connection Error:", error);
  } else {
    console.log("✅ SMTP Connected Successfully");
  }
});

// Send Email
export async function sendEmail(to, subject, text, html) {
  try {
    const info = await transporter.sendMail({
      from: `"PeakHire" <${config.GOOGLE_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("✅ Email Sent:", info.messageId);

    return info;
  } catch (error) {
    console.error("❌ Error Sending Email:", error);
    throw error;
  }
}