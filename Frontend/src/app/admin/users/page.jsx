"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/api/admin.api";
import { PageHeader } from "@/components/common/PageHeader";
import { UsersTable } from "@/components/tables/UsersTable";
import { toast } from "sonner";
export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => (await adminApi.getUsers()).users,
  });
  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, isActive }) => adminApi.updateUserStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User status updated");
    },
  });
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {" "}
      <PageHeader
        title="Manage Users"
        description="Activate or deactivate platform users"
      />{" "}
      <UsersTable
        users={users ?? []}
        isLoading={isLoading}
        onToggleStatus={(id, currentStatus) =>
          toggleStatusMutation.mutate({ id, isActive: !currentStatus })
        }
      />{" "}
    </div>
  );
}
