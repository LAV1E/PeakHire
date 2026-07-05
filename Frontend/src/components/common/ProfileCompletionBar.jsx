"use client";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { ArrowRight } from "lucide-react";
import { ROUTES } from "@/constants/routes";
export function ProfileCompletionBar({ percentage, completed, total }) {
  return (
    <div className="bg-gradient-to-r from-brand-navy to-brand-blue rounded-lg p-5 text-white">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm font-medium text-white/80">
            Profile Completion
          </p>
          <p className="text-2xl font-bold mt-0.5">{percentage}%</p>
        </div>
        <Link
          href={ROUTES.CANDIDATE_PROFILE}
          className="flex items-center gap-1 text-sm font-medium text-on-surface bg-surface-container-lowest transition-colors duration-200 ease-out hover:bg-surface-container-low px-3 py-1.5 rounded-lg"
        >
          Complete Profile <ArrowRight size={14} />
        </Link>
      </div>
      <div className="mb-2">
        <Progress value={percentage} className="h-2 bg-surface-container-lowest/20" />
      </div>
      <p className="text-xs text-white/70">
        {completed} of {total} sections complete
      </p>
    </div>
  );
}
