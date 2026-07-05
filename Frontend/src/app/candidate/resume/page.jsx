"use client";
import { useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { userApi } from "@/api/user.api";
import { aiApi } from "@/api/ai.api";
import { toast } from "sonner";
import { formatDateTime } from "@/utils/dateUtils";

export default function CandidateResumePage() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);

  const { data: user, isLoading } = useQuery({
    queryKey: QUERY_KEYS.ME,
    queryFn: async () => (await userApi.me()).profile,
  });

  const uploadMutation = useMutation({
    mutationFn: (file) => userApi.uploadResume(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ME });
      toast.success("Resume uploaded successfully!");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to upload resume");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => userApi.deleteResume(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ME });
      toast.success("Resume deleted successfully!");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to delete resume");
    },
  });

  const analyzeMutation = useMutation({
    mutationFn: () => aiApi.resumeAnalysis(),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ME });
      toast.success(data?.cached ? "Loaded cached analysis." : "Resume analyzed successfully!");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to analyze resume");
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be under 5MB");
      return;
    }
    uploadMutation.mutate(file);
  };

  if (isLoading) {
    return (
      <div className="max-w-container_max mx-auto h-full flex flex-col animate-pulse">
        <div className="mb-6 h-12 bg-surface-container rounded-lg w-1/4"></div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
          <div className="lg:col-span-8 bg-surface-container rounded-lg h-[600px]"></div>
          <div className="lg:col-span-4 bg-surface-container rounded-lg h-[400px]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-container_max mx-auto h-full flex flex-col pb-12">
      {/* Page Header */}
      <div className="mb-6 flex flex-col gap-2">
        <div className="flex justify-between items-end">
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Resume Management</h2>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        {/* Left Column: Filled State (Resume Viewer) */}
        <div className="lg:col-span-8 flex flex-col bg-surface-container-lowest border border-outline-variant rounded-lg shadow-sm overflow-hidden min-h-[600px] h-full">
          {/* Toolbar */}
          <div className="px-4 py-3 border-b border-outline-variant bg-surface-bright flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary text-[24px]">description</span>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface truncate max-w-[200px] sm:max-w-sm">
                  {user?.resume?.url ? "My_Resume.pdf" : "No Resume Uploaded"}
                </h3>
                <p className="font-helper-text text-helper-text text-on-surface-variant">
                  {user?.updatedAt ? `Last updated ${formatDateTime(user.updatedAt)}` : "Please upload a resume"}
                </p>
              </div>
              {user?.resume?.url && (
                <span className="ml-2 px-2 py-1 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm border border-outline-variant/50">
                  Active
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadMutation.isPending}
                className="bg-surface-container-lowest border border-outline-variant text-primary-container px-4 py-2 rounded-lg flex items-center gap-2 font-label-md text-label-md hover:bg-surface-container hover:shadow-sm transition-all"
              >
                {uploadMutation.isPending ? (
                  <span className="w-4 h-4 border-2 border-outline border-t-primary rounded-full animate-spin" />
                ) : (
                  <span className="material-symbols-outlined text-[18px]">sync</span>
                )}
                {user?.resume?.url ? "Replace" : "Upload"}
              </button>

              {user?.resume?.url && (
                <>
                  <a
                    href={user.resume.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="bg-primary-container text-on-primary px-4 py-2 rounded-lg flex items-center gap-2 font-label-md text-label-md hover:bg-tertiary-container transition-colors shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[18px]">download</span>
                    Download
                  </a>
                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to delete your resume?")) {
                        deleteMutation.mutate();
                      }
                    }}
                    disabled={deleteMutation.isPending}
                    className="bg-error/10 text-error border border-error/20 px-4 py-2 rounded-lg flex items-center gap-2 font-label-md text-label-md hover:bg-error hover:text-on-error transition-all shadow-sm"
                  >
                    {deleteMutation.isPending ? (
                      <span className="w-4 h-4 border-2 border-error/20 border-t-error rounded-full animate-spin" />
                    ) : (
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    )}
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* PDF Preview Area */}
          <div className="flex-1 bg-surface-container-low overflow-y-auto p-4 md:p-6 flex justify-center relative">
            {user?.resume?.url ? (
              <iframe
                src={user.resume.url}
                className="w-full h-full min-h-[600px] border-0 rounded-lg shadow-sm"
                title="Resume Preview"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-on-surface-variant w-full h-full min-h-[400px]">
                <span className="material-symbols-outlined text-[48px] text-outline mb-4">upload_file</span>
                <p className="font-headline-sm text-headline-sm text-on-surface mb-2">No Resume Found</p>
                <p className="font-body-md text-body-md text-center max-w-sm">
                  Upload your resume in PDF format to view it here and use it for job applications.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Context & Empty State (Upload Zone) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Candidate Quick Info */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 shadow-sm">
            <h4 className="font-headline-sm text-headline-sm text-on-surface border-b border-outline-variant pb-2 mb-4">Candidate Info</h4>
            <div className="flex items-center gap-4 mb-4">
              {user?.avatar?.url ? (
                <img src={user.avatar.url} alt={user.name} className="w-12 h-12 rounded-full object-cover border border-outline-variant" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-primary-fixed-dim text-on-primary-fixed flex items-center justify-center font-headline-sm text-headline-sm font-bold">
                  {user?.name?.[0]?.toUpperCase() || "?"}
                </div>
              )}
              <div>
                <div className="font-headline-sm text-headline-sm text-on-surface">{user?.name}</div>
                <div className="font-body-md text-body-md text-on-surface-variant line-clamp-1">{user?.bio || "Candidate"}</div>
              </div>
            </div>
            <div className="flex flex-col gap-2 font-body-md text-body-md text-on-surface-variant">
              <div className="flex items-center gap-2 truncate"><span className="material-symbols-outlined text-[16px] shrink-0">mail</span> {user?.email}</div>
              {/* Optional: Add phone/location if available in user model */}
            </div>
          </div>

          {/* Empty State: Upload Zone */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 shadow-sm">
            <h4 className="font-headline-sm text-headline-sm text-on-surface border-b border-outline-variant pb-2 mb-4">
              {user?.resume?.url ? "Upload New Version" : "Upload Resume"}
            </h4>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-outline-variant rounded-lg p-8 flex flex-col items-center justify-center gap-4 text-center hover:bg-surface-container-low hover:border-secondary transition-all cursor-pointer group mt-2 bg-surface-bright"
            >
              <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center group-hover:bg-secondary-fixed transition-colors">
                <span className="material-symbols-outlined text-[28px] text-on-surface-variant group-hover:text-secondary">upload_file</span>
              </div>
              <div>
                <p className="font-headline-sm text-headline-sm text-on-surface mb-1 group-hover:text-secondary transition-colors">Click to browse</p>
                <p className="font-body-md text-body-md text-on-surface-variant">and select your resume</p>
              </div>
              <p className="font-helper-text text-helper-text text-outline mt-2">Supported formats: PDF (max 5MB)</p>
            </div>
          </div>

          {/* AI Analysis Block */}
          {user?.resume?.url && (
            <div className="bg-gradient-to-br from-brand-navy to-brand-blue rounded-lg p-6 shadow-sm text-white">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/20">
                <span className="material-symbols-outlined text-[24px]">psychology</span>
                <h4 className="font-headline-sm text-headline-sm">AI Resume Analysis</h4>
              </div>
              
              {!user.resumeAnalysis?.analyzedAt ? (
                <div className="flex flex-col items-center text-center gap-4 py-4">
                  <p className="text-white/80 text-sm">
                    Unlock insights from your resume. Our AI will analyze your skills, identify gaps, and provide actionable feedback.
                  </p>
                  <button
                    onClick={() => analyzeMutation.mutate()}
                    disabled={analyzeMutation.isPending}
                    className="w-full bg-white text-brand-navy px-4 py-2 rounded-lg font-label-md text-label-md font-bold hover:bg-white/90 transition-all flex items-center justify-center gap-2"
                  >
                    {analyzeMutation.isPending ? (
                      <span className="w-4 h-4 border-2 border-brand-navy/20 border-t-brand-navy rounded-full animate-spin" />
                    ) : (
                      <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                    )}
                    Analyze Resume
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="bg-white/10 p-3 rounded-lg flex items-center justify-between">
                    <span className="text-sm font-medium">ATS Score</span>
                    <span className="text-2xl font-bold">{user.resumeAnalysis.atsScore}%</span>
                  </div>
                  
                  {user.resumeAnalysis.summary && (
                    <div className="text-sm">
                      <p className="text-white/70 mb-1 font-semibold uppercase text-xs">Summary</p>
                      <p className="line-clamp-3 text-white/90">{user.resumeAnalysis.summary}</p>
                    </div>
                  )}

                  {user.resumeAnalysis.skills?.length > 0 && (
                    <div>
                      <p className="text-white/70 mb-1 font-semibold uppercase text-xs">Extracted Skills</p>
                      <div className="flex flex-wrap gap-1.5">
                        {user.resumeAnalysis.skills.slice(0, 5).map((skill, i) => (
                          <span key={i} className="text-xs bg-white/10 px-2 py-1 rounded-md border border-white/20">
                            {skill}
                          </span>
                        ))}
                        {user.resumeAnalysis.skills.length > 5 && (
                          <span className="text-xs bg-white/5 px-2 py-1 rounded-md">+{user.resumeAnalysis.skills.length - 5} more</span>
                        )}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => analyzeMutation.mutate()}
                    disabled={analyzeMutation.isPending}
                    className="mt-2 w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded-lg font-label-md text-label-md transition-all flex items-center justify-center gap-2"
                  >
                    {analyzeMutation.isPending ? (
                      <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      <span className="material-symbols-outlined text-[18px]">refresh</span>
                    )}
                    Re-analyze
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
