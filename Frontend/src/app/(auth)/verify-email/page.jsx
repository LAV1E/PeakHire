import { Suspense } from "react";
import { VerifyEmailContent } from "./VerifyEmailContent";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export const metadata = {
  title: "Verify Email",
  description: "Verify your email address to activate your PeakHire account.",
};
export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={<div className="text-center text-slate-500 dark:text-slate-400"><LoadingSpinner /></div>}
    >
      {" "}
      <VerifyEmailContent />{" "}
    </Suspense>
  );
}
