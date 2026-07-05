"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/api/admin.api";
import { companyApi } from "@/api/company.api";
import { PageHeader } from "@/components/common/PageHeader";
import { CompaniesTable } from "@/components/tables/CompaniesTable";
import { toast } from "sonner";

export default function AdminCompaniesPage() {
  const queryClient = useQueryClient();

  const { data: companies, isLoading } = useQuery({
    queryKey: ["admin-all-companies"],
    queryFn: async () => (await adminApi.getAllCompanies()).companies,
  });

  const verifyMutation = useMutation({
    mutationFn: companyApi.verifyCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-all-companies"] });
      toast.success("Company verified successfully");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to verify company");
    },
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {" "}
      <PageHeader
        title="All Companies"
        description="View and manage all registered companies"
      />{" "}
      <CompaniesTable
        companies={companies ?? []}
        isLoading={isLoading}
        onApprove={(id) => verifyMutation.mutate(id)}
      />{" "}
    </div>
  );
}
