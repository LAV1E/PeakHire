"use client";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { companyApi } from "@/api/company.api";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function RecruiterCompanyPage() {
  const router = useRouter();
  
  const {
    data: company,
    isLoading,
    isError,
  } = useQuery({
    queryKey: QUERY_KEYS.COMPANY,
    queryFn: async () => {
      const res = await companyApi.getMyCompany();
      return res.company;
    },
    retry: false,
  });
  
  useEffect(() => {
    if (isError) router.push(ROUTES.RECRUITER_COMPANY_CREATE);
  }, [isError, router]);
  
  if (isLoading) {
    return (
      <div className="pt-8 pb-12 max-w-container_max mx-auto space-y-4 min-h-[calc(100vh-64px)] w-full">
        <Skeleton className="h-10 w-48 bg-surface-container-highest" />
        <Skeleton className="h-48 rounded-xl bg-surface-container-highest" />
        <Skeleton className="h-32 rounded-xl bg-surface-container-highest" />
      </div>
    );
  }
  
  if (!company) return null;

  return (
    <div className="pt-8 pb-12 max-w-container_max mx-auto space-y-6 min-h-[calc(100vh-64px)] w-full flex flex-col">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h2 className="font-headline-lg text-headline-lg font-bold text-on-background">My Company</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Manage your employer brand and settings.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href={ROUTES.RECRUITER_COMPANY_EDIT}>
            <button className="bg-surface border border-outline-variant text-on-surface font-label-md text-label-md py-2.5 px-5 rounded-lg flex items-center justify-center gap-2 hover:bg-surface-container-low transition-colors shadow-sm">
              <span className="material-symbols-outlined text-[18px]">edit</span>
              Edit Profile
            </button>
          </Link>
        </div>
      </div>

      {!company.isVerified && (
        <div className="bg-[#FFF8E1] border border-[#FFE082] rounded-lg p-4 flex items-start gap-3 shadow-sm">
          <span className="material-symbols-outlined text-[#FF8F00] mt-0.5">warning</span>
          <div>
            <h3 className="font-label-md text-label-md font-semibold text-[#FF8F00]">Pending Approval</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              Your company is awaiting admin verification. Job posting will be enabled once approved.
            </p>
          </div>
        </div>
      )}

      {/* Main Profile Card */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col md:flex-row gap-6 relative overflow-hidden">
        {/* Decorative background blur */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container opacity-5 blur-[100px] rounded-full pointer-events-none"></div>
        
        {/* Logo Section */}
        <div className="flex-shrink-0">
          <div className="w-32 h-32 rounded-xl bg-surface-variant flex items-center justify-center border border-outline-variant overflow-hidden relative">
            {company.logo?.url ? (
              <Image
                src={company.logo.url}
                alt={company.name}
                fill
                className="object-contain p-2"
              />
            ) : (
              <span className="material-symbols-outlined text-[48px] text-on-surface-variant">apartment</span>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="font-headline-md text-headline-md font-bold text-on-background truncate">
              {company.name}
            </h1>
            <span className={cn(
              "px-3 py-1 rounded-full font-label-sm text-label-sm flex items-center gap-1",
              company.isVerified 
                ? "bg-secondary-container/10 text-secondary border border-secondary/20" 
                : "bg-[#FFF8E1] text-[#FF8F00] border border-[#FFE082]"
            )}>
              {company.isVerified ? (
                <>
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  Verified
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[14px]">hourglass_empty</span>
                  Pending
                </>
              )}
            </span>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-3 mb-6 mt-4">
            <div className="flex items-center gap-2 text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px]">location_on</span>
              <span className="font-body-md text-body-md">{company.location || "Location not set"}</span>
            </div>
            
            <div className="flex items-center gap-2 text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px]">group</span>
              <span className="font-body-md text-body-md">{company.companySize || "Size not set"} employees</span>
            </div>
            
            <div className="flex items-center gap-2 text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px]">domain</span>
              <span className="font-body-md text-body-md">{company.industry || "Industry not set"}</span>
            </div>

            {company.website && (
              <div className="flex items-center gap-2 text-secondary hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[18px]">language</span>
                <a href={company.website} target="_blank" rel="noopener noreferrer" className="font-body-md text-body-md font-medium hover:underline">
                  Website
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Description */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-background mb-4">About the Company</h3>
            {company.description ? (
              <p className="font-body-md text-body-md text-on-surface-variant whitespace-pre-wrap leading-relaxed">
                {company.description}
              </p>
            ) : (
              <p className="font-body-md text-body-md text-outline italic">No description provided yet.</p>
            )}
          </div>
        </div>

        {/* Right Column - Team */}
        <div className="space-y-6">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-background">Team Members</h3>
              <span className="px-2.5 py-1 rounded-full font-label-sm text-label-sm bg-primary-fixed-dim text-on-primary-fixed border border-outline-variant/30 font-semibold">
                Coming Soon
              </span>
            </div>
            
            <div className="opacity-50 pointer-events-none">
              <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                Invite teammates and manage recruiter access roles. Collaborate on hiring.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-variant"></div>
                  <div>
                    <div className="h-4 w-24 bg-surface-variant rounded mb-1"></div>
                    <div className="h-3 w-16 bg-surface-variant/50 rounded"></div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-variant"></div>
                  <div>
                    <div className="h-4 w-28 bg-surface-variant rounded mb-1"></div>
                    <div className="h-3 w-20 bg-surface-variant/50 rounded"></div>
                  </div>
                </div>
              </div>
              
              <button disabled className="w-full mt-6 border border-outline-variant text-on-surface-variant font-label-md text-label-md py-2 rounded-lg border-dashed">
                + Invite Member
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
