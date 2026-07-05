"use client";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { jobApi } from "@/api/job.api";
import { JobForm } from "@/components/forms/JobForm";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ROUTES } from "@/constants/routes";

export default function EditJobPage({ params }) {
  const { id } = params;
  const { data: job, isLoading } = useQuery({
    queryKey: QUERY_KEYS.JOB(id),
    queryFn: async () => (await jobApi.getJobById(id)).job,
  });
  
  return (
    <div className="pt-8 pb-12 max-w-3xl mx-auto space-y-6 w-full">
      <div className="flex items-center gap-4 mb-2">
        <Link href={ROUTES.RECRUITER_JOBS} className="p-2 -ml-2 rounded-full hover:bg-surface-variant text-on-surface-variant transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="font-headline-lg text-headline-lg font-bold text-on-background">Edit Job</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Update job details and requirements.</p>
        </div>
      </div>
      
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 sm:p-8">
        {isLoading ? (
          <div className="space-y-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-md bg-surface-container-highest" />
            ))}
          </div>
        ) : job ? (
          <JobForm existingData={job} mode="edit" />
        ) : (
          <div className="text-center py-12">
            <p className="text-on-surface-variant font-body-lg">Job not found or you don't have access.</p>
          </div>
        )}
      </div>
    </div>
  );
}
