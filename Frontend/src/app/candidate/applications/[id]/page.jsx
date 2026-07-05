"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { applicationApi } from "@/api/application.api";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/ConfirmModal";
import { formatDate } from "@/utils/dateUtils";
import { APPLICATION_STATUS_ORDER } from "@/constants/applicationStatus";
import { ArrowLeft, Building2, MapPin } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Image from "next/image";
export default function ApplicationDetailPage({ params }) {
  const { id } = params;
  const queryClient = useQueryClient();
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const { data: application, isLoading } = useQuery({
    queryKey: QUERY_KEYS.APPLICATION(id),
    queryFn: async () => (await applicationApi.applicationById(id)).application,
  });
  const withdrawMutation = useMutation({
    mutationFn: () => applicationApi.withdrawApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.APPLICATION(id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.APPLICATIONS });
      toast.success("Application withdrawn");
      setWithdrawOpen(false);
    },
    onError: (error) =>
      toast.error(error?.response?.data?.message || "Failed to withdraw"),
  });
  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        {" "}
        <Skeleton className="h-8 w-40" />{" "}
        <Skeleton className="h-48 rounded-lg" />{" "}
        <Skeleton className="h-48 rounded-lg" />{" "}
      </div>
    );
  }
  if (!application) return null;
  const canWithdraw = ["APPLIED", "UNDER_REVIEW"].includes(application.status);
  const currentStatusIndex = APPLICATION_STATUS_ORDER.indexOf(
    application.status,
  );
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {" "}
      <Link
        href={ROUTES.CANDIDATE_APPLICATIONS}
        className="inline-flex items-center gap-1.5 text-sm text-on-surface-variant transition-colors duration-200 ease-out hover:text-secondary"
      >
        {" "}
        <ArrowLeft size={14} /> Back to Applications{" "}
      </Link>{" "}
      <PageHeader
        title="Application Detail"
        action={
          <StatusBadge status={application.status} variant="application" />
        }
      />{" "}
      {/* Job Card */}{" "}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5">
        {" "}
        <div className="flex items-start gap-4">
          {" "}
          <div className="relative w-14 h-14 rounded-lg bg-surface-container-low flex items-center justify-center border border-outline-variant flex-shrink-0 overflow-hidden">
            {" "}
            {application.job?.company?.logo?.url ? (
              <Image
                src={application.job.company.logo.url}
                alt={application.job.company.name}
                fill
                className="object-contain"
              />
            ) : (
              <Building2 size={24} className="text-on-surface-variant" />
            )}{" "}
          </div>{" "}
          <div>
            {" "}
            <h2 className="font-bold text-on-surface text-lg">
              {" "}
              {application.job?.title}{" "}
            </h2>{" "}
            <p className="text-on-surface-variant text-sm">
              {" "}
              {application.job?.company?.name}{" "}
            </p>{" "}
            <div className="flex items-center gap-1.5 text-xs text-on-surface-variant/70 mt-1">
              {" "}
              <MapPin size={12} /> {application.job?.location}{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        <div className="mt-4 text-xs text-on-surface-variant/70">
          {" "}
          Applied on {formatDate(application.createdAt)}{" "}
        </div>{" "}
      </div>{" "}
      {/* Status Timeline */}{" "}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5">
        {" "}
        <h3 className="font-semibold text-on-surface mb-4">
          {" "}
          Application Progress{" "}
        </h3>{" "}
        {application.status === "REJECTED" ||
        application.status === "WITHDRAWN" ? (
          <div className="text-center py-4">
            {" "}
            <StatusBadge
              status={application.status}
              variant="application"
              className="text-sm"
            />{" "}
            <p className="text-sm text-on-surface-variant mt-2">
              {" "}
              {application.status === "REJECTED"
                ? "Unfortunately, your application was not successful."
                : "You have withdrawn this application."}{" "}
            </p>{" "}
          </div>
        ) : (
          <div className="relative">
            {" "}
            <div className="flex justify-between mb-2">
              {" "}
              {APPLICATION_STATUS_ORDER.map((status, index) => {
                const isComplete = index <= currentStatusIndex;
                const isCurrent = index === currentStatusIndex;
                return (
                  <div
                    key={status}
                    className="flex flex-col items-center flex-1"
                  >
                    {" "}
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all",
                        isComplete
                          ? "bg-secondary border-secondary text-on-secondary"
                          : "bg-surface-container-lowest border-outline-variant text-on-surface-variant",
                      )}
                    >
                      {" "}
                      {isComplete ? "✓" : index + 1}{" "}
                    </div>{" "}
                    <p
                      className={cn(
                        "text-[10px] mt-1.5 text-center leading-tight max-w-14",
                        isCurrent
                          ? "text-secondary font-semibold"
                          : isComplete
                            ? "text-on-surface-variant "
                            : "text-outline-variant ",
                      )}
                    >
                      {" "}
                      {status.replace("_", " ")}{" "}
                    </p>{" "}
                  </div>
                );
              })}{" "}
            </div>{" "}
            <div className="absolute top-4 left-4 right-4 h-0.5 bg-surface-container-low -z-10">
              {" "}
              <div
                className="h-full bg-secondary transition-all duration-500"
                style={{
                  width: `${(currentStatusIndex / (APPLICATION_STATUS_ORDER.length - 1)) * 100}%`,
                }}
              />{" "}
            </div>{" "}
          </div>
        )}{" "}
      </div>{" "}
      {/* Withdraw */}{" "}
      {canWithdraw && (
        <div className="flex justify-end">
          {" "}
          <Button
            variant="outline"
            className="border-red-300 text-red-600 transition-colors duration-200 ease-out hover:bg-red-50 "
            onClick={() => setWithdrawOpen(true)}
          >
            {" "}
            Withdraw Application{" "}
          </Button>{" "}
        </div>
      )}{" "}
      <ConfirmModal
        open={withdrawOpen}
        onOpenChange={setWithdrawOpen}
        title="Withdraw Application"
        description="Are you sure you want to withdraw this application? This action cannot be undone."
        confirmLabel="Withdraw"
        onConfirm={() => withdrawMutation.mutate()}
        isLoading={withdrawMutation.isPending}
      />{" "}
    </div>
  );
}
