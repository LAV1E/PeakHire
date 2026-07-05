"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { interviewApi } from "@/api/interview.api";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { toast } from "sonner";
const scheduleSchema = z.object({
  applicationId: z.string().min(1, "Application is required"),
  scheduledAt: z.string().min(1, "Date and time is required"),
  duration: z
    .number()
    .min(15, "Minimum 15 minutes")
    .max(240, "Maximum 4 hours"),
  mode: z.enum(["ONLINE", "OFFLINE"]),
  meetingLink: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  location: z.string().optional(),
});
export function ScheduleInterviewModal({
  open,
  onOpenChange,
  applicationId,
  applications = [],
}) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      applicationId: applicationId || "",
      duration: 60,
      mode: "ONLINE",
    },
  });
  const mode = watch("mode");
  const scheduleMutation = useMutation({
    mutationFn: (data) => interviewApi.scheduleInterview(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INTERVIEWS });
      toast.success("Interview scheduled successfully");
      onOpenChange(false);
      reset();
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to schedule interview",
      );
    },
  });
  const onSubmit = (data) => {
    scheduleMutation.mutate({
      applicationId: data.applicationId,
      title: "Interview",
      /* Default title */ scheduledAt: new Date(data.scheduledAt).toISOString(),
      duration: data.duration,
      mode: data.mode,
      meetingLink: data.mode === "ONLINE" ? data.meetingLink : undefined,
      location: data.mode === "OFFLINE" ? data.location : undefined,
    });
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {" "}
      <DialogContent className="max-w-lg">
        {" "}
        <DialogHeader>
          {" "}
          <DialogTitle>Schedule Interview</DialogTitle>{" "}
        </DialogHeader>{" "}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {" "}
          {!applicationId && applications.length > 0 && (
            <div className="space-y-1.5">
              {" "}
              <Label>Application</Label>{" "}
              <Select
                onValueChange={(v) => {
                  if (v) setValue("applicationId", v);
                }}
              >
                {" "}
                <SelectTrigger>
                  {" "}
                  <SelectValue placeholder="Select application" />{" "}
                </SelectTrigger>{" "}
                <SelectContent>
                  {" "}
                  {applications.map((app) => (
                    <SelectItem key={app._id} value={app._id}>
                      {" "}
                      {app.label}{" "}
                    </SelectItem>
                  ))}{" "}
                </SelectContent>{" "}
              </Select>{" "}
              {errors.applicationId && (
                <p className="text-xs text-red-500">
                  {" "}
                  {errors.applicationId.message}{" "}
                </p>
              )}{" "}
            </div>
          )}{" "}
          <div className="grid grid-cols-2 gap-4">
            {" "}
            <div className="space-y-1.5">
              {" "}
              <Label>Date & Time</Label>{" "}
              <Input type="datetime-local" {...register("scheduledAt")} />{" "}
              {errors.scheduledAt && (
                <p className="text-xs text-red-500">
                  {" "}
                  {errors.scheduledAt.message}{" "}
                </p>
              )}{" "}
            </div>{" "}
            <div className="space-y-1.5">
              {" "}
              <Label>Duration (minutes)</Label>{" "}
              <Input
                type="number"
                {...register("duration", { valueAsNumber: true })}
                min={15}
                max={240}
              />{" "}
              {errors.duration && (
                <p className="text-xs text-red-500">
                  {" "}
                  {errors.duration.message}{" "}
                </p>
              )}{" "}
            </div>{" "}
          </div>{" "}
          <div className="space-y-1.5">
            {" "}
            <Label>Mode</Label>{" "}
            <div className="flex gap-3">
              {" "}
              {["ONLINE", "OFFLINE"].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setValue("mode", m)}
                  className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${mode === m ? "bg-secondary text-on-secondary border-secondary" : "border-outline-variant text-on-surface-variant hover:border-secondary"}`}
                >
                  {" "}
                  {m === "ONLINE" ? "🎥 Online" : "📍 In-Person"}{" "}
                </button>
              ))}{" "}
            </div>{" "}
          </div>{" "}
          {mode === "ONLINE" && (
            <div className="space-y-1.5">
              {" "}
              <Label>Meeting Link</Label>{" "}
              <Input
                placeholder="https://meet.google.com/..."
                {...register("meetingLink")}
              />{" "}
              {errors.meetingLink && (
                <p className="text-xs text-red-500">
                  {" "}
                  {errors.meetingLink.message}{" "}
                </p>
              )}{" "}
            </div>
          )}{" "}
          {mode === "OFFLINE" && (
            <div className="space-y-1.5">
              {" "}
              <Label>Location</Label>{" "}
              <Input
                placeholder="Office address..."
                {...register("location")}
              />{" "}
            </div>
          )}{" "}
          <DialogFooter>
            {" "}
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {" "}
              Cancel{" "}
            </Button>{" "}
            <Button
              type="submit"
              disabled={scheduleMutation.isPending}
              className="bg-secondary transition-colors duration-200 ease-out hover:opacity-90 text-on-secondary"
            >
              {" "}
              {scheduleMutation.isPending
                ? "Scheduling..."
                : "Schedule Interview"}{" "}
            </Button>{" "}
          </DialogFooter>{" "}
        </form>{" "}
      </DialogContent>{" "}
    </Dialog>
  );
}
