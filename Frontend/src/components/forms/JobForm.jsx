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
import { jobApi } from "@/api/job.api";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { useState } from "react";
import { X } from "lucide-react";

const jobSchema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z
      .string()
      .min(50, "Description must be at least 50 characters"),
    department: z.string().min(2, "Department is required"),
    location: z.string().min(2, "Location is required"),
    workplaceType: z.enum(["ONSITE", "REMOTE", "HYBRID"]),
    salaryMin: z.number().min(0, "Salary must be positive"),
    salaryMax: z.number().min(0, "Salary must be positive"),
    employmentType: z.enum([
      "FULL_TIME",
      "PART_TIME",
      "CONTRACT",
      "INTERNSHIP",
      "FREELANCE",
    ]),
    experienceLevel: z.enum(["ENTRY", "JUNIOR", "MID", "SENIOR", "LEAD"]),
  })
  .refine((d) => d.salaryMax >= d.salaryMin, {
    message: "Max salary must be >= min salary",
    path: ["salaryMax"],
  });

export function JobForm({ existingData, mode = "create" }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [skills, setSkills] = useState(existingData?.skills ?? []);
  const [skillInput, setSkillInput] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: existingData
      ? {
          title: existingData.title,
          description: existingData.description,
          department: existingData.department ?? "",
          location: existingData.location,
          workplaceType: existingData.workplaceType ?? "ONSITE",
          salaryMin: existingData.salaryMin,
          salaryMax: existingData.salaryMax,
          employmentType: existingData.employmentType,
          experienceLevel: existingData.experienceLevel,
        }
      : { workplaceType: "ONSITE" },
  });

  const mutation = useMutation({
    mutationFn: (data) =>
      mode === "create"
        ? jobApi.createJob(data)
        : jobApi.updateJob(existingData._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.JOBS });
      toast.success(
        mode === "create" ? "Job created as draft!" : "Job updated!",
      );
      router.push(ROUTES.RECRUITER_JOBS);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to save job");
    },
  });

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills((prev) => [...prev, trimmed]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill) =>
    setSkills((prev) => prev.filter((s) => s !== skill));

  const onSubmit = (data) => {
    mutation.mutate({ ...data, skills });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="job-title" className="font-label-md text-label-md text-on-surface">Job Title *</Label>
        <Input
          id="job-title"
          placeholder="Senior Frontend Engineer"
          className="bg-surface-container-lowest border-outline-variant focus-visible:ring-secondary text-on-surface"
          {...register("title")}
        />
        {errors.title && (
          <p className="text-xs text-error">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="job-desc" className="font-label-md text-label-md text-on-surface">Job Description *</Label>
        <Textarea
          id="job-desc"
          placeholder="Describe the role, responsibilities, and requirements..."
          rows={6}
          className="bg-surface-container-lowest border-outline-variant focus-visible:ring-secondary text-on-surface resize-y"
          {...register("description")}
        />
        {errors.description && (
          <p className="text-xs text-error">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="job-department" className="font-label-md text-label-md text-on-surface">Department *</Label>
          <Input
            id="job-department"
            placeholder="Engineering"
            className="bg-surface-container-lowest border-outline-variant focus-visible:ring-secondary text-on-surface"
            {...register("department")}
          />
          {errors.department && (
            <p className="text-xs text-error">{errors.department.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="font-label-md text-label-md text-on-surface">Workplace Type *</Label>
          <Select
            defaultValue={existingData?.workplaceType ?? "ONSITE"}
            onValueChange={(v) => setValue("workplaceType", v)}
          >
            <SelectTrigger className="bg-surface-container-lowest border-outline-variant focus:ring-secondary text-on-surface">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ONSITE">On-site</SelectItem>
              <SelectItem value="REMOTE">Remote</SelectItem>
              <SelectItem value="HYBRID">Hybrid</SelectItem>
            </SelectContent>
          </Select>
          {errors.workplaceType && (
            <p className="text-xs text-error">
              {errors.workplaceType.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label className="font-label-md text-label-md text-on-surface">Employment Type *</Label>
          <Select
            defaultValue={existingData?.employmentType}
            onValueChange={(v) => setValue("employmentType", v)}
          >
            <SelectTrigger className="bg-surface-container-lowest border-outline-variant focus:ring-secondary text-on-surface">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FULL_TIME">Full-time</SelectItem>
              <SelectItem value="PART_TIME">Part-time</SelectItem>
              <SelectItem value="CONTRACT">Contract</SelectItem>
              <SelectItem value="INTERNSHIP">Internship</SelectItem>
              <SelectItem value="FREELANCE">Freelance</SelectItem>
            </SelectContent>
          </Select>
          {errors.employmentType && (
            <p className="text-xs text-error">
              {errors.employmentType.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="font-label-md text-label-md text-on-surface">Experience Level *</Label>
          <Select
            defaultValue={existingData?.experienceLevel}
            onValueChange={(v) => setValue("experienceLevel", v)}
          >
            <SelectTrigger className="bg-surface-container-lowest border-outline-variant focus:ring-secondary text-on-surface">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ENTRY">Entry Level</SelectItem>
              <SelectItem value="JUNIOR">Junior</SelectItem>
              <SelectItem value="MID">Mid Level</SelectItem>
              <SelectItem value="SENIOR">Senior Level</SelectItem>
              <SelectItem value="LEAD">Lead</SelectItem>
            </SelectContent>
          </Select>
          {errors.experienceLevel && (
            <p className="text-xs text-error">
              {errors.experienceLevel.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="job-location" className="font-label-md text-label-md text-on-surface">Location *</Label>
        <Input
          id="job-location"
          placeholder="Bangalore, India"
          className="bg-surface-container-lowest border-outline-variant focus-visible:ring-secondary text-on-surface"
          {...register("location")}
        />
        {errors.location && (
          <p className="text-xs text-error">{errors.location.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="salary-min" className="font-label-md text-label-md text-on-surface">Min Salary (₹/yr) *</Label>
          <Input
            id="job-salary-min"
            type="number"
            placeholder="e.g. 500000"
            className="bg-surface-container-lowest border-outline-variant focus-visible:ring-secondary text-on-surface"
            {...register("salaryMin", { valueAsNumber: true })}
          />
          {errors.salaryMin && (
            <p className="text-xs text-error">{errors.salaryMin.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="salary-max" className="font-label-md text-label-md text-on-surface">Max Salary (₹/yr) *</Label>
          <Input
            id="job-salary-max"
            type="number"
            placeholder="e.g. 800000"
            className="bg-surface-container-lowest border-outline-variant focus-visible:ring-secondary text-on-surface"
            {...register("salaryMax", { valueAsNumber: true })}
          />
          {errors.salaryMax && (
            <p className="text-xs text-error">{errors.salaryMax.message}</p>
          )}
        </div>
      </div>

      {/* Skills */}
      <div className="space-y-3">
        <Label className="font-label-md text-label-md text-on-surface">Required Skills</Label>
        <div className="flex gap-2">
          <Input
            placeholder="e.g. React, Node.js"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            className="bg-surface-container-lowest border-outline-variant focus-visible:ring-secondary text-on-surface"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSkill();
              }
            }}
          />
          <Button type="button" variant="outline" className="border-outline-variant text-on-surface hover:bg-surface-variant" onClick={addSkill}>
            Add
          </Button>
        </div>
        
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="flex items-center gap-1.5 px-3 py-1 bg-surface-variant text-on-surface-variant rounded-full text-sm font-medium border border-outline-variant/30"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="transition-colors duration-200 hover:text-error"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        )}
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
              ? "Create Job (Draft)"
              : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
