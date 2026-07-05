import {
  APPLICATION_STATUS_COLORS,
  APPLICATION_STATUS_LABELS,
} from "@/constants/applicationStatus";

export function getStatusColor(status) {
  return APPLICATION_STATUS_COLORS[status] ?? "bg-gray-100 text-gray-600";
}

export function getStatusLabel(status) {
  return APPLICATION_STATUS_LABELS[status] ?? status;
}

export function getEmploymentTypeLabel(type) {
  const labels = {
    FULL_TIME: "Full-time",
    PART_TIME: "Part-time",
    CONTRACT: "Contract",
    INTERNSHIP: "Internship",
    FREELANCE: "Freelance",
  };
  return labels[type] ?? type;
}

export function getExperienceLevelLabel(level) {
  const labels = {
    ENTRY: "Entry Level",
    JUNIOR: "Junior",
    MID: "Mid Level",
    SENIOR: "Senior Level",
    LEAD: "Lead",
  };
  return labels[level] ?? level;
}

export function getJobStatusColor(status) {
  const colors = {
    PUBLISHED:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    DRAFT: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
    CLOSED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };
  return colors[status] ?? "bg-gray-100 text-gray-600";
}

export function getOfferStatusColor(status) {
  const colors = {
    PENDING:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    ACCEPTED:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    REJECTED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    EXPIRED: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  };
  return colors[status] ?? "bg-gray-100 text-gray-600";
}

export function getInterviewStatusColor(status) {
  const colors = {
    SCHEDULED:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    COMPLETED:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    CANCELLED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    NO_SHOW:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  };
  return colors[status] ?? "bg-gray-100 text-gray-600";
}

export function getModeColor(mode) {
  return mode === "ONLINE"
    ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
    : "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400";
}
