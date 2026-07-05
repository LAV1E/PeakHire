"use client";
import Link from "next/link";
import { formatCompactCurrency } from "@/utils/currencyFormat";
import { getEmploymentTypeLabel } from "@/utils/statusHelpers";
import Image from "next/image";

export function JobCard({
  job,
  isSaved = false,
  isApplied = false,
  onSave,
  onApply,
  onUnsave,
  showActions = true,
  href,
}) {
  const cardContent = (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md flex flex-col h-full gap-4 hover:shadow-sm hover:border-outline transition-all group cursor-pointer">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          {job.company?.logo?.url ? (
            <Image
              src={job.company.logo.url}
              alt={job.company.name}
              width={48}
              height={48}
              className="w-12 h-12 rounded border border-outline-variant object-cover bg-surface-container-low flex-shrink-0"
            />
          ) : (
            <div className="w-12 h-12 rounded border border-outline-variant bg-surface-container-low flex items-center justify-center flex-shrink-0 text-on-surface-variant">
              <span className="material-symbols-outlined text-[24px]">domain</span>
            </div>
          )}
          <div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-brand-blue transition-colors line-clamp-1">
              {job.title}
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant line-clamp-1">
              {job.company?.name}
            </p>
          </div>
        </div>
        {showActions && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              isSaved ? onUnsave?.(job._id) : onSave?.(job._id);
            }}
            className="text-outline hover:text-secondary transition-colors p-1"
          >
            <span className={`material-symbols-outlined ${isSaved ? "text-secondary fill-icon" : ""}`}>
              {isSaved ? "bookmark" : "bookmark_border"}
            </span>
          </button>
        )}
      </div>

      {/* Meta tags */}
      <div className="flex flex-wrap gap-2 mt-2">
        <span className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm px-2 py-1 rounded-full border border-outline-variant/50">
          {job.workplaceType === "REMOTE" ? "Remote" : job.workplaceType === "HYBRID" ? "Hybrid" : "On-site"}
        </span>
        <span className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm px-2 py-1 rounded-full border border-outline-variant/50">
          {getEmploymentTypeLabel(job.employmentType)}
        </span>
        {job.skills?.slice(0, 2).map((skill) => (
          <span
            key={skill}
            className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm px-2 py-1 rounded-full border border-outline-variant/50 whitespace-nowrap"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-auto pt-4 border-t border-outline-variant flex justify-between items-center flex-wrap gap-2">
        <div className="flex items-center gap-1 text-on-surface-variant font-body-md text-body-md">
          <span className="material-symbols-outlined text-[18px]">location_on</span>{" "}
          <span className="line-clamp-1">{job.location}</span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="font-label-md text-label-md text-on-surface font-semibold whitespace-nowrap">
            {formatCompactCurrency(job.salaryMin)} - {formatCompactCurrency(job.salaryMax)}
          </div>
          
          {showActions && (
            <div className="flex items-center">
              {isApplied ? (
                <span className="font-label-md text-secondary flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span> Applied
                </span>
              ) : (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onApply?.(job._id);
                  }}
                  className="bg-secondary text-on-secondary font-label-sm text-label-sm py-1.5 px-3 rounded hover:opacity-90 transition-opacity"
                >
                  Apply
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {cardContent}
      </Link>
    );
  }
  return cardContent;
}
