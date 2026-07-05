"use client";
import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { userApi } from "@/api/user.api";
import { AvatarWithFallback } from "@/components/common/AvatarWithFallback";
import { ProfileForm } from "@/components/forms/ProfileForm";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { formatMonthYear } from "@/utils/dateUtils";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ConfirmModal } from "@/components/modals/ConfirmModal";

const experienceSchema = z.object({
  role: z.string().min(2, "Role is required"),
  company: z.string().min(2, "Company is required"),
  location: z.string().min(2, "Location is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  isCurrent: z.boolean().default(false),
  description: z.string().optional(),
});

const educationSchema = z.object({
  degree: z.string().min(2, "Degree is required"),
  college: z.string().min(2, "College/Institution is required"),
  fieldOfStudy: z.string().min(2, "Field of study is required"),
  startYear: z.coerce.number().min(1950).max(2100),
  endYear: z.coerce.number().optional(),
});

export default function CandidateProfilePage() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [expModalOpen, setExpModalOpen] = useState(false);
  const [eduModalOpen, setEduModalOpen] = useState(false);
  const [deleteExpId, setDeleteExpId] = useState(null);
  const [deleteEduId, setDeleteEduId] = useState(null);

  const { data: user, isLoading } = useQuery({
    queryKey: QUERY_KEYS.ME,
    queryFn: async () => {
      const res = await userApi.me();
      return res.profile;
    },
  });

  const avatarMutation = useMutation({
    mutationFn: (file) => userApi.uploadAvatar(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ME });
      toast.success("Avatar updated!");
    },
    onError: () => toast.error("Failed to upload avatar"),
  });

  const deleteExpMutation = useMutation({
    mutationFn: (id) =>
      userApi.updateProfile({
        experience: user?.experience?.filter((e) => e._id !== id),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ME });
      toast.success("Experience removed");
      setDeleteExpId(null);
    },
  });

  const deleteEduMutation = useMutation({
    mutationFn: (id) =>
      userApi.updateProfile({
        education: user?.education?.filter((e) => e._id !== id),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ME });
      toast.success("Education removed");
      setDeleteEduId(null);
    },
  });

  const expForm = useForm({
    resolver: zodResolver(experienceSchema),
  });

  const addExpMutation = useMutation({
    mutationFn: (data) =>
      userApi.updateProfile({
        experience: [...(user?.experience || []), data],
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ME });
      toast.success("Experience added!");
      setExpModalOpen(false);
      expForm.reset();
    },
    onError: () => toast.error("Failed to add experience"),
  });

  const eduForm = useForm({
    resolver: zodResolver(educationSchema),
  });

  const addEduMutation = useMutation({
    mutationFn: (data) =>
      userApi.updateProfile({ education: [...(user?.education || []), data] }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ME });
      toast.success("Education added!");
      setEduModalOpen(false);
      eduForm.reset();
    },
    onError: () => toast.error("Failed to add education"),
  });

  if (isLoading) {
    return (
      <div className="max-w-container_max mx-auto space-y-8 animate-pulse">
        <div className="h-48 bg-surface-container rounded-xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 h-96 bg-surface-container rounded-xl"></div>
          <div className="md:col-span-2 h-96 bg-surface-container rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-container_max mx-auto space-y-8 pb-12">
      {/* Header Section */}
      <section className="bg-surface rounded-xl border border-outline-variant p-8 flex flex-col md:flex-row items-center md:items-start gap-6 relative">
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => setEditingProfile(!editingProfile)}
            className="px-4 py-2 bg-surface text-secondary border border-outline-variant rounded-lg font-label-md text-label-md hover:bg-surface-variant transition-colors shadow-sm flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
            {editingProfile ? "Cancel Edit" : "Edit Profile"}
          </button>
        </div>
        
        <div className="flex flex-col items-center gap-3">
          <div 
            className="w-32 h-32 rounded-full overflow-hidden border-4 border-surface shadow-sm relative group cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            {user?.avatar?.url ? (
              <img src={user.avatar.url} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <AvatarWithFallback src="" name={user.name} size="xl" className="w-full h-full text-4xl" />
            )}
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              {avatarMutation.isPending ? (
                <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span className="material-symbols-outlined text-on-primary">photo_camera</span>
              )}
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) avatarMutation.mutate(file);
            }}
          />
        </div>

        <div className="flex flex-col items-center md:items-start text-center md:text-left mt-2 md:mt-4">
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">{user.name}</h1>
          {user.bio && (
            <h2 className="font-headline-sm text-headline-sm text-secondary mb-4">{user.bio}</h2>
          )}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-on-surface-variant font-body-md text-body-md">
            {user.socialLinks?.linkedin && (
              <div className="flex items-center gap-1.5 text-secondary">
                <span className="material-symbols-outlined text-[18px]">link</span>
                <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">LinkedIn</a>
              </div>
            )}
            {user.socialLinks?.github && (
              <div className="flex items-center gap-1.5 text-secondary">
                <span className="material-symbols-outlined text-[18px]">link</span>
                <a href={user.socialLinks.github} target="_blank" rel="noopener noreferrer" className="hover:underline">GitHub</a>
              </div>
            )}
            {user.socialLinks?.portfolio && (
              <div className="flex items-center gap-1.5 text-secondary">
                <span className="material-symbols-outlined text-[18px]">link</span>
                <a href={user.socialLinks.portfolio} target="_blank" rel="noopener noreferrer" className="hover:underline">Portfolio</a>
              </div>
            )}
          </div>
        </div>
      </section>

      {editingProfile && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-surface rounded-xl border border-outline-variant p-6"
        >
          <ProfileForm
            user={user}
            onSuccess={() => setEditingProfile(false)}
          />
        </motion.div>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column (Contact & Skills) */}
        <div className="md:col-span-1 space-y-8">
          {/* Contact Information */}
          <section className="bg-surface rounded-xl border border-outline-variant p-6">
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4">Contact Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 uppercase">Email Address</label>
                <div className="font-body-md text-body-md text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-outline">mail</span>
                  {user.email}
                </div>
              </div>
            </div>
          </section>

          {/* Skills Section */}
          <section className="bg-surface rounded-xl border border-outline-variant p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Core Skills</h3>
              <button 
                onClick={() => {
                  setEditingProfile(true);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
                className="text-on-surface-variant hover:text-secondary transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">edit</span>
              </button>
            </div>
            
            {user.skills?.length ? (
              <div className="flex flex-wrap gap-2">
                {user.skills.map(skill => (
                  <div key={skill} className="px-3 py-1.5 bg-surface-variant text-on-surface border border-outline-variant rounded-lg font-label-sm text-label-sm flex items-center gap-1 cursor-default">
                    {skill}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-on-surface-variant">No skills added yet.</p>
            )}
          </section>
        </div>

        {/* Right Column (Experience & Education) */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Experience Section */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[24px]">work</span>
                Experience
              </h3>
            </div>
            
            <div className="space-y-4">
              {user.experience?.map((exp) => (
                <div key={exp._id} className="bg-surface rounded-xl border border-outline-variant p-6 hover:shadow-sm transition-shadow group">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-label-md text-label-md text-on-surface font-semibold text-lg">{exp.role}</h4>
                      <div className="font-body-md text-body-md text-secondary mt-1">{exp.company} • {exp.location}</div>
                      <div className="font-helper-text text-helper-text text-on-surface-variant mt-1">
                        {formatMonthYear(exp.startDate)} – {exp.isCurrent ? "Present" : exp.endDate ? formatMonthYear(exp.endDate) : ""}
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setDeleteExpId(exp._id)}
                        className="text-on-surface-variant hover:text-error transition-colors p-1 rounded hover:bg-surface-variant"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                  {exp.description && (
                    <p className="font-body-md text-body-md text-on-surface mt-4 whitespace-pre-wrap">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}

              <button 
                onClick={() => setExpModalOpen(true)}
                className="w-full py-3 border border-dashed border-outline-variant rounded-xl text-on-surface-variant font-label-md text-label-md hover:border-secondary hover:text-secondary hover:bg-surface transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">add</span>
                Add Experience
              </button>
            </div>
          </section>

          {/* Education Section */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[24px]">school</span>
                Education
              </h3>
            </div>
            
            <div className="space-y-4">
              {user.education?.map((edu) => (
                <div key={edu._id} className="bg-surface rounded-xl border border-outline-variant p-6 hover:shadow-sm transition-shadow group">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-label-md text-label-md text-on-surface font-semibold text-lg">{edu.degree} in {edu.fieldOfStudy}</h4>
                      <div className="font-body-md text-body-md text-secondary mt-1">{edu.college}</div>
                      <div className="font-helper-text text-helper-text text-on-surface-variant mt-1">
                        {edu.startYear} – {edu.endYear ?? "Present"}
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setDeleteEduId(edu._id)}
                        className="text-on-surface-variant hover:text-error transition-colors p-1 rounded hover:bg-surface-variant"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <button 
                onClick={() => setEduModalOpen(true)}
                className="w-full py-3 border border-dashed border-outline-variant rounded-xl text-on-surface-variant font-label-md text-label-md hover:border-secondary hover:text-secondary hover:bg-surface transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">add</span>
                Add Education
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* Experience Modal */}
      <Dialog open={expModalOpen} onOpenChange={setExpModalOpen}>
        <DialogContent className="bg-surface border border-outline-variant">
          <DialogHeader>
            <DialogTitle className="text-on-surface">Add Experience</DialogTitle>
          </DialogHeader>
          <form onSubmit={expForm.handleSubmit((d) => addExpMutation.mutate(d))} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-on-surface">Role</Label>
                <Input className="bg-surface-container-low border-outline-variant text-on-surface" {...expForm.register("role")} />
                {expForm.formState.errors.role && (
                  <p className="text-xs text-error mt-1">{String(expForm.formState.errors.role.message)}</p>
                )}
              </div>
              <div>
                <Label className="text-on-surface">Company</Label>
                <Input className="bg-surface-container-low border-outline-variant text-on-surface" {...expForm.register("company")} />
                {expForm.formState.errors.company && (
                  <p className="text-xs text-error mt-1">{String(expForm.formState.errors.company.message)}</p>
                )}
              </div>
            </div>
            <div>
              <Label className="text-on-surface">Location</Label>
              <Input className="bg-surface-container-low border-outline-variant text-on-surface" {...expForm.register("location")} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-on-surface">Start Date</Label>
                <Input className="bg-surface-container-low border-outline-variant text-on-surface" type="month" {...expForm.register("startDate")} />
              </div>
              <div>
                <Label className="text-on-surface">End Date</Label>
                <Input className="bg-surface-container-low border-outline-variant text-on-surface" type="month" {...expForm.register("endDate")} disabled={expForm.watch("isCurrent")} />
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...expForm.register("isCurrent")} className="accent-secondary" />
              <span className="font-body-md text-body-md text-on-surface">Currently working here</span>
            </label>
            <div>
              <Label className="text-on-surface">Description</Label>
              <Textarea className="bg-surface-container-low border-outline-variant text-on-surface" rows={3} {...expForm.register("description")} />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" className="border-outline-variant text-on-surface hover:bg-surface-container-low" onClick={() => setExpModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={addExpMutation.isPending} className="bg-primary-container text-on-primary hover:bg-primary-container/90">
                {addExpMutation.isPending ? "Saving..." : "Add Experience"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Education Modal */}
      <Dialog open={eduModalOpen} onOpenChange={setEduModalOpen}>
        <DialogContent className="bg-surface border border-outline-variant">
          <DialogHeader>
            <DialogTitle className="text-on-surface">Add Education</DialogTitle>
          </DialogHeader>
          <form onSubmit={eduForm.handleSubmit((d) => addEduMutation.mutate(d))} className="space-y-4">
            <div>
              <Label className="text-on-surface">Degree</Label>
              <Input className="bg-surface-container-low border-outline-variant text-on-surface" {...eduForm.register("degree")} placeholder="Bachelor of Technology" />
            </div>
            <div>
              <Label className="text-on-surface">Institution/College</Label>
              <Input className="bg-surface-container-low border-outline-variant text-on-surface" {...eduForm.register("college")} placeholder="IIT Bombay" />
            </div>
            <div>
              <Label className="text-on-surface">Field of Study</Label>
              <Input className="bg-surface-container-low border-outline-variant text-on-surface" {...eduForm.register("fieldOfStudy")} placeholder="Computer Science" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-on-surface">Start Year</Label>
                <Input className="bg-surface-container-low border-outline-variant text-on-surface" type="number" {...eduForm.register("startYear")} placeholder="2018" />
              </div>
              <div>
                <Label className="text-on-surface">End Year</Label>
                <Input className="bg-surface-container-low border-outline-variant text-on-surface" type="number" {...eduForm.register("endYear")} placeholder="2022" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" className="border-outline-variant text-on-surface hover:bg-surface-container-low" onClick={() => setEduModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={addEduMutation.isPending} className="bg-primary-container text-on-primary hover:bg-primary-container/90">
                {addEduMutation.isPending ? "Saving..." : "Add Education"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmModal
        open={!!deleteExpId}
        onOpenChange={() => setDeleteExpId(null)}
        title="Remove Experience"
        description="Are you sure you want to remove this experience?"
        confirmLabel="Remove"
        onConfirm={() => deleteExpMutation.mutate(deleteExpId)}
        isLoading={deleteExpMutation.isPending}
      />
      <ConfirmModal
        open={!!deleteEduId}
        onOpenChange={() => setDeleteEduId(null)}
        title="Remove Education"
        description="Are you sure you want to remove this education?"
        confirmLabel="Remove"
        onConfirm={() => deleteEduMutation.mutate(deleteEduId)}
        isLoading={deleteEduMutation.isPending}
      />
    </div>
  );
}
