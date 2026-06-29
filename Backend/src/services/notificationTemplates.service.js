import { createNotification } from "./notification.service.js";

// ======================================================
// Application Notification
// ======================================================

export async function sendApplicationStatusNotification({
  application,
  sender,
  status,
  sendEmailNotification = true,
}) {

  const title = `Application ${status.replace("_", " ")}`;

  const message = `Your application status has been updated to ${status.replace("_", " ")}.`;

  return createNotification({

    recipient: application.candidate,

    sender,

    title,

    message,

    type: "APPLICATION",

    entityId: application._id,

    entityType: "APPLICATION",

    redirectUrl: `/applications/${application._id}`,

    sendEmailNotification,

    emailSubject: title,

    emailHtml: `
        <h2>${title}</h2>
        <p>${message}</p>
    `,

  });

}

// ======================================================
// Interview Scheduled
// ======================================================

export async function sendInterviewScheduledNotification({
  interview,
  sender,
  sendEmailNotification = true,
}) {

  const title =
    "Interview Scheduled";

  const message =
    `Your interview "${interview.title}" has been scheduled on ${new Date(
      interview.scheduledAt
    ).toLocaleString()}.`;

  return createNotification({

    recipient:
      interview.candidate,

    sender,

    title,

    message,

    type: "INTERVIEW",

    entityId:
      interview._id,

    entityType:
      "INTERVIEW",

    redirectUrl:
      `/interviews/${interview._id}`,

    sendEmailNotification,

    emailSubject:
      title,

    emailHtml: `
        <h2>${title}</h2>

        <p>${message}</p>

        <p><b>Mode:</b> ${interview.mode}</p>

        ${
          interview.mode === "ONLINE"
            ? `<p><b>Meeting Link:</b> ${interview.meetingLink}</p>`
            : `<p><b>Location:</b> ${interview.location}</p>`
        }

    `,

  });

}

// ======================================================
// Interview Cancelled
// ======================================================

export async function sendInterviewCancelledNotification({
  interview,
  sender,
  sendEmailNotification = true,
}) {

  const title =
    "Interview Cancelled";

  const message =
    `Your interview "${interview.title}" has been cancelled.`;

  return createNotification({

    recipient:
      interview.candidate,

    sender,

    title,

    message,

    type:
      "INTERVIEW",

    entityId:
      interview._id,

    entityType:
      "INTERVIEW",

    redirectUrl:
      `/interviews/${interview._id}`,

    sendEmailNotification,

    emailSubject:
      title,

    emailHtml: `
        <h2>${title}</h2>

        <p>${message}</p>
    `,

  });

}

// ======================================================
// Offer Notification
// ======================================================

export async function sendOfferNotification({
  offer,
  sender,
  sendEmailNotification = true,
}) {

  const title =
    "Job Offer";

  const message =
    "Congratulations! You have received a job offer.";

  return createNotification({

    recipient:
      offer.candidate,

    sender,

    title,

    message,

    type:
      "OFFER",

    entityId:
      offer._id,

    entityType:
      "OFFER",

    redirectUrl:
      `/offers/${offer._id}`,

    sendEmailNotification,

    emailSubject:
      title,

    emailHtml: `
        <h2>${title}</h2>

        <p>${message}</p>
    `,

  });

}

// ======================================================
// Company Verification
// ======================================================

export async function sendCompanyVerificationNotification({
  company,
  recruiter,
  sender,
  status,
  sendEmailNotification = true,
}) {

  const title =
    `Company ${status}`;

  const message =
    `Your company "${company.name}" has been ${status.toLowerCase()}.`;

  return createNotification({

    recipient:
      recruiter,

    sender,

    title,

    message,

    type:
      "COMPANY",

    entityId:
      company._id,

    entityType:
      "COMPANY",

    redirectUrl:
      `/company/${company._id}`,

    sendEmailNotification,

    emailSubject:
      title,

    emailHtml: `
        <h2>${title}</h2>

        <p>${message}</p>
    `,

  });

}

// ======================================================
// System Notification
// ======================================================

export async function sendSystemNotification({
  recipient,
  sender = null,
  title,
  message,
  redirectUrl = "",
  sendEmailNotification = false,
}) {

  return createNotification({

    recipient,

    sender,

    title,

    message,

    type:
      "SYSTEM",

    redirectUrl,

    sendEmailNotification,

    emailSubject:
      title,

    emailHtml: `
        <h2>${title}</h2>

        <p>${message}</p>
    `,

    isSystemNotification: true,

  });

}