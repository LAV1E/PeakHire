"use client";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/api/admin.api";
import { StatCard } from "@/components/cards/StatCard";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => (await adminApi.getDashboard()).dashboard,
  });

  return (
    <div className="space-y-xl">
      {/* Page Header */}
      <div className="flex justify-between items-end mb-lg">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-1">Metrics Dashboard</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">System-wide overview and recent activity.</p>
        </div>
        <div className="hidden sm:flex gap-md">
          <button className="bg-surface-container-lowest border border-outline-variant text-on-surface hover:bg-surface-variant transition-all duration-150 py-2 px-4 rounded font-label-md text-label-md shadow-sm">
            Export Report
          </button>
        </div>
      </div>

      {/* Metrics Row (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-surface-container border border-outline-variant rounded-lg p-lg h-32 animate-pulse" />
          ))
        ) : (
          <>
            <StatCard
              title="Total Users"
              value={stats?.totalUsers ?? 0}
              icon="group"
              trend={{ isPositive: true, value: 12 }}
            />
            <StatCard
              title="Companies"
              value={stats?.totalCompanies ?? 0}
              icon="business"
              trend={{ isPositive: true, value: 5 }}
            />
            <StatCard
              title="Active Jobs"
              value={stats?.totalJobs ?? 0}
              icon="work"
              trend={{ isPositive: true, value: 0 }}
            />
            <StatCard
              title="Applications"
              value={stats?.totalApplications ?? 0}
              icon="description"
              trend={{ isPositive: true, value: 24 }}
            />
          </>
        )}
      </div>

      {/* Recent Activity Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg mt-xl">
        {/* Main Activity Feed */}
        <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-lg flex flex-col h-full">
          <div className="p-md sm:p-lg border-b border-outline-variant bg-surface-bright rounded-t-lg sticky top-0 z-10 flex justify-between items-center">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Recent System Activity</h3>
            <button className="text-secondary hover:text-secondary-fixed-variant transition-colors text-label-sm font-label-sm uppercase">View All</button>
          </div>
          <div className="p-0 flex-1 overflow-y-auto">
            {/* Activity Item 1 */}
            <div className="flex items-start gap-md p-md sm:p-lg border-b border-outline-variant/50 hover:bg-surface-bright transition-colors duration-150 min-h-[72px] group">
              <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">business</span>
              </div>
              <div className="flex-1">
                <p className="font-body-md text-body-md text-on-surface"><span className="font-medium">New company 'TechFlow' registered</span></p>
                <p className="font-helper-text text-helper-text text-on-surface-variant mt-1">2 mins ago</p>
              </div>
              <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-on-surface-variant hover:text-secondary">
                <span className="material-symbols-outlined text-[18px]">more_vert</span>
              </button>
            </div>
            
            {/* Activity Item 2 */}
            <div className="flex items-start gap-md p-md sm:p-lg border-b border-outline-variant/50 hover:bg-surface-bright transition-colors duration-150 min-h-[72px] group">
              <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">description</span>
              </div>
              <div className="flex-1">
                <p className="font-body-md text-body-md text-on-surface"><span className="font-medium">50 new applications</span> for 'Senior Backend Engineer'</p>
                <p className="font-helper-text text-helper-text text-on-surface-variant mt-1">15 mins ago</p>
              </div>
            </div>

            {/* Activity Item 3 */}
            <div className="flex items-start gap-md p-md sm:p-lg hover:bg-surface-bright transition-colors duration-150 min-h-[72px] group">
              <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">person_off</span>
              </div>
              <div className="flex-1">
                <p className="font-body-md text-body-md text-on-surface">Admin <span className="font-medium">'Sarah Jenkins'</span> deactivated user 'John Doe'</p>
                <p className="font-helper-text text-helper-text text-on-surface-variant mt-1">1 hour ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Panel */}
        <div className="flex flex-col gap-lg">
          {/* Quick Actions Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg">
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-md">Quick Actions</h3>
            <div className="space-y-sm">
              <button className="w-full flex items-center gap-3 p-3 rounded border border-outline-variant hover:bg-surface-variant transition-all text-left group">
                <div className="bg-surface-container p-2 rounded group-hover:bg-white transition-colors">
                  <span className="material-symbols-outlined text-on-surface text-[20px]">person_add</span>
                </div>
                <span className="font-label-md text-label-md text-on-surface">Invite Admin User</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded border border-outline-variant hover:bg-surface-variant transition-all text-left group">
                <div className="bg-surface-container p-2 rounded group-hover:bg-white transition-colors">
                  <span className="material-symbols-outlined text-on-surface text-[20px]">domain_add</span>
                </div>
                <span className="font-label-md text-label-md text-on-surface">Onboard Company</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded border border-outline-variant hover:bg-surface-variant transition-all text-left group">
                <div className="bg-surface-container p-2 rounded group-hover:bg-white transition-colors">
                  <span className="material-symbols-outlined text-on-surface text-[20px]">assessment</span>
                </div>
                <span className="font-label-md text-label-md text-on-surface">Generate Custom Report</span>
              </button>
            </div>
          </div>

          {/* System Status Mini Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-full -mr-4 -mt-4 opacity-50 pointer-events-none"></div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-sm relative z-10">System Status</h3>
            <div className="flex items-center gap-2 mb-4 relative z-10">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
              <span className="font-label-md text-label-md text-green-700">All Systems Operational</span>
            </div>
            <div className="flex justify-between items-center text-helper-text font-helper-text text-on-surface-variant border-t border-outline-variant/50 pt-3 mt-2 relative z-10">
              <span>Uptime</span>
              <span className="font-medium text-on-surface">99.99%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
