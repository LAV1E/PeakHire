"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { applicationApi } from "@/api/application.api";
import { StatusBadge } from "@/components/common/StatusBadge";
import { AvatarWithFallback } from "@/components/common/AvatarWithFallback";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScheduleInterviewModal } from "@/components/modals/ScheduleInterviewModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { OfferForm } from "@/components/forms/OfferForm";
import { toast } from "sonner";
import { formatDate } from "@/utils/dateUtils";
import { ArrowLeft, Mail, Download, Calendar, Gift } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

const STATUS_OPTIONS = [
  "APPLIED",
  "UNDER_REVIEW",
  "SHORTLISTED",
  "INTERVIEW",
  "OFFERED",
  "HIRED",
  "REJECTED",
];

export default function RecruiterApplicationDetailPage({ params }) {
  const { id } = params;
  const queryClient = useQueryClient();
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [offerOpen, setOfferOpen] = useState(false);
  
  const { data: application, isLoading } = useQuery({
    queryKey: QUERY_KEYS.APPLICATION(id),
    queryFn: async () => (await applicationApi.applicationById(id)).application,
  });
  
  const statusMutation = useMutation({
    mutationFn: (status) => applicationApi.updateApplicationStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.APPLICATION(id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.APPLICATIONS });
      toast.success("Status updated!");
    },
    onError: (error) =>
      toast.error(error?.response?.data?.message || "Failed to update status"),
  });
  
  if (isLoading) {
    return (
      <div className="pt-8 pb-12 max-w-container_max mx-auto space-y-6 w-full">
        <Skeleton className="h-8 w-40 rounded-md bg-surface-container-highest" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-56 lg:col-span-2 rounded-xl bg-surface-container-highest" />
          <Skeleton className="h-56 rounded-xl bg-surface-container-highest" />
        </div>
      </div>
    );
  }
  
  if (!application) return null;
  
  const canScheduleInterview = ["SHORTLISTED", "INTERVIEW", "OFFERED"].includes(
    application.status,
  );
  const canSendOffer = ["SHORTLISTED", "INTERVIEW", "OFFERED"].includes(
    application.status,
  );
  const resumeUrl = application.candidate?.resumeUrl;
  
  return (
    <div className="pt-8 pb-12 max-w-container_max mx-auto space-y-6 min-h-[calc(100vh-64px)] w-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              href={ROUTES.RECRUITER_APPLICATIONS}
              className="p-1 -ml-1 rounded-full hover:bg-surface-variant text-on-surface-variant transition-colors"
            >
              <ArrowLeft size={18} />
            </Link>
            <span className="font-body-sm text-body-sm text-on-surface-variant uppercase tracking-wider">Back to Applications</span>
          </div>
          <h2 className="font-headline-lg text-headline-lg font-bold text-on-background">
            Application Review
          </h2>
        </div>
        <div>
          <StatusBadge status={application.status} variant="application" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          {/* Candidate Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <AvatarWithFallback
                  src={application.candidate?.avatar?.url}
                  name={application.candidate?.name ?? "?"}
                  size="lg"
                />
                <div className="flex-1">
                  <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                    {application.candidate?.name}
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-1.5 mt-1">
                    <Mail size={16} /> {application.candidate?.email}
                  </p>
                  {application.candidate?.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {application.candidate.skills.slice(0, 6).map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-surface-variant text-on-surface-variant rounded-full text-sm font-medium border border-outline-variant/30"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <Link 
                href={ROUTES.RECRUITER_CANDIDATE(application.candidate?._id)} 
                className="bg-secondary-container text-on-secondary-container px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-secondary-container/80 transition-colors flex items-center gap-2 shrink-0"
              >
                <span className="material-symbols-outlined text-[18px]">person</span>
                View Full Profile
              </Link>
            </div>
          </div>

          {/* Resume */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Resume</h3>
              {resumeUrl && (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                >
                  <Button size="sm" variant="outline" className="gap-2 border-outline-variant text-on-surface hover:bg-surface-variant">
                    <Download size={16} /> Download
                  </Button>
                </a>
              )}
            </div>
            {resumeUrl ? (
              <div className="rounded-xl overflow-hidden border border-outline-variant bg-surface-container-highest">
                <iframe
                  src={resumeUrl}
                  className="w-full h-[500px]"
                  title="Candidate Resume"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-outline-variant rounded-xl bg-surface/50">
                <span className="material-symbols-outlined text-[32px] text-on-surface-variant mb-2">description</span>
                <p className="font-body-md text-body-md text-on-surface-variant">No resume uploaded</p>
              </div>
            )}
          </div>

          {/* Application info */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6">
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-4">
              Application Info
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-outline-variant/30">
                <span className="font-body-md text-body-md text-on-surface-variant">Applied for</span>
                <span className="font-label-lg text-label-lg font-semibold text-on-surface">
                  {application.job?.title}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-outline-variant/30">
                <span className="font-body-md text-body-md text-on-surface-variant">Applied on</span>
                <span className="font-label-lg text-label-lg font-medium text-on-surface">
                  {formatDate(application.createdAt)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-body-md text-body-md text-on-surface-variant">Last updated</span>
                <span className="font-label-lg text-label-lg font-medium text-on-surface">
                  {formatDate(application.updatedAt)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-6">
          {/* Status Update */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6">
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-4">
              Update Status
            </h3>
            <Select
              value={application.status}
              onValueChange={(v) => statusMutation.mutate(v)}
            >
              <SelectTrigger className="w-full bg-surface-container-lowest border-outline-variant focus:ring-secondary text-on-surface">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s.replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {statusMutation.isPending && (
              <p className="font-body-sm text-body-sm text-primary mt-2">Updating...</p>
            )}
          </div>

          {/* Actions */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 space-y-4">
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Actions</h3>
            <Button
              className="w-full gap-2 bg-primary-container text-on-primary hover:bg-tertiary-container transition-colors shadow-sm"
              disabled={!canScheduleInterview}
              onClick={() => setScheduleOpen(true)}
            >
              <Calendar size={18} /> Schedule Interview
            </Button>
            <Button
              variant="outline"
              className="w-full gap-2 border-outline-variant text-on-surface hover:bg-surface-variant"
              disabled={!canSendOffer}
              onClick={() => setOfferOpen(true)}
            >
              <Gift size={18} /> Send Offer
            </Button>
          </div>

          {/* AI Resume Score — Coming Soon */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                AI Resume Score
              </h3>
              <span className="text-[10px] bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Soon
              </span>
            </div>
            <div className="h-24 bg-surface-variant rounded-lg flex flex-col items-center justify-center border border-outline-variant/30">
              <span className="material-symbols-outlined text-[24px] text-on-surface-variant mb-1">auto_awesome</span>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                AI scoring coming soon
              </p>
            </div>
          </div>
        </div>
      </div>

      <ScheduleInterviewModal
        open={scheduleOpen}
        onOpenChange={setScheduleOpen}
        applicationId={id}
      />
      <Dialog open={offerOpen} onOpenChange={setOfferOpen}>
        <DialogContent className="max-w-lg bg-surface-container-lowest border-outline-variant">
          <DialogHeader>
            <DialogTitle className="font-headline-sm text-headline-sm font-bold text-on-surface">Send Offer</DialogTitle>
          </DialogHeader>
          <OfferForm
            applicationId={id}
            jobTitle={application.job?.title}
            onSuccess={() => setOfferOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
