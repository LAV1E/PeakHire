"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StatusBadge } from "@/components/common/StatusBadge";
import { AvatarWithFallback } from "@/components/common/AvatarWithFallback";
import { formatDate } from "@/utils/dateUtils";
import { MapPin, Mail } from "lucide-react";
export function ApplicationDetailModal({ open, onOpenChange, application }) {
  if (!application) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {" "}
      <DialogContent className="max-w-lg">
        {" "}
        <DialogHeader>
          {" "}
          <DialogTitle>Application Details</DialogTitle>{" "}
        </DialogHeader>{" "}
        <div className="space-y-4">
          {" "}
          {/* Candidate Info */}{" "}
          <div className="flex items-center gap-3 p-4 bg-surface-container-low rounded-lg">
            {" "}
            <AvatarWithFallback
              src={application.candidate?.avatar?.url}
              name={application.candidate?.name ?? "Unknown"}
              size="lg"
            />{" "}
            <div>
              {" "}
              <h3 className="font-semibold text-on-surface ">
                {" "}
                {application.candidate?.name}{" "}
              </h3>{" "}
              <p className="text-sm text-on-surface-variant flex items-center gap-1 mt-0.5">
                {" "}
                <Mail size={12} /> {application.candidate?.email}{" "}
              </p>{" "}
            </div>{" "}
          </div>{" "}
          {/* Job Info */}{" "}
          <div className="p-4 border border-outline-variant rounded-lg">
            {" "}
            <h4 className="font-medium text-on-surface mb-1">
              {" "}
              {application.job?.title}{" "}
            </h4>{" "}
            <p className="text-sm text-on-surface-variant ">
              {" "}
              {application.job?.company?.name}{" "}
            </p>{" "}
            <div className="flex items-center gap-2 mt-2">
              {" "}
              <MapPin size={12} className="text-slate-400" />{" "}
              <span className="text-xs text-on-surface-variant ">
                {" "}
                {application.job?.location}{" "}
              </span>{" "}
            </div>{" "}
          </div>{" "}
          {/* Status & Dates */}{" "}
          <div className="flex items-center justify-between">
            {" "}
            <div>
              {" "}
              <p className="text-xs text-on-surface-variant mb-1"> Status </p>{" "}
              <StatusBadge
                status={application.status}
                variant="application"
              />{" "}
            </div>{" "}
            <div className="text-right">
              {" "}
              <p className="text-xs text-on-surface-variant mb-1"> Applied </p>{" "}
              <p className="text-sm font-medium text-on-surface ">
                {" "}
                {formatDate(application.createdAt)}{" "}
              </p>{" "}
            </div>{" "}
          </div>{" "}
          {/* Cover Letter */}{" "}
          {application.coverLetter && (
            <div>
              {" "}
              <p className="text-xs text-on-surface-variant mb-1.5 font-medium uppercase tracking-wide">
                {" "}
                Cover Letter{" "}
              </p>{" "}
              <p className="text-sm text-on-surface-variant leading-relaxed bg-surface-container-low p-3 rounded-lg">
                {" "}
                {application.coverLetter}{" "}
              </p>{" "}
            </div>
          )}{" "}
        </div>{" "}
      </DialogContent>{" "}
    </Dialog>
  );
}
