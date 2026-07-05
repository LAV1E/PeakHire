"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/api/admin.api";
import { PageHeader } from "@/components/common/PageHeader";
import { CompaniesTable } from "@/components/tables/CompaniesTable";
import { toast } from "sonner";
export default function AdminVerificationPage() {
  const queryClient = useQueryClient();
  const { data: companies, isLoading } = useQuery({
    queryKey: ["admin-pending-companies"],
    queryFn: async () => (await adminApi.getPendingCompanies()).companies,
  });
  const verifyMutation = useMutation({
    mutationFn: ({ id, isVerified }) =>
      isVerified ? adminApi.verifyCompany(id) : adminApi.deleteCompany(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-pending-companies"] });
      toast.success("Company verification status updated");
    },
  });
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {" "}
      <PageHeader
        title="Verification Queue"
        description="Verify or reject new companies"
      />{" "}
      <CompaniesTable
        companies={companies ?? []}
        isLoading={isLoading}
        onApprove={(id) => verifyMutation.mutate({ id, isVerified: true })}
        onReject={(id) => verifyMutation.mutate({ id, isVerified: false })}
      />{" "}
    </div>
  );
}
