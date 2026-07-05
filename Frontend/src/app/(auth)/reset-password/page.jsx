import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/forms/ResetPasswordForm";
import Link from "next/link";

export const metadata = {
  title: "Reset Password",
  description: "Set a new password for your PeakHire account.",
};

export default function ResetPasswordPage() {
  return (
    <>
      <div className="mb-8 text-center sm:text-left w-full max-w-[380px]">
        <h2 className="font-headline-sm text-headline-sm text-on-surface mb-2">Set new password</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Choose a strong password for your account.
        </p>
      </div>
      
      <div className="w-full max-w-[380px]">
        <Suspense fallback={
          <div className="flex justify-center p-4">
            <span className="w-6 h-6 border-2 border-secondary/30 border-t-secondary rounded-full animate-spin" />
          </div>
        }>
          <ResetPasswordForm />
        </Suspense>
      </div>

      <div className="mt-8 text-center w-full max-w-[380px]">
        <Link 
          href="/login" 
          className="inline-flex items-center gap-1.5 font-label-md text-label-md text-secondary hover:text-secondary-container transition-all group"
        >
          <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform duration-200">arrow_back</span>
          Back to login
        </Link>
      </div>
    </>
  );
}
