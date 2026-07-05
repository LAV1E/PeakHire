"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { jobApi } from "@/api/job.api";
import { companyApi } from "@/api/company.api";
import { ConfirmModal } from "@/components/modals/ConfirmModal";
import { toast } from "sonner";
import { formatDate } from "@/utils/dateUtils";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { useState } from "react";

export default function RecruiterJobsPage() {
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState(null);
  
  const { data: company } = useQuery({
    queryKey: QUERY_KEYS.COMPANY,
    queryFn: async () => {
      try {
        return (await companyApi.getMyCompany()).company;
      } catch {
        return null;
      }
    },
  });
  
  const { data: jobs, isLoading } = useQuery({
    queryKey: QUERY_KEYS.JOBS,
    queryFn: async () => (await jobApi.getMyJobs()).data,
    enabled: !!company,
  });

  const publishMutation = useMutation({
    mutationFn: (id) => jobApi.updateJob(id, { status: "PUBLISHED" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.JOBS });
      toast.success("Job published!");
    },
  });

  const unpublishMutation = useMutation({
    mutationFn: (id) => jobApi.updateJob(id, { status: "DRAFT" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.JOBS });
      toast.success("Job unpublished");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => jobApi.deleteJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.JOBS });
      toast.success("Job deleted");
      setDeleteId(null);
    },
  });

  const isVerified = company?.isVerified;

  if (!company) {
    return (
      <div className="pt-8 pb-12 max-w-container_max mx-auto min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="text-center p-8 bg-surface-container-lowest rounded-xl border border-outline-variant max-w-md w-full shadow-sm">
          <div className="w-16 h-16 bg-surface-variant rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-[32px] text-on-surface-variant">lock</span>
          </div>
          <h3 className="font-headline-md text-headline-md font-bold text-on-background mb-2">Create a verified company first</h3>
          <p className="font-body-md text-body-md text-on-surface-variant mb-6">You need a verified company profile before you can start posting jobs.</p>
          <Link href={ROUTES.RECRUITER_COMPANY_CREATE} className="w-full inline-block">
            <button className="w-full bg-primary-container text-on-primary font-label-md text-label-md py-2.5 rounded-lg hover:bg-tertiary-container transition-colors shadow-sm">
              Create Company
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-8 pb-12 max-w-container_max mx-auto space-y-6 min-h-[calc(100vh-64px)] w-full">
      {/* Page Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg font-bold text-on-background">Job Management</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Manage active listings, drafts, and closed positions.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            {isVerified ? (
              <Link href={ROUTES.RECRUITER_JOB_CREATE}>
                <button className="bg-primary-container text-on-primary font-label-md text-label-md py-2.5 px-5 rounded-lg flex items-center justify-center gap-2 hover:bg-tertiary-container transition-colors shadow-sm">
                  <span className="material-symbols-outlined">add</span>
                  Create Job
                </button>
              </Link>
            ) : (
              <>
                <button disabled className="bg-surface-variant text-outline font-label-md text-label-md py-2.5 px-5 rounded-lg flex items-center justify-center gap-2 border border-outline-variant cursor-not-allowed opacity-70">
                  <span className="material-symbols-outlined">add</span>
                  Create Job
                </button>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[200px] bg-inverse-surface text-inverse-on-surface text-center rounded-lg p-2 font-label-sm text-label-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                  Company verification pending
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-inverse-surface"></div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Warning Banner */}
      {!isVerified && (
        <div className="bg-[#FFF8E1] border border-[#FFE082] rounded-lg p-4 flex items-start gap-3 shadow-sm">
          <span className="material-symbols-outlined text-[#FF8F00] mt-0.5">warning</span>
          <div>
            <h3 className="font-label-md text-label-md font-semibold text-[#FF8F00]">Verification Required</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              Your company profile must be verified before you can publish new job postings. This process typically takes 1-2 business days.
            </p>
          </div>
        </div>
      )}

      {/* Data Table Card */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden flex flex-col shadow-sm">
        {/* Table Filters / Toolbar */}
        <div className="p-4 border-b border-outline-variant flex flex-col sm:flex-row justify-between items-center gap-4 bg-surface-bright">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="material-symbols-outlined text-on-surface-variant">filter_list</span>
            <select className="border-outline-variant rounded-md bg-surface text-body-md font-body-md text-on-surface py-1.5 pl-3 pr-8 focus:ring-secondary focus:border-secondary">
              <option>All Statuses</option>
              <option>Published</option>
              <option>Draft</option>
              <option>Closed</option>
            </select>
          </div>
          <div className="relative w-full sm:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
            <input type="text" placeholder="Search jobs..." className="w-full pl-9 pr-3 py-1.5 border border-outline-variant rounded-md bg-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/20 font-body-md text-body-md" />
          </div>
        </div>

        {/* Responsive Table Wrapper */}
        <div className="overflow-x-auto min-h-[300px]">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-surface-container-highest/30 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : !jobs?.length ? (
            <div className="flex flex-col items-center justify-center h-[300px] text-center px-4">
              <div className="w-16 h-16 bg-surface-variant rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[32px] text-on-surface-variant">work_off</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm font-semibold text-on-background mb-1">No jobs posted yet</h3>
              <p className="text-on-surface-variant font-body-md text-body-md mb-6 max-w-sm">Create your first job listing to start receiving applications from candidates.</p>
              {isVerified && (
                <Link href={ROUTES.RECRUITER_JOB_CREATE}>
                  <button className="bg-primary-container text-on-primary px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-tertiary-container transition-colors shadow-sm">
                    Create First Job
                  </button>
                </Link>
              )}
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-[#F8F9FB] border-b border-outline-variant">
                  <th className="py-3 px-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold sticky top-0 bg-[#F8F9FB]">Job Title</th>
                  <th className="py-3 px-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold sticky top-0 bg-[#F8F9FB]">Status</th>
                  <th className="py-3 px-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold sticky top-0 bg-[#F8F9FB]">Applications</th>
                  <th className="py-3 px-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold sticky top-0 bg-[#F8F9FB]">Posted Date</th>
                  <th className="py-3 px-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold sticky top-0 bg-[#F8F9FB] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant font-body-md text-body-md text-on-background">
                {jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-surface-container-low hover:shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] transition-all duration-150">
                    <td className="py-3 px-4">
                      <div className="font-medium text-on-background">{job.title}</div>
                      <div className="font-helper-text text-helper-text text-outline mt-0.5">{job.department || "General"} • {job.location || "Remote"}</div>
                    </td>
                    <td className="py-3 px-4">
                      {job.status === "PUBLISHED" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-label-sm text-label-sm bg-secondary/10 text-secondary border border-secondary/20">
                          Published
                        </span>
                      ) : job.status === "CLOSED" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-label-sm text-label-sm bg-error/10 text-error border border-error/20">
                          Closed
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-label-sm text-label-sm bg-outline-variant/30 text-on-surface-variant border border-outline-variant/50">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-on-surface-variant">View</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-on-surface-variant">{formatDate(job.createdAt)}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={ROUTES.RECRUITER_JOB_APPLICANTS(job._id)}>
                          <button className="p-1.5 text-on-surface-variant hover:text-secondary rounded hover:bg-secondary/10 transition-colors" title="View Applicants">
                            <span className="material-symbols-outlined text-[20px]">group</span>
                          </button>
                        </Link>
                        
                        <button 
                          onClick={() => job.status === "PUBLISHED" ? unpublishMutation.mutate(job._id) : publishMutation.mutate(job._id)}
                          disabled={publishMutation.isPending || unpublishMutation.isPending}
                          className="p-1.5 text-on-surface-variant hover:text-secondary rounded hover:bg-secondary/10 transition-colors" 
                          title={job.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                        >
                          <span className="material-symbols-outlined text-[20px]">{job.status === "PUBLISHED" ? "visibility_off" : "publish"}</span>
                        </button>

                        <Link href={ROUTES.RECRUITER_JOB_EDIT(job._id)}>
                          <button className="p-1.5 text-on-surface-variant hover:text-secondary rounded hover:bg-secondary/10 transition-colors" title="Edit Job">
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                          </button>
                        </Link>
                        
                        <button onClick={() => setDeleteId(job._id)} className="p-1.5 text-on-surface-variant hover:text-error rounded hover:bg-error/10 transition-colors" title="Delete Job">
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <ConfirmModal
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Delete Job"
        description="Are you sure you want to delete this job? All applications for this job will also be affected."
        confirmLabel="Delete"
        onConfirm={() => deleteMutation.mutate(deleteId)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
