"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { companyApi } from "@/api/company.api";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const INDUSTRIES = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Retail",
  "Manufacturing",
  "Consulting",
  "Media",
  "Real Estate",
  "Other",
];

const COMPANY_SIZES = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1000",
  "1000+",
];

const companySchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .optional()
    .or(z.literal("")),
  website: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  location: z.string().min(2, "Location is required"),
  industry: z.string().min(1, "Industry is required"),
  companySize: z.string().min(1, "Company size is required"),
});

export function CompanyForm({ existingData, mode = "create" }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(companySchema),
    defaultValues: existingData
      ? {
          name: existingData.name,
          description: existingData.description ?? "",
          website: existingData.website ?? "",
          location: existingData.location,
          industry: existingData.industry,
          companySize: existingData.companySize,
        }
      : {},
  });

  const mutation = useMutation({
    mutationFn: (data) => {
      if (mode === "create") {
        return companyApi.createCompany(data);
      }
      if (!existingData?._id)
        throw new Error("Company ID is required for update");
      return companyApi.updateCompany(existingData._id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COMPANY });
      toast.success(
        mode === "create"
          ? "Company created! Awaiting admin verification."
          : "Company updated!",
      );
      router.push(ROUTES.RECRUITER_COMPANY);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to save company");
    },
  });

  return (
    <form
      onSubmit={handleSubmit((data) => mutation.mutate(data))}
      className="space-y-6"
    >
      <div className="space-y-2">
        <Label htmlFor="company-name" className="font-label-md text-label-md text-on-surface">Company Name *</Label>
        <Input
          id="company-name"
          placeholder="Acme Inc."
          className="bg-surface-container-lowest border-outline-variant focus-visible:ring-secondary text-on-surface"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-xs text-error">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="company-desc" className="font-label-md text-label-md text-on-surface">Description</Label>
        <Textarea
          id="company-desc"
          placeholder="Tell us about your company..."
          rows={4}
          className="bg-surface-container-lowest border-outline-variant focus-visible:ring-secondary text-on-surface resize-y"
          {...register("description")}
        />
        {errors.description && (
          <p className="text-xs text-error">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label className="font-label-md text-label-md text-on-surface">Industry *</Label>
          <Select
            defaultValue={existingData?.industry || undefined}
            onValueChange={(v) => {
              if (v) setValue("industry", v);
            }}
          >
            <SelectTrigger className="bg-surface-container-lowest border-outline-variant focus:ring-secondary text-on-surface">
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              {INDUSTRIES.map((i) => (
                <SelectItem key={i} value={i}>
                  {i}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.industry && (
            <p className="text-xs text-error">{errors.industry.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="font-label-md text-label-md text-on-surface">Company Size *</Label>
          <Select
            defaultValue={existingData?.companySize || undefined}
            onValueChange={(v) => {
              if (v) setValue("companySize", v);
            }}
          >
            <SelectTrigger className="bg-surface-container-lowest border-outline-variant focus:ring-secondary text-on-surface">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              {COMPANY_SIZES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s} employees
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.companySize && (
            <p className="text-xs text-error">{errors.companySize.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="company-location" className="font-label-md text-label-md text-on-surface">Location *</Label>
          <Input
            id="company-location"
            placeholder="Bangalore, India"
            className="bg-surface-container-lowest border-outline-variant focus-visible:ring-secondary text-on-surface"
            {...register("location")}
          />
          {errors.location && (
            <p className="text-xs text-error">{errors.location.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="company-website" className="font-label-md text-label-md text-on-surface">Website</Label>
          <Input
            id="company-website"
            placeholder="https://example.com"
            className="bg-surface-container-lowest border-outline-variant focus-visible:ring-secondary text-on-surface"
            {...register("website")}
          />
          {errors.website && (
            <p className="text-xs text-error">{errors.website.message}</p>
          )}
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-outline-variant">
        <Button 
          type="button" 
          variant="outline" 
          className="border-outline-variant text-on-surface hover:bg-surface-variant w-32" 
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={mutation.isPending}
          className="bg-primary-container text-on-primary hover:bg-tertiary-container transition-colors shadow-sm flex-1"
        >
          {mutation.isPending
            ? "Saving..."
            : mode === "create"
              ? "Create Company"
              : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
