"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { jobApi } from "@/api/job.api";
import { savedJobApi } from "@/api/savedJob.api";
import { applicationApi } from "@/api/application.api";
import { useAuthStore } from "@/store/authStore";
import { userApi } from "@/api/user.api";
import { JobCard } from "@/components/cards/JobCard";
import { toast } from "sonner";
import { useJobFilters } from "@/hooks/useJobFilters";
import { ROUTES } from "@/constants/routes";

export default function CandidateJobsPage() {
  const { filters, updateFilter, resetFilters, setPage, activeFilterCount } = useJobFilters();
  const queryClient = useQueryClient();
  
  const { data: userProfile } = useQuery({
    queryKey: QUERY_KEYS.ME,
    queryFn: async () => (await userApi.me()).profile,
  });
  
  const { data, isLoading } = useQuery({
    queryKey: [...QUERY_KEYS.JOBS, filters],
    queryFn: async () => {
      return jobApi.advancedSearch({
        keyword: filters.keyword || filters.search,
        location: filters.location,
        employmentType: filters.employmentType,
        experienceLevel: filters.experienceLevel,
        minSalary: filters.minSalary,
        maxSalary: filters.maxSalary,
        page: filters.page,
        limit: filters.limit,
      });
    },
  });
  
  const { data: savedJobsData } = useQuery({
    queryKey: QUERY_KEYS.SAVED_JOBS,
    queryFn: async () => {
      const res = await savedJobApi.list();
      return res.savedJobs;
    },
  });
  
  const savedJobIds = new Set(savedJobsData?.map((j) => j.job?._id ?? j._id));
  
  const saveMutation = useMutation({
    mutationFn: (id) => savedJobApi.save(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SAVED_JOBS });
      toast.success("Job saved!");
    },
    onError: (error) => {
      const msg = error?.response?.data?.message || "Failed to save job";
      toast.error(msg);
    },
  });
  
  const unsaveMutation = useMutation({
    mutationFn: (id) => savedJobApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SAVED_JOBS });
      toast.success("Job removed from saved");
    },
  });
  
  const applyMutation = useMutation({
    mutationFn: (jobId) =>
      applicationApi.apply(jobId, {
        resume: user?.resume?.url,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.APPLICATIONS });
      toast.success("Application submitted!");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to apply");
    },
  });
  
  const jobs = data?.jobs ?? [];
  const totalPages = data?.totalPages ?? 1;
  const currentPage = filters.page ?? 1;
  
  return (
    <div className="space-y-lg">
      
      {/* AI Banner */}
      <div className="bg-surface-container-low border border-outline-variant rounded-xl p-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container flex-shrink-0">
            <span className="material-symbols-outlined">auto_awesome</span>
          </div>
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">AI-Recommended for you</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">We found personalized roles matching your recent activity and preferences.</p>
          </div>
        </div>
        <button className="bg-surface border border-outline-variant text-on-surface font-label-md text-label-md py-1.5 px-4 rounded-lg hover:shadow-sm hover:border-outline transition-all whitespace-nowrap">
          Review Matches
        </button>
      </div>
      
      {/* Search & Filters Row */}
      <div className="flex flex-wrap items-center gap-3 pb-4 border-b border-outline-variant">
        {/* Search Keyword */}
        <div className="relative flex-1 min-w-[200px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline">search</span>
          <input
            placeholder="Search job title, skill, company..."
            className="w-full bg-surface border border-outline-variant rounded-full py-1.5 pl-9 pr-4 font-body-md text-body-md text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors"
            value={filters.keyword ?? filters.search ?? ""}
            onChange={(e) => updateFilter("keyword", e.target.value)}
          />
        </div>
        
        {/* Location */}
        <div className="relative w-48">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline">location_on</span>
          <input
            placeholder="Location"
            className="w-full bg-surface border border-outline-variant rounded-full py-1.5 pl-9 pr-4 font-body-md text-body-md text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors"
            value={filters.location ?? ""}
            onChange={(e) => updateFilter("location", e.target.value)}
          />
        </div>
        
        {/* Job Type Select */}
        <select
          className="bg-surface border border-outline-variant rounded-full px-4 py-1.5 font-label-md text-label-md text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary appearance-none pr-8 cursor-pointer relative"
          value={filters.employmentType ?? ""}
          onChange={(e) => updateFilter("employmentType", e.target.value || undefined)}
          style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22%2345464d%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20d%3D%22M7%2010l5%205%205-5z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center' }}
        >
          <option value="">Job Type</option>
          <option value="FULL_TIME">Full-time</option>
          <option value="PART_TIME">Part-time</option>
          <option value="CONTRACT">Contract</option>
          <option value="INTERNSHIP">Internship</option>
          <option value="FREELANCE">Freelance</option>
        </select>
        
        {/* Experience Select */}
        <select
          className="bg-surface border border-outline-variant rounded-full px-4 py-1.5 font-label-md text-label-md text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary appearance-none pr-8 cursor-pointer relative"
          value={filters.experienceLevel ?? ""}
          onChange={(e) => updateFilter("experienceLevel", e.target.value || undefined)}
          style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22%2345464d%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20d%3D%22M7%2010l5%205%205-5z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center' }}
        >
          <option value="">Experience</option>
          <option value="ENTRY">Entry Level</option>
          <option value="JUNIOR">Junior</option>
          <option value="MID">Mid Level</option>
          <option value="SENIOR">Senior Level</option>
          <option value="LEAD">Lead</option>
        </select>
        
        {/* Clear Filters */}
        {activeFilterCount > 0 && (
          <button
            onClick={resetFilters}
            className="font-label-sm text-label-sm text-secondary hover:text-secondary-container transition-colors flex items-center gap-1 ml-auto"
          >
            <span className="material-symbols-outlined text-[16px]">filter_list_off</span> Clear All
          </button>
        )}
      </div>

      {/* Results Section */}
      <div className="flex justify-between items-center">
        <p className="font-body-md text-body-md text-on-surface-variant">
          Showing {jobs.length} of {data?.totalJobs ?? 0} jobs
        </p>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-md">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 bg-surface-container rounded-xl animate-pulse" />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center text-on-surface-variant mb-4">
            <span className="material-symbols-outlined text-[32px]">search_off</span>
          </div>
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">No jobs match your filters</h3>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-md">Try adjusting your filters or search terms to find more opportunities.</p>
          <button
            onClick={resetFilters}
            className="mt-6 bg-surface border border-outline-variant text-on-surface font-label-md text-label-md py-2 px-4 rounded-lg hover:bg-surface-container transition-colors"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-md">
            {jobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                isSaved={savedJobIds.has(job._id)}
                href={ROUTES.CANDIDATE_JOB(job._id)}
                onSave={(id) => saveMutation.mutate(id)}
                onUnsave={(id) => unsaveMutation.mutate(id)}
                onApply={(id) => {
                  if (!userProfile?.resume?.url) {
                    toast.error("Please upload your resume in your profile before applying for jobs.");
                    return;
                  }
                  applyMutation.mutate(id);
                }}
              />
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-lg">
              <button
                disabled={currentPage === 1}
                onClick={() => setPage(currentPage - 1)}
                className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              
              <span className="font-label-sm text-label-sm text-on-surface mx-2">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                disabled={currentPage === totalPages}
                onClick={() => setPage(currentPage + 1)}
                className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-on-surface hover:bg-surface-container disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
