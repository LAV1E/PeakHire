"use client";
import { cn } from "@/lib/utils";
import { getStatusColor, getStatusLabel } from "@/utils/statusHelpers";
import {
  getJobStatusColor,
  getOfferStatusColor,
  getInterviewStatusColor,
  getModeColor,
} from "@/utils/statusHelpers";
const JOB_STATUS_LABELS = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
  CLOSED: "Closed",
};
const OFFER_STATUS_LABELS = {
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  EXPIRED: "Expired",
};
const INTERVIEW_STATUS_LABELS = {
  SCHEDULED: "Scheduled",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  NO_SHOW: "No Show",
};
const MODE_LABELS = { ONLINE: "Online", OFFLINE: "Offline" };
export function StatusBadge({ status, variant = "application", className }) {
  let colorClass = "";
  let label = status;
  switch (variant) {
    case "application":
      colorClass = getStatusColor(status);
      label = getStatusLabel(status);
      break;
    case "job":
      colorClass = getJobStatusColor(status);
      label = JOB_STATUS_LABELS[status] ?? status;
      break;
    case "offer":
      colorClass = getOfferStatusColor(status);
      label = OFFER_STATUS_LABELS[status] ?? status;
      break;
    case "interview":
      colorClass = getInterviewStatusColor(status);
      label = INTERVIEW_STATUS_LABELS[status] ?? status;
      break;
    case "mode":
      colorClass = getModeColor(status);
      label = MODE_LABELS[status] ?? status;
      break;
  }
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap",
        colorClass,
        className,
      )}
    >
      {" "}
      {label}{" "}
    </span>
  );
}
