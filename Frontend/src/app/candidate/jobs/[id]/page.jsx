"use client";
import { use } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { jobApi } from "@/api/job.api";
import { applicationApi } from "@/api/application.api";
import { savedJobApi } from "@/api/savedJob.api";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatDate } from "@/utils/dateUtils";
import { formatSalaryRange } from "@/utils/currencyFormat";
import {
  getEmploymentTypeLabel,
  getExperienceLevelLabel,
} from "@/utils/statusHelpers";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { userApi } from "@/api/user.api";

export default function JobDetailPage({ params }) {
  const { id } = params;
  const queryClient = useQueryClient();
  
  const { data: userProfile } = useQuery({
    queryKey: QUERY_KEYS.ME,
    queryFn: async () => (await userApi.me()).profile,
  });
  
  const { data: jobData, isLoading } = useQuery({
    queryKey: QUERY_KEYS.JOB(id),
    queryFn: async () => (await jobApi.getJobById(id)).job,
  });
  
  const { data: savedJobsData } = useQuery({
    queryKey: QUERY_KEYS.SAVED_JOBS,
    queryFn: async () => (await savedJobApi.list()).savedJobs,
  });
  
  const { data: applications } = useQuery({
    queryKey: QUERY_KEYS.APPLICATIONS,
    queryFn: async () => (await applicationApi.myApplications()).applications,
  });
  
  const isSaved = savedJobsData?.some((j) => j._id === id);
  const existingApplication = applications?.find((a) => a.job?._id === id);
  
  const saveMutation = useMutation({
    mutationFn: () => savedJobApi.save(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SAVED_JOBS });
      toast.success("Job saved!");
    },
  });
  
  const unsaveMutation = useMutation({
    mutationFn: () => savedJobApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SAVED_JOBS });
      toast.success("Job unsaved");
    },
  });
  
  const applyMutation = useMutation({
    mutationFn: () => applicationApi.applyForJob({ jobId: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.APPLICATIONS });
      toast.success("Application submitted!");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to apply");
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-container_max mx-auto space-y-lg p-lg animate-pulse">
        <div className="h-4 bg-surface-container w-32 rounded"></div>
        <div className="h-32 bg-surface-container rounded-xl"></div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
          <div className="lg:col-span-8 h-64 bg-surface-container rounded-xl"></div>
          <div className="lg:col-span-4 h-64 bg-surface-container rounded-xl"></div>
        </div>
      </div>
    );
  }
  
  if (!jobData) return null;

  return (
    <div className="max-w-container_max mx-auto">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex text-on-surface-variant font-body-md text-body-md mb-md">
        <ol className="inline-flex items-center space-x-1 md:space-x-2">
          <li className="inline-flex items-center hover:text-secondary cursor-pointer transition-colors">
            <Link href={ROUTES.CANDIDATE_JOBS}>Jobs</Link>
          </li>
          <li>
            <div className="flex items-center">
              <span className="material-symbols-outlined text-sm mx-1">chevron_right</span>
              <span className="hover:text-secondary cursor-pointer transition-colors line-clamp-1 max-w-[150px]">
                {jobData.company?.name || "Company"}
              </span>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <span className="material-symbols-outlined text-sm mx-1">chevron_right</span>
              <span className="text-on-surface font-medium line-clamp-1 max-w-[200px]">{jobData.title}</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Job Header */}
      <div className="bg-surface rounded-xl border border-outline-variant p-lg lg:p-xl mb-lg shadow-sm flex flex-col md:flex-row gap-lg items-start md:items-center justify-between">
        <div className="flex gap-lg items-center">
          <div className="w-20 h-20 rounded-lg border border-outline-variant overflow-hidden shrink-0 bg-white flex items-center justify-center p-2 shadow-sm">
            {jobData.company?.logo?.url ? (
              <Image
                src={jobData.company.logo.url}
                alt={jobData.company.name}
                width={80}
                height={80}
                className="object-contain max-w-full max-h-full"
              />
            ) : (
              <span className="material-symbols-outlined text-[32px] text-outline">domain</span>
            )}
          </div>
          <div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">{jobData.title}</h2>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-body-md text-body-md text-on-surface-variant">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-outline text-[18px]">location_on</span>
                {jobData.location} {jobData.workplaceType === "REMOTE" && "(Remote)"}
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-outline text-[18px]">schedule</span>
                Posted {formatDate(jobData.createdAt)}
              </div>
              <div className="flex items-center gap-2 font-medium text-on-surface">
                <span className="material-symbols-outlined text-outline text-[18px]">payments</span>
                {formatSalaryRange(jobData.salaryMin, jobData.salaryMax)}
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-sm w-full md:w-auto">
          <span className="bg-surface-container-high text-on-surface px-3 py-1 rounded-full font-label-sm text-label-sm flex items-center">
            {getEmploymentTypeLabel(jobData.employmentType)}
          </span>
          <span className="bg-surface-container-high text-on-surface px-3 py-1 rounded-full font-label-sm text-label-sm flex items-center">
            {getExperienceLevelLabel(jobData.experienceLevel)}
          </span>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg lg:gap-xl items-start">
        {/* Left Column (Main Content) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-8 flex flex-col gap-lg"
        >
          {/* Job Description Section */}
          <section className="bg-surface rounded-xl border border-outline-variant p-lg shadow-sm">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-md">About the Role</h3>
            <div className="font-body-lg text-body-lg text-on-surface-variant space-y-4 whitespace-pre-wrap">
              {jobData.description}
            </div>
          </section>

          {/* Skill Tags Section */}
          {jobData.skills && jobData.skills.length > 0 && (
            <section className="bg-surface rounded-xl border border-outline-variant p-lg shadow-sm">
              <h3 className="font-headline-md text-headline-md text-on-surface mb-md">Skills & Technologies</h3>
              <div className="flex flex-wrap gap-sm">
                {jobData.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 bg-surface-container border border-outline-variant rounded-lg font-label-md text-label-md text-on-surface"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}
        </motion.div>

        {/* Right Column (Sticky Sidebar) */}
        <div className="lg:col-span-4 flex flex-col gap-lg sticky top-24">
          {/* Action Card */}
          <div className="bg-surface rounded-xl border border-outline-variant p-lg shadow-sm flex flex-col gap-md">
            {existingApplication ? (
              <div className="text-center py-2">
                <div className="text-2xl mb-1 text-green-600">
                  <span className="material-symbols-outlined text-[32px]">check_circle</span>
                </div>
                <p className="font-label-md text-label-md font-bold text-on-surface">Applied</p>
                <p className="font-helper-text text-helper-text text-on-surface-variant mt-1">
                  on {formatDate(existingApplication.createdAt)}
                </p>
                <div className="mt-3 inline-block">
                  <StatusBadge status={existingApplication.status} variant="application" />
                </div>
              </div>
            ) : (
              <button
                className="w-full bg-primary-container text-on-primary py-3 px-4 rounded-lg font-label-md text-label-md font-bold hover:bg-primary-container/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                onClick={() => {
                  if (!userProfile?.resume?.url) {
                    toast.error("Please upload your resume in your profile before applying for jobs.");
                    return;
                  }
                  applyMutation.mutate();
                }}
                disabled={applyMutation.isPending}
              >
                {applyMutation.isPending ? "Applying..." : "Apply Now"}
                {!applyMutation.isPending && <span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
              </button>
            )}

            <button
              className="w-full bg-surface border border-outline-variant text-on-surface py-3 px-4 rounded-lg font-label-md text-label-md font-medium hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              onClick={() => (isSaved ? unsaveMutation.mutate() : saveMutation.mutate())}
              disabled={saveMutation.isPending || unsaveMutation.isPending}
            >
              <span className={`material-symbols-outlined text-[18px] ${isSaved ? "icon-fill text-secondary" : ""}`}>
                {isSaved ? "bookmark" : "bookmark_border"}
              </span>
              {isSaved ? "Saved Job" : "Save Job"}
            </button>
          </div>

          {/* Company Info Card */}
          <div className="bg-surface rounded-xl border border-outline-variant p-lg shadow-sm">
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-md">About the Company</h3>
            <div className="flex items-center gap-4 mb-md">
              <div className="w-12 h-12 rounded border border-outline-variant overflow-hidden shrink-0 bg-white flex items-center justify-center p-1">
                {jobData.company?.logo?.url ? (
                  <Image
                    src={jobData.company.logo.url}
                    alt="Company Logo Small"
                    width={48}
                    height={48}
                    className="object-contain max-w-full max-h-full"
                  />
                ) : (
                  <span className="material-symbols-outlined text-[24px] text-outline">domain</span>
                )}
              </div>
              <div>
                <h4 className="font-label-md text-label-md font-bold text-on-surface">{jobData.company?.name || "Company"}</h4>
              </div>
            </div>
            
            <div className="flex flex-col gap-2 mb-md font-body-md text-body-md text-on-surface-variant">
              {jobData.company?.industry && (
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-outline text-[16px]">domain</span>
                  {jobData.company.industry}
                </div>
              )}
              {jobData.company?.location && (
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-outline text-[16px]">location_on</span>
                  {jobData.company.location}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
