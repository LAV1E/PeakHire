"use client";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { companyApi } from "@/api/company.api";
import { PageHeader } from "@/components/common/PageHeader";
import { CompanyForm } from "@/components/forms/CompanyForm";
import { Skeleton } from "@/components/ui/skeleton";
export default function EditCompanyPage() {
  const { data: company, isLoading } = useQuery({
    queryKey: QUERY_KEYS.COMPANY,
    queryFn: async () => (await companyApi.getMyCompany()).company,
  });
  return (
    <div className="max-w-2xl mx-auto">
      {" "}
      <PageHeader
        title="Edit Company"
        description="Update your company information"
      />{" "}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/50 rounded-lg p-6">
        {" "}
        {isLoading ? (
          <div className="space-y-4">
            {" "}
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12" />
            ))}{" "}
          </div>
        ) : (
          <CompanyForm existingData={company} mode="edit" />
        )}{" "}
      </div>{" "}
    </div>
  );
}
