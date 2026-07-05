import { StatusBadge } from "@/components/common/StatusBadge";
import { formatDate } from "@/utils/dateUtils";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import Image from "next/image";

export function ApplicationCard({ application, role = "candidate" }) {
  const href =
    role === "recruiter"
      ? ROUTES.RECRUITER_APPLICATION(application._id)
      : ROUTES.CANDIDATE_APPLICATION(application._id);

  return (
    <Link href={href} className="block w-full">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-sm hover:border-[#CBD5E1] transition-all cursor-pointer group">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="w-12 h-12 rounded-md bg-surface-container border border-outline-variant/50 flex-shrink-0 flex items-center justify-center overflow-hidden">
            {role === "recruiter" ? (
              application.candidate?.avatar?.url ? (
                <Image
                  src={application.candidate.avatar.url}
                  alt={application.candidate.name || "Candidate"}
                  width={32}
                  height={32}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="material-symbols-outlined text-outline text-[24px]">person</span>
              )
            ) : (
              application.job?.company?.logo?.url ? (
                <Image
                  src={application.job.company.logo.url}
                  alt={application.job.company.name || "Company"}
                  width={32}
                  height={32}
                  className="object-contain"
                />
              ) : (
                <span className="material-symbols-outlined text-outline text-[24px]">domain</span>
              )
            )}
          </div>
          <div className="flex flex-col">
            <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-brand-blue transition-colors line-clamp-1">
              {role === "recruiter" ? application.candidate?.name : application.job?.title}
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant line-clamp-1">
              {role === "recruiter" 
                ? `${application.candidate?.email || "No email"}` 
                : `${application.job?.company?.name} ${application.job?.location ? `• ${application.job.location}` : ''}`}
            </p>
            <p className="font-helper-text text-helper-text text-outline mt-1 hidden sm:block">
              Applied on {formatDate(application.createdAt)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-between w-full sm:w-auto gap-4 sm:gap-6 mt-2 sm:mt-0">
          <p className="font-helper-text text-helper-text text-outline sm:hidden block">
            {formatDate(application.createdAt)}
          </p>
          <StatusBadge status={application.status} variant="application" />
          <button 
            className="text-on-surface-variant hover:text-primary transition-colors"
            onClick={(e) => {
              // Just a UI element for now, prevent navigation if we had a menu
            }}
          >
            <span className="material-symbols-outlined">more_vert</span>
          </button>
        </div>
      </div>
    </Link>
  );
}
