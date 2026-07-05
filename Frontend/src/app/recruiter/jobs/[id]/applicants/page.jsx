"use client";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { applicationApi } from "@/api/application.api";
import { jobApi } from "@/api/job.api";
import { StatusBadge } from "@/components/common/StatusBadge";
import { AvatarWithFallback } from "@/components/common/AvatarWithFallback";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/utils/dateUtils";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { ArrowLeft } from "lucide-react";

export default function JobApplicantsPage({ params }) {
  const { id } = params;
  const { data: job } = useQuery({
    queryKey: QUERY_KEYS.JOB(id),
    queryFn: async () => (await jobApi.getJobById(id)).job,
  });
  
  const { data, isLoading } = useQuery({
    queryKey: [...QUERY_KEYS.APPLICATIONS, "job", id],
    queryFn: async () =>
      (await applicationApi.applicationsForJob(id)).applications,
  });
  
  const applications = data ?? [];
  
  return (
    <div className="pt-8 pb-12 max-w-container_max mx-auto space-y-6 min-h-[calc(100vh-64px)] w-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              href={ROUTES.RECRUITER_JOBS}
              className="p-1 -ml-1 rounded-full hover:bg-surface-variant text-on-surface-variant transition-colors"
            >
              <ArrowLeft size={18} />
            </Link>
            <span className="font-body-sm text-body-sm text-on-surface-variant uppercase tracking-wider">Back to Jobs</span>
          </div>
          <h2 className="font-headline-lg text-headline-lg font-bold text-on-background">
            {job ? `Applicants — ${job.title}` : "Applicants"}
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            {applications.length} applicant{applications.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl bg-surface-container-highest" />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-outline-variant rounded-xl bg-surface/50 h-64">
          <div className="w-16 h-16 bg-surface-variant rounded-full flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-[32px] text-on-surface-variant">group</span>
          </div>
          <h3 className="font-headline-sm text-headline-sm font-semibold text-on-background mb-1">
            No applicants yet
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
            Share your job posting to attract candidates
          </p>
        </div>
      ) : (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-variant text-on-surface-variant font-label-md text-label-md uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Candidate</th>
                  <th className="px-6 py-4 font-medium hidden sm:table-cell">Applied</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/50">
                {applications.map((app) => (
                  <tr
                    key={app._id}
                    className="transition-colors duration-200 hover:bg-surface-variant/30 group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <AvatarWithFallback
                          src={app.candidate?.avatar}
                          name={app.candidate?.name ?? "?"}
                          size="sm"
                        />
                        <div>
                          <div className="font-label-lg text-label-lg font-medium text-on-surface">
                            {app.candidate?.name}
                          </div>
                          <div className="font-body-sm text-body-sm text-on-surface-variant">
                            {app.candidate?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell font-body-sm text-body-sm text-on-surface-variant">
                      {formatDate(app.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge
                        status={app.status}
                        variant="application"
                      />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={ROUTES.RECRUITER_APPLICATION(app._id)}
                        className="font-label-md text-label-md text-primary hover:text-secondary font-medium inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                      >
                        Review
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
