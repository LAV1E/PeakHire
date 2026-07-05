"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { applicationApi } from "@/api/application.api";
import { jobApi } from "@/api/job.api";
import { ApplicationCard } from "@/components/cards/ApplicationCard";
import { usePagination } from "@/hooks/usePagination";

export default function RecruiterApplicationsPage() {
  const { page, limit, nextPage, prevPage } = usePagination();
  const [statusFilter, setStatusFilter] = useState("");
  
  const { data, isLoading } = useQuery({
    queryKey: [...QUERY_KEYS.APPLICATIONS, page, statusFilter],
    queryFn: async () => {
      /* Aggregate */ const jobsRes = await jobApi.getMyJobs();
      const jobs = jobsRes.data || [];
      const appPromises = jobs.map((j) =>
        applicationApi
          .applicationsForJob(j._id)
          .catch(() => ({ applications: [] })),
      );
      const appResults = await Promise.all(appPromises);
      let allApps = appResults.flatMap((r) => r.applications || []);
      if (statusFilter) {
        allApps = allApps.filter((a) => a.status === statusFilter);
      }
      allApps.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      const total = allApps.length;
      const startIndex = (page - 1) * limit;
      const paginatedApps = allApps.slice(startIndex, startIndex + limit);
      return {
        data: paginatedApps,
        total,
        totalPages: Math.ceil(total / limit) || 1,
        hasNextPage: startIndex + limit < total,
      };
    },
  });
  
  const applications = data?.data ?? [];

  return (
    <div className="pt-8 pb-12 max-w-container_max mx-auto space-y-6 min-h-[calc(100vh-64px)] flex flex-col">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg font-bold text-on-background">All Applications</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Review and manage {data?.total ?? 0} candidate submissions.</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 flex flex-wrap gap-4 items-center shadow-sm">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">Status:</label>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-outline-variant rounded-md py-1.5 pl-3 pr-8 bg-surface-container-lowest font-body-md text-body-md text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/20"
          >
            <option value="">All Statuses</option>
            {[
              "APPLIED",
              "UNDER_REVIEW",
              "SHORTLISTED",
              "INTERVIEW",
              "OFFERED",
              "HIRED",
              "REJECTED",
              "WITHDRAWN",
            ].map((s) => (
              <option key={s} value={s}>
                {s.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Application List */}
      <div className="flex flex-col gap-4 flex-1">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-24 bg-surface-container-highest/30 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-outline-variant rounded-lg bg-surface/50 h-64">
            <span className="material-symbols-outlined text-outline-variant text-[48px] mb-4">assignment</span>
            <h3 className="font-headline-sm text-headline-sm font-semibold text-on-background mb-1">No applications found</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">No candidates found for the selected criteria.</p>
            {statusFilter && (
              <button 
                onClick={() => setStatusFilter("")}
                className="px-4 py-2 bg-surface-container-lowest border border-outline-variant text-on-surface rounded-lg font-label-md text-label-md hover:bg-surface-variant transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <ApplicationCard
                key={app._id}
                application={app}
                role="recruiter"
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {(data?.totalPages ?? 1) > 1 && (
        <div className="flex items-center justify-between mt-8 border-t border-outline-variant pt-6">
          <p className="font-helper-text text-helper-text text-on-surface-variant">
            Page <span className="font-medium text-on-background">{page}</span> of <span className="font-medium text-on-background">{data?.totalPages}</span>
          </p>
          <div className="flex items-center gap-2">
            <button 
              disabled={page === 1}
              onClick={prevPage}
              className="p-2 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-variant transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button 
              disabled={!data?.hasNextPage}
              onClick={nextPage}
              className="p-2 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-variant transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
