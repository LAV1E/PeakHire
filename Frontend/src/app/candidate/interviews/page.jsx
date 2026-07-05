"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { interviewApi } from "@/api/interview.api";
import { formatDateTime } from "@/utils/dateUtils";

export default function CandidateInterviewsPage() {
  const [activeTab, setActiveTab] = useState("upcoming");

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.INTERVIEWS,
    queryFn: async () => await interviewApi.candidateList(),
  });

  const now = new Date();
  const interviews = data?.interviews ?? [];

  const upcoming = interviews.filter(
    (i) => i.status === "SCHEDULED" && new Date(i.scheduledAt) > now,
  );
  
  const past = interviews.filter(
    (i) => i.status !== "SCHEDULED" || new Date(i.scheduledAt) <= now,
  );

  return (
    <div className="pt-8 pb-12 max-w-container_max mx-auto min-h-[calc(100vh-64px)]">
      <header className="mb-8">
        <h1 className="font-headline-lg text-headline-lg font-bold text-on-background mb-6">Interviews</h1>
        {/* Tabs */}
        <div className="flex gap-lg border-b border-outline-variant">
          <button 
            onClick={() => setActiveTab("upcoming")}
            className={`pb-3 border-b-2 font-label-md text-label-md px-1 transition-colors ${
              activeTab === "upcoming" 
                ? "border-secondary text-secondary font-bold" 
                : "border-transparent text-on-surface-variant hover:text-on-background"
            }`}
          >
            Upcoming ({upcoming.length})
          </button>
          <button 
            onClick={() => setActiveTab("past")}
            className={`pb-3 border-b-2 font-label-md text-label-md px-1 transition-colors ${
              activeTab === "past" 
                ? "border-secondary text-secondary font-bold" 
                : "border-transparent text-on-surface-variant hover:text-on-background"
            }`}
          >
            Past ({past.length})
          </button>
        </div>
      </header>

      {/* Tab Content */}
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 h-32"></div>
            ))}
          </div>
        ) : (
          <>
            {activeTab === "upcoming" && (
              <>
                {upcoming.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="w-16 h-16 bg-surface-variant rounded-full flex items-center justify-center mb-4">
                      <span className="material-symbols-outlined text-[32px] text-on-surface-variant">calendar_today</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md font-bold text-on-background mb-2">No interviews found</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
                      You don't have any upcoming interviews scheduled at the moment. We'll notify you when new slots are available.
                    </p>
                  </div>
                ) : (
                  upcoming.map(interview => (
                    <InterviewCard key={interview._id} interview={interview} isUpcoming={true} />
                  ))
                )}
              </>
            )}

            {activeTab === "past" && (
              <div className="opacity-70">
                {past.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="w-16 h-16 bg-surface-variant rounded-full flex items-center justify-center mb-4">
                      <span className="material-symbols-outlined text-[32px] text-on-surface-variant">history</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md font-bold text-on-background mb-2">No past interviews</h3>
                  </div>
                ) : (
                  past.map(interview => (
                    <InterviewCard key={interview._id} interview={interview} isUpcoming={false} />
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function InterviewCard({ interview, isUpcoming }) {
  const isOnline = interview.mode === "ONLINE";
  
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 hover:shadow-sm transition-shadow duration-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-1 rounded-full font-label-sm text-label-sm font-bold ${
              isUpcoming 
                ? "bg-secondary-container bg-opacity-10 text-secondary" 
                : "bg-surface-variant text-on-surface-variant"
            }`}>
              {interview.jobTitle || "Interview"}
            </span>
            <span className="text-on-surface-variant font-helper-text text-helper-text flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">schedule</span> 
              {formatDateTime(interview.scheduledAt)} • {interview.duration} min
            </span>
          </div>
          <h3 className="font-headline-sm text-headline-sm font-bold text-on-background mb-1">
            {interview.companyName || interview.recruiter?.name || "Company"}
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-2">
             with {interview.recruiter?.name || "Recruiter"}
          </p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          {isUpcoming && isOnline && interview.meetingLink ? (
            <a 
              href={interview.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 md:flex-none px-4 py-2 bg-primary-container text-on-primary rounded-lg font-label-md text-label-md hover:bg-opacity-90 transition-colors shadow-sm text-center"
            >
              Join Call
            </a>
          ) : isUpcoming && isOnline ? (
            <button 
              disabled
              className="flex-1 md:flex-none px-4 py-2 bg-primary-container text-on-primary rounded-lg font-label-md text-label-md hover:bg-opacity-90 transition-colors shadow-sm opacity-50 cursor-not-allowed"
            >
              Join Call
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
