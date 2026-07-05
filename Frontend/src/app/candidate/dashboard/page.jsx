"use client";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { applicationApi } from "@/api/application.api";
import { interviewApi } from "@/api/interview.api";
import { offerApi } from "@/api/offer.api";
import { savedJobApi } from "@/api/savedJob.api";
import { userApi } from "@/api/user.api";
import { StatCard } from "@/components/cards/StatCard";
import { ApplicationCard } from "@/components/cards/ApplicationCard";
import { InterviewCard } from "@/components/cards/InterviewCard";
import { ProfileCompletionBar } from "@/components/common/ProfileCompletionBar";
import { useAuthStore } from "@/store/authStore";
import { useNotifications } from "@/hooks/useNotifications";
import { formatRelative } from "@/utils/dateUtils";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

const NOTIFICATION_ICONS = {
  COMPANY: "business",
  INTERVIEW: "event",
  OFFER: "featured_seasonal_and_gifts",
  APPLICATION: "description",
  JOB: "work",
  PROFILE: "person",
  SYSTEM: "notifications",
};

export default function CandidateDashboard() {
  const { user: authUser } = useAuthStore();
  const { notifications } = useNotifications();
  
  const { data: userProfile } = useQuery({
    queryKey: QUERY_KEYS.ME,
    queryFn: async () => (await userApi.me()).profile,
  });
  
  const user = userProfile || authUser;
  
  const { data: applications, isLoading: loadingApps } = useQuery({
    queryKey: QUERY_KEYS.APPLICATIONS,
    queryFn: async () => {
      const res = await applicationApi.myApplications();
      return res.applications;
    },
  });
  
  const { data: interviewsData, isLoading: loadingInterviews } = useQuery({
    queryKey: [...QUERY_KEYS.INTERVIEWS, "scheduled"],
    queryFn: async () => await interviewApi.candidateList({ status: "SCHEDULED" }),
  });
  const interviews = interviewsData?.interviews ?? (Array.isArray(interviewsData) ? interviewsData : []);
  
  const { data: savedJobs } = useQuery({
    queryKey: QUERY_KEYS.SAVED_JOBS,
    queryFn: async () => {
      const res = await savedJobApi.list();
      return res.savedJobs;
    },
  });
  
  const { data: offersData } = useQuery({
    queryKey: QUERY_KEYS.OFFERS,
    queryFn: async () => await offerApi.candidateList(),
  });
  const offers = offersData?.offers ?? (Array.isArray(offersData) ? offersData : []);

  const profileSections = [
    { name: "Basic Info", done: !!(user?.name && user?.email) },
    { name: "Bio", done: !!user?.bio },
    { name: "Skills", done: (user?.skills?.length ?? 0) > 0 },
    { name: "Experience", done: (user?.experience?.length ?? 0) > 0 },
    { name: "Education", done: (user?.education?.length ?? 0) > 0 },
    {
      name: "Social Links",
      done: !!(user?.socialLinks?.linkedin || user?.socialLinks?.github),
    },
    { name: "Resume", done: !!user?.resume?.url },
  ];
  
  const completedCount = profileSections.filter((s) => s.done).length;
  const completionPct = Math.round((completedCount / profileSections.length) * 100);
  const pendingOffers = offers?.filter((o) => o.status === "PENDING").length ?? 0;
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
          <p className="font-body-md text-body-md text-on-surface-variant">Here's an overview of your job search activity.</p>
        </div>
      </div>

      <div className="mb-lg">
        <ProfileCompletionBar
          percentage={completionPct}
          completed={completedCount}
          total={profileSections.length}
        />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-md">
        {loadingApps ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-surface-container border border-outline-variant rounded-lg p-lg h-32 animate-pulse" />
          ))
        ) : (
          <>
            <StatCard
              title="Applications"
              value={applications?.length ?? 0}
              icon="description"
            />
            <StatCard
              title="Saved Jobs"
              value={savedJobs?.length ?? 0}
              icon="bookmark"
            />
            <StatCard
              title="Upcoming Interviews"
              value={upcomingInterviews.length}
              icon="event"
            />
            <StatCard
              title="Pending Offers"
              value={pendingOffers}
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
              href={ROUTES.CANDIDATE_APPLICATIONS}
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
            ) : applications?.length === 0 ? (
              <div className="text-center py-12 flex flex-col items-center">
                <span className="material-symbols-outlined text-[48px] text-on-surface-variant mb-2">work_off</span>
                <p className="font-body-md text-on-surface-variant">No applications yet</p>
                <Link
                  href={ROUTES.CANDIDATE_JOBS}
                  className="font-label-md text-secondary hover:underline mt-2"
                >
                  Browse jobs →
                </Link>
              </div>
            ) : (
              <div className="p-md sm:p-lg space-y-3">
                {applications?.slice(0, 5).map((app) => (
                  <ApplicationCard key={app._id} application={app} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Secondary Panel */}
        <div className="flex flex-col gap-lg">
          {/* Upcoming Interviews Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg">
            <div className="flex justify-between items-center mb-md">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Upcoming Interviews</h3>
              <Link href={ROUTES.CANDIDATE_INTERVIEWS} className="text-secondary hover:underline font-label-sm">
                View all
              </Link>
            </div>
            
            <div className="space-y-sm">
              {loadingInterviews ? (
                <div className="h-32 bg-surface-container rounded animate-pulse" />
              ) : upcomingInterviews.length === 0 ? (
                <div className="text-center py-6">
                  <span className="material-symbols-outlined text-[32px] text-on-surface-variant mb-2">event_busy</span>
                  <p className="font-helper-text text-on-surface-variant">No upcoming interviews</p>
                </div>
              ) : (
                upcomingInterviews.slice(0, 2).map((interview) => (
                  <InterviewCard key={interview._id} interview={interview} />
                ))
              )}
            </div>
          </div>

          {/* Notifications Mini Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg flex flex-col overflow-hidden">
            <div className="p-md border-b border-outline-variant/50 flex justify-between items-center bg-surface-bright">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Recent Notifications</h3>
              <Link href={ROUTES.CANDIDATE_NOTIFICATIONS} className="text-secondary hover:underline font-label-sm">
                View all
              </Link>
            </div>
            
            <div className="divide-y divide-outline-variant/30 flex-1">
              {notifications.length === 0 ? (
                <div className="text-center py-6">
                  <span className="material-symbols-outlined text-[32px] text-on-surface-variant mb-2">notifications_paused</span>
                  <p className="font-helper-text text-on-surface-variant">No new notifications</p>
                </div>
              ) : (
                notifications.slice(0, 3).map((notif) => (
                  <div key={notif._id} className="p-3 flex items-start gap-3 hover:bg-surface-container-low transition-colors">
                    <span className="material-symbols-outlined text-secondary mt-1 text-[20px]">
                      {NOTIFICATION_ICONS[notif.type] ?? "notifications"}
                    </span>
                    <div className="flex-1 min-w-0">
                      {notif.title && (
                        <p className="font-label-md text-on-surface mb-0.5 truncate">
                          {notif.title}
                        </p>
                      )}
                      <p className="font-helper-text text-on-surface-variant line-clamp-2">
                        {notif.message}
                      </p>
                      <p className="font-helper-text text-on-surface-variant/70 mt-1 text-[10px]">
                        {formatRelative(notif.createdAt)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
