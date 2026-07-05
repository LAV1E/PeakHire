"use client";
import { useSearchParams } from "next/navigation";
import { OtpForm } from "@/components/forms/OtpForm";
import Link from "next/link";

export function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email =
    searchParams.get("email") ||
    (typeof window !== "undefined"
      ? sessionStorage.getItem("verifyEmail")
      : "") ||
    "";
    
  return (
    <div className="flex flex-col items-center text-center">
      {/* Icon Badge */}
      <div className="w-16 h-16 bg-secondary-fixed flex items-center justify-center rounded-full mb-6 ring-4 ring-surface-container-low transition-transform duration-300 hover:scale-105">
        <span
          className="material-symbols-outlined text-secondary text-3xl"
          style={{ fontVariationSettings: "'FILL' 0" }}
        >
          mail
        </span>
      </div>

      {/* Headings */}
      <h1 className="font-headline-md text-headline-md text-on-surface mb-2">
        Verify your email
      </h1>
      <p className="font-body-md text-body-md text-on-surface-variant mb-8">
        We sent a verification code to <br />
        <span className="font-label-md text-on-surface">
          {email || "your email"}
        </span>
      </p>

      {email ? (
        <div className="w-full">
          <OtpForm email={email} />
        </div>
      ) : (
        <div className="text-center text-error font-body-md">
          No email found. Please{" "}
          <Link href="/register" className="font-label-md text-secondary hover:underline">
            register again
          </Link>
          .
        </div>
      )}
      
      {/* Contextual Back Link */}
      <div className="mt-8 text-center w-full">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">
            arrow_back
          </span>
          Back to login
        </Link>
      </div>
    </div>
  );
}
