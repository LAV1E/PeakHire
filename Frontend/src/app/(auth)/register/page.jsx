import Link from "next/link";
import { RegisterForm } from "@/components/forms/RegisterForm";

export const metadata = {
  title: "Create Account",
  description: "Sign up for PeakHire to start your hiring journey.",
};

export default function RegisterPage() {
  return (
    <>
      <div className="w-full max-w-md">
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-8">Create your account</h2>
      </div>
      
      <RegisterForm />
      
      <div className="w-full max-w-md">
        <p className="mt-8 text-center font-body-md text-body-md text-on-surface-variant">
          Already have an account?{" "}
          <Link href="/login" className="text-secondary font-medium hover:underline ml-1">
            Log in
          </Link>
        </p>
      </div>
    </>
  );
}
