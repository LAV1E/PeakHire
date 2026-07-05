import Link from "next/link";
import { LoginForm } from "@/components/forms/LoginForm";

export const metadata = {
  title: "Sign In",
  description: "Sign in to your PeakHire account to access your dashboard.",
};

export default function LoginPage() {
  return (
    <>
      {/* Form Header */}
      <div className="mb-10 text-center lg:text-left">
        <h2 className="font-headline-lg text-headline-lg text-[#1E293B] mb-2">Welcome back</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">Sign in to your account to continue.</p>
      </div>
      
      <LoginForm />
      
      {/* Footer */}
      <div className="mt-8 text-center lg:text-left">
        <p className="font-body-md text-body-md text-on-surface-variant">
          Don&apos;t have an account? 
          <Link href="/register" className="font-label-md text-label-md text-[#2563EB] hover:text-secondary-fixed-variant transition-colors ml-1">
            Register here
          </Link>
        </p>
      </div>
    </>
  );
}
