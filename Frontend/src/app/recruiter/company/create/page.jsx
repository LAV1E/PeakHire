import { PageHeader } from "@/components/common/PageHeader";
import { CompanyForm } from "@/components/forms/CompanyForm";
export default function CreateCompanyPage() {
  return (
    <div className="max-w-2xl mx-auto">
      {" "}
      <PageHeader
        title="Create Company"
        description="Set up your company profile to start hiring"
      />{" "}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/50 rounded-lg p-6">
        {" "}
        <CompanyForm mode="create" />{" "}
      </div>{" "}
    </div>
  );
}
