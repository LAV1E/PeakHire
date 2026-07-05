"use client";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/api/user.api";
import { PageHeader } from "@/components/common/PageHeader";
import { AvatarWithFallback } from "@/components/common/AvatarWithFallback";
import { formatDate } from "@/utils/dateUtils";

export default function CandidateProfilePage({ params }) {
  const { id } = params;

  const { data: profile, isLoading } = useQuery({
    queryKey: ["candidate-public-profile", id],
    queryFn: async () => {
      const res = await userApi.publicProfile(id);
      return res.profile;
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-pulse">
        <div className="h-12 bg-surface-container rounded-lg w-1/3 mb-6"></div>
        <div className="bg-surface-container h-48 rounded-lg mb-6"></div>
        <div className="bg-surface-container h-64 rounded-lg"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-3xl mx-auto flex flex-col items-center justify-center py-20 bg-surface-container-lowest rounded-lg border border-outline-variant mt-10">
        <span className="material-symbols-outlined text-[48px] text-outline mb-4">person_off</span>
        <h3 className="font-headline-sm text-headline-sm text-on-surface">Candidate Not Found</h3>
        <p className="font-body-md text-body-md text-on-surface-variant">This candidate may not exist or has set their profile to private.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <PageHeader 
        title="Candidate Profile" 
        description="View candidate details, experience, and skills."
        backUrl="/recruiter/applications"
      />

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        {/* Profile Header */}
        <div className="p-6 sm:p-8 bg-surface-bright border-b border-outline-variant flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <AvatarWithFallback
            src={profile.avatar?.url}
            name={profile.name}
            size="xl"
            className="w-24 h-24 border-4 border-surface"
          />
          <div className="flex-1 text-center sm:text-left flex flex-col gap-2">
            <h2 className="font-headline-lg text-headline-lg text-on-surface">{profile.name}</h2>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4 font-body-md text-body-md text-on-surface-variant">
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">mail</span> {profile.email}</span>
              {profile.phone && <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">call</span> {profile.phone}</span>}
            </div>
            {profile.bio && <p className="font-body-md text-body-md text-on-surface mt-2 bg-surface-container-lowest p-3 rounded-md border border-outline-variant/30">{profile.bio}</p>}
          </div>
          {profile.resume?.url && (
            <a 
              href={profile.resume.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-primary-container text-on-primary-container hover:bg-primary-container/80 transition-colors px-4 py-2 rounded-lg font-label-md text-label-md flex items-center gap-2 self-center sm:self-start whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[18px]">description</span>
              View Resume
            </a>
          )}
        </div>

        {/* Profile Content */}
        <div className="p-6 sm:p-8 flex flex-col gap-8">
          {/* Skills */}
          {profile.skills?.length > 0 && (
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">psychology</span> Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <span key={index} className="bg-secondary-container/50 border border-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-md text-label-md">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {profile.experience?.length > 0 && (
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">work</span> Experience
              </h3>
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-outline-variant before:to-transparent">
                {profile.experience.map((exp, index) => (
                  <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    {/* Icon */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-surface bg-surface-container-high shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow flex-shrink-0 z-10">
                      <span className="material-symbols-outlined text-on-surface-variant text-[20px]">apartment</span>
                    </div>
                    {/* Card */}
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-surface-container-low p-4 rounded-lg border border-outline-variant hover:border-secondary transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
                        <h4 className="font-label-lg text-label-lg font-bold text-on-surface">{exp.role}</h4>
                        <span className="font-helper-text text-helper-text text-on-surface-variant/80">
                          {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                        </span>
                      </div>
                      <p className="font-body-md text-body-md text-on-surface-variant font-medium mb-2">{exp.company}</p>
                      {exp.description && <p className="font-body-sm text-body-sm text-on-surface-variant/90">{exp.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {profile.education?.length > 0 && (
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">school</span> Education
              </h3>
              <div className="space-y-4">
                {profile.education.map((edu, index) => (
                  <div key={index} className="bg-surface-container-low p-4 rounded-lg border border-outline-variant">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h4 className="font-label-lg text-label-lg font-bold text-on-surface">{edu.degree} in {edu.fieldOfStudy}</h4>
                        <p className="font-body-md text-body-md text-on-surface-variant">{edu.institution}</p>
                      </div>
                      <span className="bg-surface-container-high text-on-surface-variant px-2 py-1 rounded font-helper-text text-helper-text">
                        {edu.startYear} - {edu.endYear || "Present"}
                      </span>
                    </div>
                    {edu.cgpa && <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">CGPA: {edu.cgpa}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
