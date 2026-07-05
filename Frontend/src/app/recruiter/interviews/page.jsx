"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { interviewApi } from "@/api/interview.api";
import { ScheduleInterviewModal } from "@/components/modals/ScheduleInterviewModal";
import { formatDateTime } from "@/utils/dateUtils";
import { cn } from "@/lib/utils";

export default function RecruiterInterviewsPage() {
  const [scheduleOpen, setScheduleOpen] = useState(false);
  
  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.INTERVIEWS,
    queryFn: async () => (await interviewApi.getAllInterviews()).data,
  });
  
  const interviews = data ?? [];

  return (
    <div className="pt-8 pb-12 max-w-container_max mx-auto w-full min-h-[calc(100vh-64px)]">
      {/* Page Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg font-bold text-on-background">Upcoming Interviews</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Manage your scheduled sessions across all open pipelines.</p>
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none bg-surface border border-outline-variant text-on-surface px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-surface-container-low transition-colors shadow-sm flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[18px]">filter_list</span>
            Filter
          </button>
          <button 
            onClick={() => setScheduleOpen(true)}
            className="flex-1 sm:flex-none bg-primary-container text-on-primary px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-tertiary-container transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">calendar_add_on</span>
            Schedule New
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 h-64"></div>
          ))}
        </div>
      ) : interviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-[100px] bg-surface-container-lowest border border-outline-variant rounded-xl mt-6 border-dashed">
          <span className="material-symbols-outlined text-[64px] text-outline-variant/50 mb-6">event_busy</span>
          <h3 className="font-headline-md text-headline-md font-bold text-primary mb-2">No interviews scheduled yet</h3>
          <p className="font-body-md text-body-md text-on-surface-variant mb-8 max-w-md text-center">Your upcoming interview schedule is clear. Start moving candidates through the pipeline by booking a session.</p>
          <button 
            onClick={() => setScheduleOpen(true)}
            className="bg-primary-container text-on-primary px-6 py-2 rounded-lg font-label-md text-label-md hover:bg-tertiary-container transition-colors shadow-sm"
          >
            Schedule your first interview
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interviews.map((interview) => (
            <RecruiterInterviewCard key={interview._id} interview={interview} />
          ))}
        </div>
      )}

      <ScheduleInterviewModal
        open={scheduleOpen}
        onOpenChange={setScheduleOpen}
      />
    </div>
  );
}

function RecruiterInterviewCard({ interview }) {
  const isOnline = interview.mode === "ONLINE";
  const isPending = interview.status === "PENDING" || !interview.meetingLink;
  
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
      {/* Quick Actions overlay */}
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
        <button className="p-1 text-on-surface-variant hover:text-secondary bg-surface rounded-md border border-outline-variant transition-colors" title="Edit">
          <span className="material-symbols-outlined text-[18px]">edit</span>
        </button>
        <button className="p-1 text-on-surface-variant hover:text-error bg-surface rounded-md border border-outline-variant transition-colors" title="Cancel">
          <span className="material-symbols-outlined text-[18px]">cancel</span>
        </button>
      </div>

      <div className="flex items-start gap-4 mb-4 pr-16">
        {interview.candidate?.avatar?.url ? (
          <img src={interview.candidate.avatar.url} alt={interview.candidate.name} className="w-12 h-12 rounded-full object-cover border border-outline-variant" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-primary-fixed-dim text-on-primary-fixed flex items-center justify-center font-headline-sm font-bold border border-outline-variant">
            {interview.candidate?.name?.[0]?.toUpperCase() || "?"}
          </div>
        )}
        <div className="min-w-0">
          <h3 className="font-headline-sm text-headline-sm font-bold text-primary truncate">
            {interview.candidate?.name || "Candidate"}
          </h3>
          <p className="font-helper-text text-helper-text text-on-surface-variant truncate">
            {interview.candidate?.email || "No email"}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Role</p>
        <p className="font-label-md text-label-md text-primary font-semibold truncate">
          {interview.jobTitle || interview.job?.title || "Position"}
        </p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-outline-variant">
        <div className="flex items-center gap-1 text-on-surface-variant bg-surface-container-low px-2 py-1 rounded-md border border-outline-variant/50">
          <span className="material-symbols-outlined text-[16px]">schedule</span>
          <span className="font-helper-text text-helper-text font-medium">{formatDateTime(interview.scheduledAt)}</span>
        </div>
        
        <span className={cn(
          "px-2 py-1 rounded-full border font-label-sm text-label-sm uppercase flex items-center gap-1",
          interview.status === "SCHEDULED" ? "bg-secondary-container/10 text-secondary border-secondary/20" : "bg-outline-variant/20 text-on-surface-variant border-outline-variant/40"
        )}>
          <span className={cn("w-2 h-2 rounded-full", interview.status === "SCHEDULED" ? "bg-secondary" : "bg-outline-variant")}></span> 
          {interview.status === "SCHEDULED" ? "Confirmed" : interview.status}
        </span>
      </div>

      {isOnline ? (
        <a 
          href={interview.meetingLink || "#"}
          target={interview.meetingLink ? "_blank" : undefined}
          rel={interview.meetingLink ? "noopener noreferrer" : undefined}
          className={cn(
            "w-full mt-4 border py-2 rounded-lg font-label-md text-label-md flex items-center justify-center gap-2 transition-colors",
            isPending 
              ? "bg-surface border-outline-variant text-outline-variant cursor-not-allowed" 
              : "bg-surface border-outline-variant text-on-surface hover:bg-surface-container-low group-hover:border-primary"
          )}
          onClick={(e) => isPending && e.preventDefault()}
        >
          <span className="material-symbols-outlined text-[18px]">
            {isPending ? "videocam_off" : "videocam"}
          </span>
          {isPending ? "Link Pending" : "Join Meeting"}
        </a>
      ) : (
        <div className="w-full mt-4 border border-outline-variant text-on-surface py-2 rounded-lg font-label-md text-label-md flex items-center justify-center gap-2 bg-surface cursor-default">
          <span className="material-symbols-outlined text-[18px]">location_on</span>
          In-Person
        </div>
      )}
    </div>
  );
}
