"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { offerApi } from "@/api/offer.api";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";

const offerSchema = z.object({
  applicationId: z.string().min(1, "Application is required"),
  title: z.string().min(3, "Job title is required"),
  salary: z.number().min(1, "Salary is required"),
  joiningDate: z.string().min(1, "Joining date is required"),
  employmentType: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"]),
  location: z.string().min(2, "Location is required"),
  notes: z.string().optional(),
  expiryDate: z.string().min(1, "Expiry date is required"),
});

export function OfferForm({
  applicationId,
  jobTitle,
  applications = [],
  onSuccess,
}) {
  const queryClient = useQueryClient();
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      applicationId: applicationId || "",
      title: jobTitle || "",
      employmentType: "FULL_TIME",
    },
  });

  const mutation = useMutation({
    mutationFn: (data) => offerApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.OFFERS });
      toast.success("Offer sent successfully!");
      onSuccess?.();
      router.push(ROUTES.RECRUITER_OFFERS);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to send offer");
    },
  });

  return (
    <form
      onSubmit={handleSubmit((data) => mutation.mutate(data))}
      className="space-y-6"
    >
      {!applicationId && applications.length > 0 && (
        <div className="space-y-2">
          <Label className="font-label-md text-label-md text-on-surface">Application *</Label>
          <Select
            onValueChange={(v) => {
              if (v) setValue("applicationId", v);
            }}
          >
            <SelectTrigger className="bg-surface-container-lowest border-outline-variant focus:ring-secondary text-on-surface">
              <SelectValue placeholder="Select application" />
            </SelectTrigger>
            <SelectContent>
              {applications.map((app) => (
                <SelectItem key={app._id} value={app._id}>
                  {app.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.applicationId && (
            <p className="text-xs text-error">
              {errors.applicationId.message}
            </p>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="offer-title" className="font-label-md text-label-md text-on-surface">Job Title *</Label>
        <Input
          id="offer-title"
          placeholder="Senior Engineer"
          className="bg-surface-container-lowest border-outline-variant focus-visible:ring-secondary text-on-surface"
          {...register("title")}
        />
        {errors.title && (
          <p className="text-xs text-error">{errors.title.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="offer-salary" className="font-label-md text-label-md text-on-surface">Annual Salary (₹) *</Label>
          <Input
            id="offer-salary"
            type="number"
            placeholder="1200000"
            className="bg-surface-container-lowest border-outline-variant focus-visible:ring-secondary text-on-surface"
            {...register("salary", { valueAsNumber: true })}
          />
          {errors.salary && (
            <p className="text-xs text-error">{errors.salary.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="font-label-md text-label-md text-on-surface">Employment Type *</Label>
          <Select
            defaultValue="FULL_TIME"
            onValueChange={(v) => setValue("employmentType", v)}
          >
            <SelectTrigger className="bg-surface-container-lowest border-outline-variant focus:ring-secondary text-on-surface">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FULL_TIME">Full-time</SelectItem>
              <SelectItem value="PART_TIME">Part-time</SelectItem>
              <SelectItem value="CONTRACT">Contract</SelectItem>
              <SelectItem value="INTERNSHIP">Internship</SelectItem>
            </SelectContent>
          </Select>
          {errors.employmentType && (
            <p className="text-xs text-error">
              {errors.employmentType.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="offer-location" className="font-label-md text-label-md text-on-surface">Location *</Label>
        <Input
          id="offer-location"
          placeholder="Bangalore, India"
          className="bg-surface-container-lowest border-outline-variant focus-visible:ring-secondary text-on-surface"
          {...register("location")}
        />
        {errors.location && (
          <p className="text-xs text-error">{errors.location.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="offer-joining" className="font-label-md text-label-md text-on-surface">Joining Date *</Label>
          <Input 
            id="offer-joining" 
            type="date" 
            className="bg-surface-container-lowest border-outline-variant focus-visible:ring-secondary text-on-surface"
            {...register("joiningDate")} 
          />
          {errors.joiningDate && (
            <p className="text-xs text-error">{errors.joiningDate.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="offer-expiry" className="font-label-md text-label-md text-on-surface">Offer Expires On *</Label>
          <Input 
            id="offer-expiry" 
            type="date" 
            className="bg-surface-container-lowest border-outline-variant focus-visible:ring-secondary text-on-surface"
            {...register("expiryDate")} 
          />
          {errors.expiryDate && (
            <p className="text-xs text-error">{errors.expiryDate.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="offer-notes" className="font-label-md text-label-md text-on-surface">Notes (optional)</Label>
        <Textarea
          id="offer-notes"
          placeholder="Additional details about the offer..."
          rows={3}
          className="bg-surface-container-lowest border-outline-variant focus-visible:ring-secondary text-on-surface resize-y"
          {...register("notes")}
        />
      </div>

      <Button
        type="submit"
        disabled={mutation.isPending}
        className="w-full bg-primary-container text-on-primary hover:bg-tertiary-container transition-colors shadow-sm"
      >
        {mutation.isPending ? "Sending Offer..." : "Send Offer"}
      </Button>
    </form>
  );
}
