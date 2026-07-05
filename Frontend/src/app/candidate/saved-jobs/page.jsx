"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { savedJobApi } from "@/api/savedJob.api";
import { JobCard } from "@/components/cards/JobCard";
import { toast } from "sonner";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export default function SavedJobsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.SAVED_JOBS,
    queryFn: async () => (await savedJobApi.list()).savedJobs,
  });
  
  const unsaveMutation = useMutation({
    mutationFn: (id) => savedJobApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SAVED_JOBS });
      toast.success("Job removed from saved");
    },
  });

  return (
    <div className="max-w-container_max mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-background">Saved Jobs</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            You have <span className="font-semibold text-primary">{data?.length ?? 0}</span> saved jobs.
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-64 bg-surface-container rounded-lg animate-pulse" />
          ))}
        </div>
      ) : !data?.length ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-surface-container-lowest border border-outline-variant rounded-lg shadow-sm">
          <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-[32px] text-on-surface-variant">bookmark_border</span>
          </div>
          <h3 className="font-headline-sm text-headline-sm text-on-background mb-2">No saved jobs</h3>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mb-6">
            Save jobs you're interested in to easily find them here later.
          </p>
          <Link href={ROUTES.CANDIDATE_JOBS}>
            <button className="bg-primary text-on-primary px-6 py-2 rounded-lg font-label-md text-label-md hover:bg-primary/90 transition-colors">
              Browse Jobs
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((savedJobItem) => (
            <JobCard
              key={savedJobItem._id}
              job={savedJobItem.job}
              isSaved
              href={ROUTES.CANDIDATE_JOB(savedJobItem.job._id)}
              onUnsave={() => unsaveMutation.mutate(savedJobItem.job._id)}
              showActions
            />
          ))}
        </div>
      )}
    </div>
  );
}
