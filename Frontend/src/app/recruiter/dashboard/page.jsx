"use client";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { companyApi } from "@/api/company.api";
import { applicationApi } from "@/api/application.api";
import { interviewApi } from "@/api/interview.api";
import { offerApi } from "@/api/offer.api";
import { jobApi } from "@/api/job.api";
import { StatCard } from "@/components/cards/StatCard";
import { ApplicationCard } from "@/components/cards/ApplicationCard";
import { InterviewCard } from "@/components/cards/InterviewCard";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export default function RecruiterDashboard() {
  const { user } = useAuthStore();
  
  const { data: company, isLoading: loadingCompany } = useQuery({
    queryKey: QUERY_KEYS.COMPANY,
    queryFn: async () => {
      try {
        return (await companyApi.getMyCompany()).company;
      } catch {
        return null;
      }
    },
  });
  
  const { data: jobs } = useQuery({
    queryKey: QUERY_KEYS.JOBS,
    queryFn: async () => (await jobApi.getMyJobs()).data,
    enabled: !!company,
  });
  
  const { data: applications, isLoading: loadingApps } = useQuery({
    queryKey: QUERY_KEYS.APPLICATIONS,
    queryFn: async () => {
      const res = await applicationApi.myApplications();
      return { data: res.applications, total: res.totalApplications };
    },
    enabled: !!company,
  });
  
  const { data: interviews, isLoading: loadingInterviews } = useQuery({
    queryKey: QUERY_KEYS.INTERVIEWS,
    queryFn: async () => (await interviewApi.getAllInterviews({ limit: 3 })).data,
    enabled: !!company,
  });
  
  const { data: offers } = useQuery({
    queryKey: QUERY_KEYS.OFFERS,
    queryFn: async () => {
      const res = await offerApi.recruiterList();
      return res.offers;
    },
    enabled: !!company,
  });

  const upcomingInterviews = (interviews ?? []).filter(
    (i) => i.status === "SCHEDULED" && new Date(i.scheduledAt) > new Date(),
  );

  return (
    <div className="space-y-xl">
      {/* Page Header */}
      <div className="flex justify-between items-end mb-lg">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-1">
            Welcome back, {user?.name?.split(" ")[0] ?? "there"}! 👋
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Manage your hiring pipeline</p>
        </div>
        <div className="hidden sm:flex gap-md">
          {company && company.isVerified && (
            <Link
              href={ROUTES.RECRUITER_JOB_CREATE}
              className="bg-secondary text-on-secondary hover:opacity-90 transition-opacity py-2 px-4 rounded font-label-md text-label-md shadow-sm"
            >
              + Create Job
            </Link>
          )}
        </div>
      </div>

      {/* Company status banners */}
      {!loadingCompany && !company && (
        <div className="bg-surface-container-low border border-secondary/30 rounded-lg p-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <span className="material-symbols-outlined text-secondary text-[24px]">domain</span>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">Create your company to get started</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Set up your company profile to start posting jobs and receiving applications.</p>
            </div>
          </div>
          <Link href={ROUTES.RECRUITER_COMPANY_CREATE} className="bg-secondary text-on-secondary py-2 px-4 rounded font-label-md whitespace-nowrap">
            Create Company →
          </Link>
        </div>
      )}

      {company && !company.isVerified && (
        <div className="bg-error-container/30 border border-error-container rounded-lg p-lg flex items-start gap-4">
          <span className="material-symbols-outlined text-error text-[20px]">error</span>
          <div>
            <h3 className="font-label-md text-label-md text-on-surface mb-1">Awaiting admin approval</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">Your company is under review. Job posting will be enabled once verified.</p>
          </div>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-md">
        {loadingCompany ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-surface-container border border-outline-variant rounded-lg p-lg h-32 animate-pulse" />
          ))
        ) : (
          <>
            <StatCard
              title="Status"
              value={company ? company.isVerified ? "Verified" : "Pending" : "—"}
              icon="domain"
            />
            <StatCard
              title="Total Jobs"
              value={jobs?.length ?? 0}
              icon="work"
            />
            <StatCard
              title="Applications"
              value={applications?.total ?? 0}
              icon="description"
            />
            <StatCard
              title="Interviews"
              value={upcomingInterviews.length}
              icon="event"
            />
            <StatCard
              title="Pending Offers"
              value={(Array.isArray(offers) ? offers : []).filter((o) => o.status === "PENDING").length}
              icon="featured_seasonal_and_gifts"
            />
          </>
        )}
      </div>

      {/* Main Activity Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg mt-xl">
        {/* Main Activity Feed (Recent Applications) */}
        <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-lg flex flex-col h-full">
          <div className="p-md sm:p-lg border-b border-outline-variant bg-surface-bright rounded-t-lg sticky top-0 z-10 flex justify-between items-center">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Recent Applications</h3>
            <Link
              href={ROUTES.RECRUITER_APPLICATIONS}
              className="text-secondary hover:text-secondary-fixed-variant transition-colors text-label-sm font-label-sm uppercase"
            >
              View All
            </Link>
          </div>
          <div className="p-0 flex-1 overflow-y-auto">
            {loadingApps ? (
              <div className="p-md sm:p-lg space-y-4">
                <div className="h-16 bg-surface-container rounded animate-pulse" />
                <div className="h-16 bg-surface-container rounded animate-pulse" />
              </div>
            ) : (applications?.data ?? []).length === 0 ? (
              <div className="text-center py-12 flex flex-col items-center">
                <span className="material-symbols-outlined text-[48px] text-on-surface-variant mb-2">description</span>
                <p className="font-body-md text-on-surface-variant">No applications yet</p>
              </div>
            ) : (
              <div className="p-md sm:p-lg space-y-3">
                {(applications?.data ?? []).slice(0, 5).map((app) => (
                  <ApplicationCard key={app._id} application={app} role="recruiter" />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Secondary Panel */}
        <div className="flex flex-col gap-lg">
          {/* Upcoming Interviews Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg flex flex-col h-full">
            <div className="flex justify-between items-center mb-md">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Upcoming Interviews</h3>
              <Link href={ROUTES.RECRUITER_INTERVIEWS} className="text-secondary hover:underline font-label-sm uppercase">
                View all
              </Link>
            </div>
            
            <div className="space-y-sm flex-1">
              {loadingInterviews ? (
                <div className="h-32 bg-surface-container rounded animate-pulse" />
              ) : upcomingInterviews.length === 0 ? (
                <div className="text-center py-6 h-full flex flex-col items-center justify-center">
                  <span className="material-symbols-outlined text-[32px] text-on-surface-variant mb-2">event_busy</span>
                  <p className="font-helper-text text-on-surface-variant">No upcoming interviews</p>
                </div>
              ) : (
                upcomingInterviews.slice(0, 3).map((interview) => (
                  <InterviewCard key={interview._id} interview={interview} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
