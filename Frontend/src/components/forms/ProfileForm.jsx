"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@/api/user.api";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { useState } from "react";
import { X } from "lucide-react";
const profileSchema = z.object({
  bio: z.string().max(500, "Bio must be under 500 characters").optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  linkedin: z
    .string()
    .url("Enter a valid LinkedIn URL")
    .optional()
    .or(z.literal("")),
  github: z
    .string()
    .url("Enter a valid GitHub URL")
    .optional()
    .or(z.literal("")),
  portfolio: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  leetcode: z.string().url("Enter a valid URL").optional().or(z.literal("")),
});
export function ProfileForm({ user, onSuccess }) {
  const queryClient = useQueryClient();
  const [skills, setSkills] = useState(user.skills ?? []);
  const [skillInput, setSkillInput] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      bio: user.bio ?? "",
      phone: user.phone ?? "",
      location: user.location ?? "",
      linkedin: user.socialLinks?.linkedin ?? "",
      github: user.socialLinks?.github ?? "",
      portfolio: user.socialLinks?.portfolio ?? "",
      leetcode: user.socialLinks?.leetcode ?? "",
    },
  });
  const mutation = useMutation({
    mutationFn: (data) =>
      userApi.updateProfile({
        bio: data.bio,
        phone: data.phone,
        location: data.location,
        skills,
        socialLinks: {
          linkedin: data.linkedin || undefined,
          github: data.github || undefined,
          portfolio: data.portfolio || undefined,
          leetcode: data.leetcode || undefined,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ME });
      toast.success("Profile updated successfully!");
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update profile");
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
  return (
    <form
      onSubmit={handleSubmit((data) => mutation.mutate(data))}
      className="space-y-5"
    >
      {" "}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {" "}
        <div className="space-y-1.5">
          {" "}
          <Label htmlFor="profile-phone">Phone</Label>{" "}
          <Input
            id="profile-phone"
            placeholder="+91 9876543210"
            {...register("phone")}
          />{" "}
        </div>{" "}
        <div className="space-y-1.5">
          {" "}
          <Label htmlFor="profile-location">Location</Label>{" "}
          <Input
            id="profile-location"
            placeholder="Bangalore, India"
            {...register("location")}
          />{" "}
        </div>{" "}
      </div>{" "}
      <div className="space-y-1.5">
        {" "}
        <Label htmlFor="profile-bio">Bio</Label>{" "}
        <Textarea
          id="profile-bio"
          placeholder="Tell us about yourself..."
          rows={3}
          {...register("bio")}
        />{" "}
        {errors.bio && (
          <p className="text-xs text-red-500">{errors.bio.message}</p>
        )}{" "}
      </div>{" "}
      {/* Skills */}{" "}
      <div className="space-y-2">
        {" "}
        <Label>Skills</Label>{" "}
        <div className="flex gap-2">
          {" "}
          <Input
            placeholder="e.g. React, Python"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSkill();
              }
            }}
          />{" "}
          <Button type="button" variant="outline" onClick={addSkill}>
            {" "}
            Add{" "}
          </Button>{" "}
        </div>{" "}
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {" "}
            {skills.map((skill) => (
              <span
                key={skill}
                className="flex items-center gap-1 px-2.5 py-1 bg-surface-container-low text-on-surface rounded-full text-sm font-medium"
              >
                {" "}
                {skill}{" "}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="transition-colors duration-200 ease-out hover:text-red-500"
                >
                  {" "}
                  <X size={12} />{" "}
                </button>{" "}
              </span>
            ))}{" "}
          </div>
        )}{" "}
      </div>{" "}
      {/* Social Links */}{" "}
      <div className="space-y-3">
        {" "}
        <Label>Social Links</Label>{" "}
        <div className="space-y-2">
          {" "}
          <div className="relative">
            {" "}
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
              {" "}
              🔗{" "}
            </span>{" "}
            <Input
              placeholder="LinkedIn URL"
              className="pl-9"
              {...register("linkedin")}
            />{" "}
          </div>{" "}
          {errors.linkedin && (
            <p className="text-xs text-red-500">{errors.linkedin.message}</p>
          )}{" "}
          <div className="relative">
            {" "}
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
              {" "}
              🐙{" "}
            </span>{" "}
            <Input
              placeholder="GitHub URL"
              className="pl-9"
              {...register("github")}
            />{" "}
          </div>{" "}
          {errors.github && (
            <p className="text-xs text-red-500">{errors.github.message}</p>
          )}{" "}
          <div className="relative">
            {" "}
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
              {" "}
              🌐{" "}
            </span>{" "}
            <Input
              placeholder="Portfolio URL"
              className="pl-9"
              {...register("portfolio")}
            />{" "}
          </div>{" "}
          {errors.portfolio && (
            <p className="text-xs text-red-500">{errors.portfolio.message}</p>
          )}{" "}
          <div className="relative">
            {" "}
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
              {" "}
              💻{" "}
            </span>{" "}
            <Input
              placeholder="LeetCode URL"
              className="pl-9"
              {...register("leetcode")}
            />{" "}
          </div>{" "}
          {errors.leetcode && (
            <p className="text-xs text-red-500">{errors.leetcode.message}</p>
          )}{" "}
        </div>{" "}
      </div>{" "}
      <Button
        type="submit"
        disabled={mutation.isPending}
        className="bg-secondary transition-colors duration-200 ease-out hover:opacity-90 text-on-secondary w-full"
      >
        {" "}
        {mutation.isPending ? "Saving..." : "Save Profile"}{" "}
      </Button>{" "}
    </form>
  );
}
