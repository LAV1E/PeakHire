import Link from "next/link";
import { ForgotPasswordForm } from "@/components/forms/ForgotPasswordForm";

export const metadata = {
  title: "Forgot Password",
  description: "Reset your PeakHire account password.",
};

export default function ForgotPasswordPage() {
  return (
    <>
      <div className="mb-8 text-center sm:text-left w-full max-w-[380px]">
        <h2 className="font-headline-sm text-headline-sm text-on-surface mb-2">Reset your password</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Enter the email address associated with your account and we&apos;ll send you a link to reset your password.
        </p>
      </div>
      
      <div className="w-full max-w-[380px]">
        <ForgotPasswordForm />
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
