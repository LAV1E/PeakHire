import { JobForm } from "@/components/forms/JobForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ROUTES } from "@/constants/routes";

export default function CreateJobPage() {
  return (
    <div className="pt-8 pb-12 max-w-3xl mx-auto space-y-6 w-full">
      <div className="flex items-center gap-4 mb-2">
        <Link href={ROUTES.RECRUITER_JOBS} className="p-2 -ml-2 rounded-full hover:bg-surface-variant text-on-surface-variant transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="font-headline-lg text-headline-lg font-bold text-on-background">Create Job</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Post a new job opening for candidates to apply.</p>
        </div>
      </div>
      
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 sm:p-8">
        <JobForm mode="create" />
      </div>
    </div>
  );
}
