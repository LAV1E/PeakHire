"use client";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { applicationApi } from "@/api/application.api";
import { ApplicationCard } from "@/components/cards/ApplicationCard";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { usePagination } from "@/hooks/usePagination";

export default function CandidateApplicationsPage() {
  const { page, limit, nextPage, prevPage } = usePagination();
  const { data, isLoading } = useQuery({
    queryKey: [...QUERY_KEYS.APPLICATIONS, page],
    queryFn: async () => await applicationApi.getMyApplications(),
  });
  
  const allApplications = data?.data ?? [];
  const applications = allApplications.slice((page - 1) * limit, page * limit);
  const totalPages = Math.ceil((data?.total ?? 0) / limit) || 1;
  const hasNextPage = page < totalPages;
  
  return (
    <div className="max-w-container_max mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-background">My Applications</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            You have submitted <span className="font-semibold text-primary">{data?.total ?? 0}</span> total applications.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-md font-label-md text-label-md text-on-surface hover:bg-surface-container-low transition-colors flex items-center gap-2 shadow-sm">
            <span className="material-symbols-outlined text-[18px]">filter_list</span>
            Filter
          </button>
          <button className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-md font-label-md text-label-md text-on-surface hover:bg-surface-container-low transition-colors flex items-center gap-2 shadow-sm">
            <span className="material-symbols-outlined text-[18px]">sort</span>
            Sort
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 bg-surface-container rounded-lg animate-pulse" />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-surface-container-lowest border border-outline-variant rounded-lg shadow-sm">
          <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-[32px] text-on-surface-variant">work_history</span>
          </div>
          <h3 className="font-headline-sm text-headline-sm text-on-background mb-2">No applications yet</h3>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mb-6">
            You haven't applied to any positions yet. Start exploring open roles to find your next opportunity.
          </p>
          <Link href={ROUTES.CANDIDATE_JOBS}>
            <button className="bg-primary text-on-primary px-6 py-2 rounded-lg font-label-md text-label-md hover:bg-primary/90 transition-colors">
              Browse Jobs
            </button>
          </Link>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {applications.map((app) => (
              <ApplicationCard key={app._id} application={app} />
            ))}
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-outline-variant mt-8 pt-6">
            <div className="hidden sm:block">
              <p className="font-body-md text-body-md text-on-surface-variant">
                Showing <span className="font-medium text-on-surface">{(page - 1) * limit + 1}</span> to <span className="font-medium text-on-surface">{Math.min(page * limit, data?.total ?? 0)}</span> of <span className="font-medium text-on-surface">{data?.total ?? 0}</span> results
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              <button
                className="px-3 py-1 border border-outline-variant rounded-md text-on-surface-variant hover:bg-surface-container-low disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                disabled={page === 1}
                onClick={prevPage}
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                <span className="w-8 h-8 flex items-center justify-center rounded-md bg-secondary text-on-secondary font-label-md text-label-md">
                  {page}
                </span>
                {totalPages > 1 && <span className="text-on-surface-variant font-label-md mx-2">of {totalPages}</span>}
              </div>
              <button
                className="px-3 py-1 border border-outline-variant rounded-md text-on-surface-variant hover:bg-surface-container-low disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                disabled={!hasNextPage}
                onClick={nextPage}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
