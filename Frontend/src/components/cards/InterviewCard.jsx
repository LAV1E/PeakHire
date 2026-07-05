import { StatusBadge } from "@/components/common/StatusBadge";
import { formatDate, formatTime } from "@/utils/dateUtils";
import { Calendar, Clock, MapPin, Video, ExternalLink } from "lucide-react";
export function InterviewCard({ interview, showActions = false }) {
  const isUpcoming =
    interview.status === "SCHEDULED" &&
    new Date(interview.scheduledAt) > new Date();
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 transition-shadow duration-200 ease-out hover:shadow-md transition-all">
      {" "}
      <div className="flex items-start justify-between gap-3 mb-3">
        {" "}
        <div>
          {" "}
          <h3 className="font-semibold text-on-surface text-sm">
            {" "}
            {interview.jobTitle || "Interview"}{" "}
          </h3>{" "}
          <p className="text-on-surface-variant text-xs mt-0.5">
            {" "}
            {interview.companyName ||
              (interview.recruiter?.name ?? interview.candidate?.name)}{" "}
          </p>{" "}
        </div>{" "}
        <div className="flex gap-2 flex-shrink-0">
          {" "}
          <StatusBadge status={interview.mode} variant="mode" />{" "}
          <StatusBadge status={interview.status} variant="interview" />{" "}
        </div>{" "}
      </div>{" "}
      <div className="flex flex-wrap gap-3 text-xs text-on-surface-variant mb-3">
        {" "}
        <span className="flex items-center gap-1">
          {" "}
          <Calendar size={12} /> {formatDate(interview.scheduledAt)}{" "}
        </span>{" "}
        <span className="flex items-center gap-1">
          {" "}
          <Clock size={12} /> {formatTime(interview.scheduledAt)} ·{" "}
          {interview.duration} min{" "}
        </span>{" "}
        {interview.mode === "OFFLINE" && interview.location && (
          <span className="flex items-center gap-1">
            {" "}
            <MapPin size={12} /> {interview.location}{" "}
          </span>
        )}{" "}
      </div>{" "}
      {interview.mode === "ONLINE" && interview.meetingLink && isUpcoming && (
        <a
          href={interview.meetingLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
        >
          {" "}
          <Video size={12} /> Join Meeting <ExternalLink size={10} />{" "}
        </a>
      )}{" "}
      {/* Google Calendar Sync — Coming Soon */}{" "}
      <div className="mt-3 pt-3 border-t border-outline-variant/30 ">
        {" "}
        <button
          disabled
          title="Coming Soon"
          className="text-xs text-on-surface-variant/50 cursor-not-allowed flex items-center gap-1"
        >
          {" "}
          <Calendar size={12} /> Add to Google Calendar{" "}
          <span className="ml-1 text-[10px] bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded-full">
            {" "}
            Soon{" "}
          </span>{" "}
        </button>{" "}
      </div>{" "}
    </div>
  );
}
